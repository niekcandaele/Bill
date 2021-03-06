const Commando = require('discord.js-commando');
const Discord = require('discord.js');
const request = require('request-promise');
const qs = require('qs');

class ServerInfo extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'serverinfo',
      aliases: ['serverinfo', 'server', 'sinfo', 'si', 'info'],
      group: '7dtd',
      memberName: 'serverinfo',
      description: 'Shows serverinfo',
      details: " ",
      examples: ['serverinfo']
    });
  }

  async run(msg, args) {
    const client = msg.client;
    const sevendtdServer = msg.guild.sevendtdServer

    if (!sevendtdServer) {
      return msg.channel.send("No 7DTD Server initialized. Please set up your server before using commands")
    }

    var amountPlayersToShow = 10
    var players = new Array();
    var date = new Date();

    sevendtdServer.getServerInfo()
      .then(function(body) {
        // Changes booleans in the data to emoji checkmark or X
        function boolToEmoji(data) {
          for (var prop in data) {
            if (data.hasOwnProperty(prop)) {
              if (data[prop].type == "bool") {
                if (data[prop].value) {
                  data[prop].value = ':white_check_mark:'
                } else {
                  data[prop].value = ':x:'
                }
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
          gameDifficulty: body.GameDifficulty.value + 1,
          dayNightLength: body.DayNightLength.value,
          zombiesRun: body.ZombiesRun.value,
          playerKillingMode: body.PlayerKillingMode.value,
          airDropFrequency: body.AirDropFrequency.value,
          lootRespawnDays: body.LootRespawnDays.value,
          isPasswordProtected: body.IsPasswordProtected.value,
          EACEnabled: body.EACEnabled.value,
          dropOnDeath: body.DropOnDeath.value,
          dayLightLength: body.DayLightLength.value,
          landClaimSize: body.LandClaimSize.value,
          landClaimDeadZone: body.LandClaimDeadZone.value,
          landClaimExpiryTime: body.LandClaimExpiryTime.value,
          bloodMoonEnemyCount: body.BloodMoonEnemyCount.value,
          maxSpawnedZombies: body.MaxSpawnedZombies.value,
        }

        // Change data to a nice string
        switch (serverData.playerKillingMode) {
          case 0:
            serverData.playerKillingMode = "PvE";
            break;
          case 1:
            serverData.playerKillingMode = "Kill allies only";
            break;
          case 2:
            serverData.playerKillingMode = "Kill strangers only";
            break;
          case 3:
            serverData.playerKillingMode = "PvP";
            break;

        }

        switch (serverData.dropOnDeath) {
          case 0:
            serverData.dropOnDeath = "Drop all";
            break;
          case 1:
            serverData.dropOnDeath = "Belt";
            break;
          case 2:
            serverData.dropOnDeath = "Backpack";
            break;
          case 3:
            serverData.dropOnDeath = "Delete all";
            break;
        }

        var embed = client.makeBillEmbed().setTitle(serverData.gameHost)
          .addField("Description", serverData.serverDescription)
          .addField("IP address", serverData.ip + ":" + serverData.port, true)
          .addField("Version", serverData.version, true)
          .addField("Max players", serverData.maxPlayers, true)
          .addField("World", serverData.levelName, true)
          .addField("Settings",
            serverData.isPasswordProtected + " Password protected\n" +
            serverData.EACEnabled + " EAC Enabled\n" +
            ":small_orange_diamond:  Game difficulty: " + serverData.gameDifficulty +
            "\n:small_orange_diamond:  Day and night cycle: " + serverData.dayNightLength +
            "\n:small_orange_diamond:  Max zombies: " + serverData.maxSpawnedZombies +
            "\n:small_orange_diamond:  Bloodmoon enemy count: " + serverData.bloodMoonEnemyCount +
            "\n:small_orange_diamond:  Drop on death: " + serverData.dropOnDeath +
            "\n:small_orange_diamond:  Player killing mode: " + serverData.playerKillingMode +
            "\n:small_orange_diamond:  Day light length: " + serverData.dayLightLength +
            "\n:small_orange_diamond:  Land claim size: " + serverData.landClaimSize + " Dead zone: " + serverData.landClaimDeadZone + " Expiry date: " + serverData.landClaimExpiryTime +
            "\n:small_orange_diamond:  Air drop frequency: " + serverData.airDropFrequency + " hours" +
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
