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
          if (player.online == true ) {
            onlinePlayerList += player.name + ", ";
          }
        }
        return getDay7Data(onlinePlayerList.substr(0,onlinePlayerList.length-2));
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
      let onlinePlayers = dataArray[0];
      const day7data = dataArray[1];
      client.logger.debug("COMMAND DAY7: buildmsg data: onlinePlayers: " + onlinePlayers + "day7data: " + day7data);

      if (onlinePlayers == "") {
        onlinePlayers = "No players online!"
      }

      var embed = {
        "content": "7 Days",
        "embed": {
          "title": "Bill - A discord bot for 7 days to die",
          "url": "https://niekcandaele.github.io/Bill/",
          "color": 15312430,
          "timestamp": date,
          "footer": {
            "icon_url": "http://i.imgur.com/ljZEihK.png",
            "text": "Bill"
          },
          "author": {
            "name": client.username,
            "url": "https://niekcandaele.github.io/Bill/",
            "icon_url": "http://i.imgur.com/ljZEihK.png"
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
