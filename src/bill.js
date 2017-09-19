"use strict";
const Commando = require('discord.js-commando');
const Discord = require('discord.js');
const request = require('request-promise');
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
client.sevendtdRequest = new sevendtdRequest(client);
client.setProvider(
    sqlite.open(path.join(client.config.dataDir, 'settings.sqlite3')).then(db => new Commando.SQLiteProvider(db))
).catch(client.logger.error);
client.logger.info('Bill signing in.');
client.login(client.config.token);



client.on('ready', () => {
  client.user.setGame(client.commandPrefix + "botinfo");

  client.makeBillEmbed = function() {
    const Colours = [
      'D2FF28',
      'D6F599',
      '436436',
      'C84C09'
    ]
    var randomColour = Colours[Math.floor(Math.random() * Colours.length)]
    var embed = new Discord.RichEmbed()
      //    .setTitle("Bill - A discord bot for 7 days to die")
      .setColor(randomColour)
      .setTimestamp()
      .setURL("https://niekcandaele.github.io/Bill/")
      .setFooter("-", "http://i.imgur.com/5bm3jzh.png")
      .setThumbnail("http://i.imgur.com/5bm3jzh.png")
    return embed
  }




  client.logger.info('Bill\'s  ready!');
})



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
// Registers all commands in the ./commands/ directory
//client.registry.registerCommandsIn(path.join(__dirname, '/commands'));
