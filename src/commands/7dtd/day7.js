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
    const thisConf = await client.guildConf.get(msg.guild.id);
    const serverip = thisConf.serverip;
    const webPort = thisConf.webPort;
    const serverAdress = "http://" + serverip + ":" + webPort;
    var date = new Date();

    function getOnlinePlayers() {
      var onlinePlayerList = "";
      request(serverAdress + '/api/getplayerslocation', function(error, response, body) {
        if (error) {
          client.logger.error(error);
          return msg.reply("Error! Request to server failed, did you set a correct IP?");
        }
        var data = JSON.parse(body);
        for (var i = 0; i < data.length; i++) {
          var player = data[i];
          if (player.online == true) {
            onlinePlayerList += player.name + ", ";
          }
        }
        return getDay7Data(onlinePlayerList);
      });
    }
    function getDay7Data(onlinePlayersList) {
      request(serverAdress + '/api/getstats', function(error, response, body) {
        if (error) {
          client.logger.error(error);
          return msg.reply("Error! Request to server failed, did you set a correct IP?");
        }
        return buildMsg([onlinePlayersList,JSON.parse(body)]);
      });
    }

    async function buildMsg(dataArray) {
      const onlinePlayers = dataArray[0];
      const day7data = dataArray[1];
      client.logger.debug("COMMAND DAY7: buildmsg data: onlinePlayers: " + onlinePlayers + "day7data: " + day7data);

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
      msg.channel.send(embed);
    }

    getOnlinePlayers();

  }
}

module.exports = Day7;
