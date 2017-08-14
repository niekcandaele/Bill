const Commando = require('discord.js-commando');
const Discord = require('discord.js');
const request = require('request-promise');
const qs = require('qs');

class ServerInfo extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'serverinfo',
      group: '7dtd',
      memberName: 'serverinfo',
      description: 'Shows serverinfo',
      details: " ",
      examples: ['serverinfo']
    });
  }

  async run(msg, args) {
    const client = msg.client;
    const thisConf = await client.guildConf.get(msg.guild.id);
    var amountPlayersToShow = 10
    var players = new Array();
    var date = new Date();
    let requestOptions = await client.getRequestOptions(msg.guild, '/getserverinfo');

    // Requests the player data from server
    request(requestOptions)
      .then(function(body) {
        // Changes booleans in the data to emoji checkmark or X
        function boolToEmoji(data) {
          const Props = client.getProperties(data)
          for (var i = 0; i < Props.length; i++) {
            if (data[Props[i]].type == "bool") {
              if (data[Props[i]].value) {
                data[Props[i]].value = ':white_check_mark:'
              } else {
                data[Props[i]].value = ':x:'
              }
            }
          }
        }
        boolToEmoji(body);
        var serverData = {
          gameHost: body.GameHost.value,
          serverDescription: body.ServerDescription.value,
          levelName: body.LevelName.value,
          version: body.Version.value,
          ip: body.IP.value,
          port: body.Port.value,
          maxPlayers: body.MaxPlayers.value,
          gameDifficulty: body.GameDifficulty.value,
          dayNightLength: body.DayNightLength.value,
          zombiesRun: body.ZombiesRun.value,
          playerKillingMode: body.PlayerKillingMode.value,
          airDropFrequency: body.AirDropFrequency.value,
          lootRespawnDays: body.LootRespawnDays.value,
          isPasswordProtected: body.IsPasswordProtected.value,
          EACEnabled: body.EACEnabled.value
        }
        var embed = client.makeBillEmbed().setTitle(serverData.gameHost)
          .addField("Description", serverData.serverDescription)
          .addField("IP address", serverData.ip + ":" + serverData.port, true)
          .addField("Version", serverData.version, true)
          .addField("Max players", serverData.maxPlayers, true)
          .addField("Settings",
            serverData.isPasswordProtected + " Password protected\n" +
            serverData.EACEnabled + " EAC Enabled\n" +
            ":small_orange_diamond:  Game difficulty: " + serverData.gameDifficulty +
            "\n:small_orange_diamond:  Day and night cycle: " + serverData.dayNightLength +
            "\n:small_orange_diamond:  Player killing mode: " + serverData.playerKillingMode +
            "\n:small_orange_diamond:  Air drop frequency: " + serverData.airDropFrequency +
            "\n:small_orange_diamond:  Loot respawns in " + serverData.lootRespawnDays + " days"
          );
        return msg.channel.send({
          embed
        })
      })
      .catch(function(error) {
        client.logger.error("Error! serverinfo building embed: " + error);
        return msg.channel.send("Error! Request to server failed, did you set correct IP:port and authorization token?");
      })
  }
}

module.exports = ServerInfo;
