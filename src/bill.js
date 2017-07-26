const Discord = require('discord.js');
const fs = require('fs');
const request = require('request');

var command = require('./commands/7days.js');

const client = new Discord.Client();
var token;
var owner;
var prefix;

client.on('ready', () => {
  console.log('Bill\'s  ready!');
});

// PING COMMAND
client.on('message', message => {
  if (message.content === 'ping') {
    message.reply('pong');
  }
  if (message.content === '!day7') {
    command.day7(client,message);
  }
  if (message.content.startsWith('!shop')) {
    command.shop(client,message);
  }
  if (message.content === '!top') {
    command.playtime(client,message);
  }
});


// read config file
fs.readFile('../config.json', 'utf8', function(err, data) {
  if (err) {
    console.log("Error: config failed to load!");
    return console.log(err);
  }
  data = JSON.parse(data);
  owner = data.owner;
  token = data.token;
  prefix = data.prefix;
  client.login(token);
});
