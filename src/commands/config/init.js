const Discord = require('discord.js');
const Commando = require('discord.js-commando');
const validateIP = require('validate-ip-node');
const request = require('request-promise');
const sevendtdServer = require("../../model/sevendtdServer.js")

class Init extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'init',
      aliases: ['setupinit', 'serverinit', 'serversetup'],
      group: 'config',
      memberName: 'init',
      guildOnly: true,
      description: 'Initialize a server',
      examples: ['init ip port name token', '?init 192.168.01 1004 testName testToken'],
      args: [{
          key: 'ip',
          label: 'IP',
          prompt: 'Specify the server ip please',
          type: 'string',
          validate: validateIP
        },
        {
          key: 'port',
          label: 'Port',
          prompt: 'Specify the server port please',
          type: 'integer'
        },
        {
          key: 'name',
          label: 'Authorization name',
          prompt: 'Specify a authorization name please',
          type: 'string'
        },
        {
          key: 'token',
          label: 'Authorization token',
          prompt: 'Specify a authorization token please',
          type: 'string'
        }
      ]
    });
  }

  async run(msg, args) {
    const client = this.client
    const ip = args.ip
    const port = args.port
    const name = args.name
    const token = args.token
    let colorRed = "FF0033"
    let colorOrange = "ffbb00"
    let colorGreen = "4cff00"
    let embed = makeStatusEmbed(client.makeBillEmbed());
    let errorReceived

    client.logger.info("Initializing a server. Discord name: " + msg.guild.name + " args: " + ip + " " + port);
    if (msg.deletable) {
      msg.delete()
    } else {
      addLineToDescription(embed, ":warning: Could not delete the original message, make sure your authname and token are secure");
    }
    embed.title = ":gear: Verifying your server.";
    msg.channel.send({
      embed
    }).then(async function(message) {
      let statusMesssage = message
      addLineToDescription(embed, ":loudspeaker: Checking for access to necessary api endpoints");
      client.logger.debug("Checking for access to necessary api endpoints")
      updateStatus(embed, statusMesssage);

      let requestOptions = {
        uri: "http://" + ip + ":" + port + "/api/getstats",
        json: true,
        timeout: 10000,
        qs: {
          adminuser: name,
          admintoken: token
        },
        useQuerystring: true
      };
      await request(requestOptions)
        .then(function(response) {
          addLineToDescription(embed, ":white_check_mark: Day 7 data loaded succesfully.");
          embed.setColor(colorOrange);
          client.logger.debug("Day 7 data loaded succesfully");
          updateStatus(embed, statusMesssage);
        })
        .catch(function(error) {
          embed.title = ":x: Server not initialized";
          embed.setColor(colorRed);
          addLineToDescription(embed, ":x: Check if day7 data can be read has failed\n:x: Error: " + error);
          addLineToDescription(embed, ":bulb: Did you set a correct IP and/or port?");
          client.logger.error("Check if day7data can be read has failed. error: " + error);
          updateStatus(embed, statusMesssage);
        }).then(async function() {
          let requestOptions = {
            uri: "http://" + ip + ":" + port + "/api/executeconsolecommand",
            json: true,
            timeout: 10000,
            qs: {
              adminuser: name,
              admintoken: token
            },
            useQuerystring: true
          };
          requestOptions.qs.command = "mem"
          await request(requestOptions)
            .then(function(response) {
              embed.title = ":white_check_mark: Server initialized";
              embed.setColor(colorGreen);
              addLineToDescription(embed, ":white_check_mark: Test command executed succesfully.");
              client.logger.debug("Test command executed succesfully.");
              updateStatus(embed, statusMesssage);
            })
            .catch(function(error) {
              embed.title = ":warning: Initialization failed, see below for errors.";
              addLineToDescription(embed, ":warning: Console commands cannot be executed, some functions may not work.\n:x: Error: " + error);
              addLineToDescription(embed, ":bulb: Did you set a correct authorization name and/or token?");
              client.logger.error("Check if console commands can be executed has failed. error: " + error);
              updateStatus(embed, statusMesssage);
            })
            .finally(function() {
              addLineToDescription(embed, ":information_source: Saving config")
              saveToConfig(client.guildConf, msg.guild);
              embed.addField("Bill discord for support and updates", "https://discordapp.com/invite/kuDJG6e")
              updateStatus(embed, statusMesssage);
            })
        })


    })

    function addLineToDescription(embed, line) {
      embed.description += line + "\n";
      return embed
    }

    function updateStatus(embed, statusMesssage) {
      return statusMesssage.edit({
        embed
      });
    }

    function makeStatusEmbed(embed) {
      embed.addField("IP", ip, true)
        .addField("Port", port, true);
        embed.description = "";
      return embed
    }

    function saveToConfig(guildsConfig, guild) {
      client.logger.debug("Saving config for " + guild.name);
      guild.settings.set("serverip", ip)
      guild.settings.set("webPort", port)
      guild.settings.set("authName", name)
      guild.settings.set("authToken", token)
      guild.sevendtdServer = new sevendtdServer(guild)
    }

    function resolveErrorCode(error) {
      switch (error.error.code) {
        case "ETIMEDOUT":
          error.Error = "Server took too long to respond. Confirm IP and port are correct.\n"
          break;
        case "ECONNREFUSED":
          error.Error = ":warning: Cannot execute console commands. Certain functions will not work.\n"
          break;
        default:
          error.Error = error.error.code
      }
      return error
    }

  }
}
module.exports = Init;
