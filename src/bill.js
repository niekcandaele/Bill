const Commando = require('discord.js-commando');
const fs = require('fs');
const request = require('request');
const path = require('path');
const logger = require('logger');
const persistentCollection = require('djs-collection-persistent');

const client = new Commando.Client({
  owner: '220554523561820160'
});

client.on('ready', () => {
  client.logger = logger.createLogger('../logs/development.log');
  client.logger.info('Bot has logged in');
  client.logger.setLevel('debug');
  client.logger.info("Loading guildsconfigs");
  client.guildConf = new persistentCollection({
    name: 'guildConf',
    dataDir: '../data'
  });
  console.log('Bill\'s  ready!');
});

// Logs when a command is run (monitoring for beta stage)
client.on('commandRun', (command, promise, message) => {
  client.logger.info("COMMAND RAN: " + command.name + " run by " + message.author.username + " like this: " + message.cleanContent);
});
client.on("guildCreate", guild => {
  if (!client.guildConf.has(guild.id)) {
    client.logger.info("New guild added, default settings loaded. -- " + guild.name);
    var thisConf = defaultSettings;
    thisConf.guildOwner = guild.ownerID;
    client.guildConf.set(guild.id, defaultSettings);
  }
});

client.on("guildDelete", guild => {
  if (client.guildConf.has(guild.id)) {
    client.logger.info("Guild deleted, deleting settings! -- " + guild.name);
    client.guildConf.delete(guild.id);
  }
});

const defaultSettings = {
  prefix: "$",
  modLogChannel: "mod-log",
  modRole: "Moderator",
  adminRole: "Administrator",
  guildOwner: "id",
  serverip: "localhost"
}

// Registers all built-in groups, commands, and argument types
client.registry.registerDefaults();
client.registry.registerGroup("7dtd");
client.registry.registerGroup("config");
// Registers all of your commands in the ./commands/ directory
client.registry.registerCommandsIn(path.join(__dirname, '/commands'));

// read config file
fs.readFile('../config.json', 'utf8', function(err, data) {
  if (err) {
    console.log("Error: config failed to load!");
    return console.log(err);
  }
  data = JSON.parse(data);
  //owner = data.owner;
  var token = data.token;
  client.login(token);
});
