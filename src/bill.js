"use strict";
const Commando = require('discord.js-commando');
const Discord = require('discord.js');
const path = require('path');
const persistentCollection = require('djs-collection-persistent');
const sqlite = require('sqlite');

const sevendtdRequest = require("./util/7dtdRequest.js")
const sevendtdServer = require("./model/sevendtdServer.js")
const makeBillEmbed = require("./util/billEmbed.js")
const billLogger = require("./service/billLogging.js")
const appConfig = require('../config.json');

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    console.log(reason.stack)
        // application specific logging, throwing an error, or other logic here
});

const client = new Commando.Client({
    owner: appConfig.owner,
    commandPrefix: appConfig.prefix,
    invite: appConfig.developerServer,
    unknownCommandResponse: false,
});

client.config = appConfig
client.logger = billLogger(client);
client.setProvider(
    sqlite.open(path.join(client.config.dataDir, 'settings.sqlite3')).then(db => new Commando.SQLiteProvider(db))
).catch(client.logger.error);

client.logger.info('Bill signing in.');
client.login(client.config.token);

client.on('ready', () => {
    client.botStats = new persistentCollection({
        name: 'botStats',
        dataDir: client.config.dataDir
    });
    client.user.setGame(client.commandPrefix + "botinfo");
    client.makeBillEmbed = makeBillEmbed
    client.logger.info('Bill\'s  ready!');

    // Wait a couple seconds to init 7DTD servers so the guild settings can init first
    setTimeout(function() {
        client.logger.info("Initializing 7DTD server instances")
        init7DTD()
    }, 1000)

    async function init7DTD() {
        const Guilds = client.guilds.values()
        for (var guild of Guilds) {
            let IP = await guild.settings.get("serverip")
            if (IP) {
                client.logger.debug(`Guild ${guild.id} has a 7DTD server! Creating class`)
                guild.sevendtdServer = new sevendtdServer(guild)
                guild.sevendtdServer.logService.initialize()
            }
        }
    }

})

client.on("commandError", (command, error) => {
    client.logger.error(`Command error! ${command.memberName} trace: ${error.stack}`)
})

// Listen for messages in chat bridge channels
client.on("message", message => {
    if (message.channel.type == "text") {
        let guild = message.guild
        let channel = message.channel
        const chatConfig = guild.settings.get("chatBridge")
        if (guild.sevendtdServer && chatConfig.chatChannelID == message.channel.id && message.author != client.user && !message.content.startsWith(guild.commandPrefix)) {
            client.logger.debug("Message in chat channel detected, sending to game!")
            guild.sevendtdServer.sayIngame(`[${message.author.username}]: ${message.content}`)
        }
    }
})

client.on("guildCreate", guild => {
    client.logger.info("New guild added " + guild.name);
});

client.on("guildDelete", guild => {
    client.logger.info("Deleting guild -- " + guild.name);
    guild.sevendtdServer.destroy()
    guild.settings.clear()
});

client.on('commandRun', (command, promise, message, args) => {
    if (message.channel.type == "dm" || message.channel.type == "group") {
        client.logger.info(`COMMAND RAN: ${message.author.username} ran ${command.name} in a DM channel.`)
    } else {
        client.logger.info("COMMAND RAN: " + message.author.username + " ran " + command.name + " on " + message.guild.name);
    }
    var cmdsRan = client.botStats.get('cmdsRan');
    client.botStats.set('cmdsRan', cmdsRan + 1);
});




// Registers all built-in groups, commands, and argument types
client.registry.registerGroups([
        ['7dtd', '7 Days to die commands'],
        ['admin', 'Administrator commands'],
        ['config', 'configuration commands']
    ])
    .registerDefaults()
    .registerCommandsIn(path.join(__dirname, 'commands'));

process.on('uncaughtException', function(err) {
    client.logger.error(err);
});