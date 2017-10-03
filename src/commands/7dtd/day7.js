const Commando = require('discord.js-commando');
const request = require('request-promise');


class Day7 extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'day7',
      aliases: ['d7', '7day', '7d'],
      group: '7dtd',
      guildOnly: true,
      memberName: 'day7',
      description: 'Displays !day7 info about a server',
      details: "Shows online players, #animals, #hostiles",
      examples: ['day7']
    });
  }

  async run(msg, args) {
    const sevendtdServer = msg.guild.sevendtdServer
    const client = this.client

    if (!sevendtdServer) {
      return msg.channel.send("No 7DTD Server initialized. Please set up your server before using commands")
    }

    if (!await sevendtdServer.checkIfOnline()) {
      return msg.channel.send("Could not connect to the server, is it offline?")
    }

    const day7data = await sevendtdServer.getStats().then().catch(e => {
      client.logger.error(`D7 error gettings day7data ${e}`)
    })
    const onlinePlayers = await sevendtdServer.getPlayersLocation().then(function(data) {
      // parse data into a useful format
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
      return onlinePlayerList
    }).catch(e => {
      client.logger.error(`D7 error gettings onlinePlayers ${e}`)
      return
    })
    const FPS = await sevendtdServer.executeConsoleCommand("mem").then(function(data) {
      var tempData = data.result.split(" ");
      var fpsIdx = tempData.findIndex(dataEntry => {
        return dataEntry == 'FPS:'
      });
      return tempData[fpsIdx + 1]
    }).catch(e => {
      client.logger.error(`D7 error gettings fps data ${e}`)
    })

    let embed = client.makeBillEmbed();

    function buildMsg() {
      let nextHorde = (Math.trunc(day7data.gametime.days / 7) + 1) * 7
      const daysUntilHorde = nextHorde - day7data.gametime.days;

      client.logger.debug("day7 command - buildmsg data: onlinePlayers: " + onlinePlayers + "  day7data: " + JSON.stringify(day7data) + " FPS: " + FPS);
      handleFPS(FPS);

      embed.addField("Gametime", day7data.gametime.days + " days " + day7data.gametime.hours + " hours " + day7data.gametime.minutes + " minutes\nNext horde in " + daysUntilHorde + " days", true)
        .addField("Online players: " + day7data.players, onlinePlayers)
        .addField(day7data.hostiles + " Hostiles", day7data.animals + " Animals", true);
      return embed

      function handleFPS(fps) {
        if (fps < 5) {
          embed.setColor('ff0000')
        }
        if (5 < fps < 15) {
          embed.setColor('#ffe500')
        }
        if (fps > 15) {
          embed.setColor('#00ff2a')
        }
        embed.addField("FPS", fps, true)
      }
    }

    if (day7data && onlinePlayers && FPS) {
      buildMsg()
      msg.channel.send({embed})
    } else {
      return msg.channel.send("Error getting data from the server, server down?")
    }

  }

}


module.exports = Day7;
