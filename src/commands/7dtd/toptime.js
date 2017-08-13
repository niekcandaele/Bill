const Commando = require('discord.js-commando');
const Discord = require('discord.js');
const request = require('request-promise');

class TopTime extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'toptime',
      group: '7dtd',
      memberName: 'toptime',
      description: 'Lists top 10 players by playtime',
      details: " ",
      examples: ['toptime']
    });
  }

  async run(msg, args) {
    const client = msg.client;
    const thisConf = await client.guildConf.get(msg.guild.id);
    const serverip = thisConf.serverip;
    const webPort = thisConf.webPort;
    const serverAdress = "http://" + serverip + ":" + webPort;
    var amountPlayersToShow = 10
    var players = new Array();
    var date = new Date();
    let requestOptions = {
      uri: serverAdress + '/api/getplayerslocation',
      json: true,
      timeout: 2500
    };

    // Adapted from https://gist.github.com/paullewis/1982121
    function sort(array) {
      var length = array.length,
        mid = Math.floor(length * 0.5),
        left = array.slice(0, mid),
        right = array.slice(mid, length);
      if (length === 1) {
        return array;
      }
      return merge(sort(left), sort(right));

      function merge(left, right) {
        var result = [];
        while (left.length || right.length) {
          if (left.length && right.length) {
            if (left[0][1] > right[0][1]) {
              result.push(left.shift());
            } else {
              result.push(right.shift());
            }
          } else if (left.length) {
            result.push(left.shift());
          } else {
            result.push(right.shift());
          }
        }
        return result;
      }
    }
    function secondsToDhms(time) {
      var t = Number(time);

      var d = Math.floor(t / 86400);
      t -= (d * 86400);
      var h = Math.floor(t / 3600);
      t -= (h * 3600);
      var m = Math.floor(t / 60);
      t -= (m * 60);
      var s = Math.floor(t);

      return d + "D " + h + "H " + m + "M " + s + "S ";
    }

    // Requests the player data from server
    request(requestOptions)
      .then(function(body) {
        let players = []
        let playersCounter = 0
        // Create array of [playername, playtime]
        for (var i = 0; i < body.length; i++) {
          // Filter out players with 0 playtime
          if (!body[i].totalplaytime == 0) {
            players[playersCounter] = new Array(body[i].name, body[i].totalplaytime);
            playersCounter += 1;
          }
        }
        try {
          let embed = buildMsg(sort(players));
          return msg.channel.send({
            embed
          });
        } catch (e) {
          client.logger.error("Error! toptime getPlayers: sorting/buildMsg : " + error);
          return msg.channel.send("Error sorting the data. Verify the data is correct");
        }
      })
      .catch(function(error) {
        client.logger.error("Error! toptime getPlayers: " + error);
        return msg.channel.send("Error! Request to server failed, did you set correct IP and/or port and permissions?");
      })


    function buildMsg(arr) {
      var embed = client.makeBillEmbed()
      embed.setTitle("Top players by playtime");
      if (arr.length < 10) {
        amountPlayersToShow = arr.length
      }
      if (arr.length == 0) {
        embed.addField("No players have joined the server", "No data recieved from server");
        return embed
      }
      for (var i = 0; i < amountPlayersToShow; i++) {
        embed.addField(i + 1 + ". " + arr[i][0], secondsToDhms(arr[i][1]), true);
      }
      return embed
    }
  }
}

module.exports = TopTime;
