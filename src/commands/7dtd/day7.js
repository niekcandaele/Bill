const Commando = require('discord.js-commando');
const request = require('request');

class Day7 extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'day7',
      aliases: ['d7', '7day'],
      group: '7dtd',
      memberName: 'day7',
      description: 'Displays !day7 info about a server',
      details: "Shows online players, #animals, #hostiles",
      examples: ['day7']
    });
  }

  async run(msg, args) {
    const client = msg.client;
    client.logger.info("Command day7 used by " + msg.author.username);
    var date = new Date();
    var embed


    async function buildMsg() {
      function getOnlinePlayers() {
        // !!!!!!!!!!!!!!!!!!! ADD ERROR CATCH
        var onlinePlayerList = "";
        request('http://147.135.220.171:18246/api/getplayerslocation', function(error, response, body) {
          var data = JSON.parse(body);
          for (var i = 0; i < data.length; i++) {
            var player = data[i];
            if (player.online == true) {
              onlinePlayerList += player.name + ", ";
            }
          }
          //console.log("Function online players: " + onlinePlayerList);
          return onlinePlayerList;
        });
      }

      function getDay7Data() {
        request('http://147.135.220.171:18246/api/getstats', function(error, response, body) {
          //  !!!!!!!!!!!!!!!!!!! ADD ERROR CATCH
          return JSON.parse(body);
        });
      }

      const onlinePlayers = await getOnlinePlayers();
      const day7data = await getDay7Data();
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
              "value": day7data.gametime.days + " days " + day7data.gametime.hours + " hours " + day7data.gametime.minutes + " minutes",
              "inline": true
            },
            {
              "name": "Players",
              "value": day7data.players,
              "inline": true
            },
            {
              "name": "Online players",
              "value": onlinePlayers
            },
            {
              "name": "Hostiles",
              "value": day7data.hostiles,
              "inline": true
            },
            {
              "name": "Animals",
              "value": day7data.animals,
              "inline": true
            },
          ]
        }
      }
      return embed
    }
    msg.channel.send(await buildMsg());
  }
}

module.exports = Day7;
