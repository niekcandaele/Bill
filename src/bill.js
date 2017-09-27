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
const webApp = require("./web/app.js")

const client = new Commando.Client({
  owner: appConfig.owner,
  commandPrefix: appConfig.prefix,
  invite: appConfig.developerServer,
  unknownCommandResponse: false,
});

client.config = appConfig
webApp.discordClient = client;
client.logger = billLogger(client);
webApp.logger = client.logger
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
  client.sevendtdRequest = new sevendtdRequest(client);
  client.user.setGame(client.config.website)
  client.logger.info('Bill\'s  ready!');

  // Wait a couple seconds to init 7DTD servers so the guild settings can init first
  setTimeout(function() {
    client.logger.info("Initializing 7DTD server instances")
    init7DTD()
  }, 1000)

  async function init7DTD() {
    const Guilds = client.guilds.values()
    for (var guild of Guilds) {
      let IP = await guild.settings.get("webPort")
      if (IP) {
        client.logger.debug(`Guild ${guild.id} has a 7DTD server! Creating class`)
        guild.sevendtdServer = new sevendtdServer(guild)
      }
    }
  }

})

client.on("guildCreate", guild => {
  client.logger.info("New guild added " + guild.name);
});

client.on("guildDelete", guild => {
  client.logger.info("Deleting guild -- " + guild.name);
  guild.settings.clear()
});

client.on('commandRun', (command, promise, message, args) => {
  client.logger.info("COMMAND RAN: " + message.author.username + " ran " + command.name + " on " + message.guild.name);
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
