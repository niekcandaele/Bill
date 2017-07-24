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
      var body = JSON.parse(body);
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

client.on('message', message => {
  if (message.content === '!players') {
    request('http://193.70.81.12:28248/api/getplayerslocation', function(error, response, body) {
      var data = JSON.parse(body);
      var onlinePlayerList = "";
      var onlinePlayers = 0;
      for (var i = 0; i < data.length; i++) {
        var player = data[i];
        if (player.online == true) {
          onlinePlayerList += player.name + ", ";
          onlinePlayers += 1;
        }
      }
      message.channel.send("There are currently " + onlinePlayers + " players online! \n" + onlinePlayerList);
    });
  }

});
