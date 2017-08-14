const Commando = require('discord.js-commando');
const request = require('request-promise');


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
    let messageData = []

    // Requests the player data from server
    let requestOptions = await client.getRequestOptions(msg.guild, '/getplayerslocation');
    await request(requestOptions)
      .then(function(data) {
        let onlinePlayerList = ""
        for (var i = 0; i < data.length; i++) {
          var player = data[i];
          if (player.online == true) {
            onlinePlayerList += player.name + ", ";
          }
        }
        if (onlinePlayerList == "") {
          onlinePlayerList = "No players online!"
        }
        messageData[0] = onlinePlayerList
      })
      .catch(function(error) {
        client.logger.error("Error! day7 getPlayerData " + error);
        return msg.channel.send("Error! Request to api/getplayerslocation failed, did you set correct IP:port and authorization token?");
      })
    // Requests the day7 data from server
    requestOptions = await client.getRequestOptions(msg.guild, '/getstats');
    await request(requestOptions)
      .then(function(data) {
        messageData[1] = data
      })
      .catch(function(error) {
        client.logger.error("Error! day7 getPlayerData " + error);
        return msg.channel.send("Error! Request to api/getstats failed, did you set correct IP:port and authorization token?");
      })

    async function sendMsg(dataArray) {
      try {
        const onlinePlayers = dataArray[0];
        const day7data = dataArray[1];
        client.logger.debug("COMMAND DAY7: buildmsg data: onlinePlayers: " + onlinePlayers + "  day7data: " + JSON.stringify(day7data));

        var embed = client.makeBillEmbed();
        embed.addField("Gametime", day7data.gametime.days + " days " + day7data.gametime.hours + " hours " + day7data.gametime.minutes + " minutes", true)
          .addField("Players", day7data.players, true)
          .addField("Online players", onlinePlayers)
          .addField("Hostiles", day7data.hostiles, true)
          .addField("Animals", day7data.animals, true);
        return msg.channel.send({
          embed
        })
      } catch (error) {
        client.logger.error("Error! day7 buildMsg " + error);
        return msg.channel.send("Error building the message. Verify the data is correct");
      }
    }
    sendMsg(messageData)

  }
}

module.exports = Day7;
