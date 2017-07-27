const Commando = require('discord.js-commando');
const fs = require('fs');
const request = require('request');
const path = require('path');
const logger = require('logger');

const client = new Commando.Client({
  owner: '220554523561820160'
});

client.on('ready', () => {
  client.logger.info('Bot has logged in')
  console.log('Bill\'s  ready!');
});

client.logger = logger.createLogger('../logs/development.log');

// Registers all built-in groups, commands, and argument types
client.registry.registerDefaults();
client.registry.registerGroup("7dtd");
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
