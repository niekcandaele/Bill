const Commando = require('discord.js-commando');
const Discord = require('discord.js');
const request = require('request-promise');

class TopTime extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'toptime',
      group: '7dtd',
      memberName: 'toptime',
      guildOnly: true,
      description: 'Lists top players by playtime',
      details: "Optionally takes a number as argument to specify how many players to list",
      examples: ['toptime', 'toptime 5']
    });
  }

  async run(msg, args) {
    const client = msg.client;
    var amountPlayersToShow = 10
    var players = new Array();
    var date = new Date();
    let requestOptions = await client.getRequestOptions(msg.guild, '/getplayerslocation');

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

    // Requests the player data from server
    await request(requestOptions)
      .then(function(body) {
        let playersCounter = 0
        // Create array of [playername, playtime]
        for (var i = 0; i < body.length; i++) {
          // Filter out players with 0 playtime
          if (!body[i].totalplaytime == 0) {
            players[playersCounter] = new Array(body[i].name, body[i].totalplaytime);
            playersCounter += 1;
          }
        }
      })
      .catch(function(error) {
        client.logger.error("Error! toptime getPlayers: " + error);
        return msg.channel.send("Error! Request to server failed, did you set correct IP:port and authorization token?");
      })


    function buildMsg(arr) {
      var embed = client.makeBillEmbed()
        .setTitle("Top players by playtime");
      if (arr.length < 10) {
        amountPlayersToShow = arr.length
      }
      if (arr.length == 0) {
        embed.addField("No players have joined the server", "No data recieved from server");
        return embed
      }
      for (var i = 0; i < amountPlayersToShow; i++) {
        let time = arr[i][1].toString().toHHMMSS();
        embed.addField(i + 1 + ". " + arr[i][0],
          ":regional_indicator_d::regional_indicator_h::regional_indicator_m::regional_indicator_s:\n" +
          " **" + time.days + "   " + time.hours + "   " + time.minutes + "   " + time.seconds + "**", true);
      }
      return embed
    }

    try {
      if (args) {
        if (isNaN(args)) {
          client.logger.error("Toptime invalid argument! NaN " + args)
          return msg.channel.send("Error: Argument must be a number.")
        }
        if (args > 25) {
          client.logger.error("Toptime invalid argument! Too big " + args)
          return msg.channel.send("Error: Argument can not be larger that 25!")
        }
        amountPlayersToShow = args
      }
      let embed = buildMsg(sort(players));
      return msg.channel.send({
        embed
      });
    } catch (error) {
      client.logger.error("Error! toptime getPlayers: sorting/buildMsg : " + error);
      return msg.channel.send("Error sorting the data. Verify the data is correct");
    }
  }
}

module.exports = TopTime;
