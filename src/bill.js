"use strict";
const Commando = require('discord.js-commando');
const Discord = require('discord.js');
const path = require('path');
const persistentCollection = require('djs-collection-persistent');
const sqlite = require('sqlite');

const makeBillEmbed = require("./util/billEmbed.js")
const sevendtdRequest = require("./util/7dtdRequest.js")
const billLogger = require("./service/billLogging.js")
const appConfig = require('../config.json');

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
  client.user.setGame(client.commandPrefix + "botinfo");
  client.makeBillEmbed = makeBillEmbed
  client.sevendtdRequest = new sevendtdRequest(client);
  client.logger.info('Bill\'s  ready!');
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

client.botStats = new persistentCollection({
  name: 'botStats',
  dataDir: '../data'
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
