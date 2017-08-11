const Commando = require('discord.js-commando');
const request = require('request');


class Day7 extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'day7',
      aliases: ['d7', '7day', '7d'],
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
          client.logger.error("Error! day7 getOnlinePlayers: " + error);
          return msg.channel.send("Error! Request to server failed, did you set correct IP and/or port and permissions?");
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
          client.logger.error("Error! day7 getDay7Data: " + error);
          return msg.channel.send("Error! Request to server failed, did you set correct IP and/or port and permissions?");
        }
        return buildMsg([onlinePlayersList,JSON.parse(body)]);
      });
    }

    async function buildMsg(dataArray) {
      let onlinePlayers = dataArray[0];
      const day7data = dataArray[1];
      client.logger.debug("COMMAND DAY7: buildmsg data: onlinePlayers: " + onlinePlayers + " --- day7data: ---" + day7data);

      if (onlinePlayers == "") {
        onlinePlayers = "No players online!"
      }

      var embed = client.makeBillEmbed();
      embed.addField("Gametime", day7data.gametime.days + " days " + day7data.gametime.hours + " hours " + day7data.gametime.minutes + " minutes", true)
      .addField("Players", day7data.players, true)
      .addField("Online players", onlinePlayers)
      .addField("Hostiles", day7data.hostiles,true)
      .addField("Animals", day7data.animals,true)
      msg.channel.send({embed});
    }

    getOnlinePlayers();

  }
}

module.exports = Day7;
