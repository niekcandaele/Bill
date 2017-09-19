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
    const client = this.client;
    try {
      const onlinePlayers = await client.sevendtdRequest.doRequest(msg.guild, "getplayerslocation").then(function(data) {
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
      })
      const day7data = await client.sevendtdRequest.doRequest(msg.guild, "getstats");
      const fps = await client.sevendtdRequest.doRequest(msg.guild, "executeconsolecommand", {
        command: "mem"
      }).then(function(data) {
        var tempData = data.result.split(" ");
        var fpsIdx = tempData.findIndex(dataEntry => {
          return dataEntry == 'FPS:'
        });
        return tempData[fpsIdx + 1]
      })




      let nextHorde = (Math.trunc(day7data.gametime.days / 7) + 1) * 7
      const daysUntilHorde = nextHorde - day7data.gametime.days;
      client.logger.debug("day7 command - buildmsg data: onlinePlayers: " + onlinePlayers + "  day7data: " + JSON.stringify(day7data) + " FPS: " + fps);

      var embed = client.makeBillEmbed();
      if (fps) {
        handleFPS();
      }
      embed.addField("Gametime", day7data.gametime.days + " days " + day7data.gametime.hours + " hours " + day7data.gametime.minutes + " minutes\nNext horde in " + daysUntilHorde + " days", true)
        .addField("Online players: " + day7data.players, onlinePlayers)
        .addField(day7data.hostiles + " Hostiles", day7data.animals + " Animals", true)

      function handleFPS() {
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
      return msg.channel.send({
        embed
      })
    } catch (error) {
      client.logger.error("day7 command - buildMsg " + error);
      return msg.channel.send("Error - day 7. Verify your server is set up correctly please");
    }
  }

}


module.exports = Day7;
