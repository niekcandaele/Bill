const Commando = require('discord.js-commando');
const Discord = require('discord.js');
const request = require('request');

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
    var players = new Array();
    var date = new Date();
    function getPlayers(callback) {
      request(serverAdress + '/api/getplayerslocation', function(error, response, body) {
        if (error) {
          client.logger.error("Error! toptime getPlayers: " + error);
          return msg.reply("Error! Request to server failed, did you set correct IP and/or port and permissions?");
        }
        var data = JSON.parse(body);
        for (var i = 0; i < data.length; i++) {
          players[i] = new Array(data[i].name, data[i].totalplaytime);
        }
        return callback(players);
      });
    }

    function bubbleSort(arr) {
      var len = arr.length;
      for (var i = len - 1; i >= 0; i--) {
        for (var j = 1; j <= i; j++) {
          if (arr[j - 1][1] < arr[j][1]) {
            var temp = arr[j - 1];
            arr[j - 1] = arr[j];
            arr[j] = temp;
          }
        }
      }
      return arr;
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

    function isEven(n) {
      return n % 2 == 0;
    }

    function buildMsg(arr) {
      var embed = client.makeBillEmbed()
      var amountPlayersToShow = 10
      if (arr.length < 10) {
        amountPlayersToShow = arr.length
      }
      embed.setTitle("Top players by playtime");

      for (var i = 0; i < amountPlayersToShow; i++) {
        embed.addField(i + 1 + ". " + arr[i][0], secondsToDhms(arr[i][1]), true);
        return embed
      }

      function callbackF(arr) {
        var embed = buildMsg(bubbleSort(arr));
        msg.channel.send({
          embed
        });
      }

      getPlayers(callbackF);
    }
  }
}

module.exports = TopTime;
