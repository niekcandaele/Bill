const Discord = require('discord.js');
const fs = require('fs');
const request = require('request');

const client = new Discord.Client();
var token;
var owner;
var prefix;

client.on('ready', () => {
  console.log('Bill\'s  ready!');
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


// COMMANDS

// PING COMMAND
client.on('message', message => {
  if (message.content === 'ping') {
    message.reply('pong');
  }
});

// 7 DAYS COMMAND
client.on('message', message => {
  if (message.content === '!day7') {
    request('http://193.70.81.12:28248/api/getstats', function(error, response, body) {
      console.log('error:', error); // Print the error if one occurred
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      var body = JSON.parse(body);
      console.log(body);
      var date = new Date();

      var embed = {
        "content": "7 Days",
        "embed": {
          "title": "7 Days",
          "url": "https://discordapp.com",
          "color": 15312430,
          "timestamp": date,
          "footer": {
            "icon_url": "https://cdn.discordapp.com/embed/avatars/0.png",
            "text": "Bill"
          },
          "thumbnail": {
            "url": client.displayAvatarURL
          },
          "author": {
            "name": client.username,
            "url": "https://discordapp.com",
            "icon_url": "https://cdn.discordapp.com/embed/avatars/0.png"
          },
          "fields": [{
              "name": "Gametime",
              "value": body.gametime.days + " days " + body.gametime.hours + " hours " + body.gametime.minutes + " minutes",
              "inline": true
            },
            {
              "name": "Players",
              "value": body.players,
              "inline": true
            },
            {
              "name": "----- ",
              "value": "----- "
            },
            {
              "name": "Hostiles",
              "value": body.hostiles,
              "inline": true
            },
            {
              "name": "Animals",
              "value": body.animals,
              "inline": true
            },
          ]
        }
      }
      message.channel.send(embed);
    });
  }

});
