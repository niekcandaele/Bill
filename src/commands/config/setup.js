const Commando = require('discord.js-commando');
const validateIP = require('validate-ip-node');
const randtoken = require('rand-token');
const Telnet = require('telnet-client')


class Setup extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'setup',
      memberName: 'setup',
      group: '7dtd',
      guildOnly: true,
      description: 'Sets up a new server via telnet',
      details: "enter ip, telnetport and password to set up a server",
      examples: ['setup 192.160.0.1 21 secretpassword'],
      args: [{
          key: 'ip',
          label: 'IP',
          prompt: 'Specify the server ip please',
          type: 'string',
          validate: validateIP
        }, {
          key: 'port',
          label: 'port',
          prompt: 'Specify the telnet port please',
          type: 'integer'
        },
        {
          key: 'password',
          label: 'password',
          prompt: 'Specify the telnet password',
          type: 'string'
        },
        {
          key: 'webPort',
          label: 'webPort',
          prompt: 'Specify a web port please. This is ControlPanelPort + 2 (ControlPanelPort found in serverconfig.xml)',
          type: 'integer',
          default: 8082
        }
      ]
    });
  }

  async run(msg, args) {
    const client = this.client;
    const ip = args.ip
    const telnetPort = args.port
    const telnetPassword = args.password
    const apiPort = args.webPort
    const name = "billBot"
    const token = randtoken.generate(24)
    const telnetParams = {
      host: ip,
      port: telnetPort,
      timeout: 15000,
      username: '',
      password: telnetPassword,
      failedLoginMatch: "Password incorrect",

      passwordPrompt: /Please enter password:/i,
      shellPrompt: /\r\n$/,

      debug: false,
    };
    let embed = client.makeBillEmbed()
    var connection = new Telnet()

    if (msg.deletable) {
      msg.delete()
    } else {
      msg.channel.send("Could not delete your message, please confirm your credentials are safe!")
    }


    connection.on('error', function(error) {
      client.logger.error("Command setup - telnet error " + error)
      embed.addField("status", ":x: Server Initialization failed - telnet error");
      embed.addField("Advice", "Verify your telnet info is correct");
      embed.addField("Error", error)
      msg.channel.send({
        embed
      })
    })

    connection.on('failedlogin', function(error) {
      client.logger.error("Command setup - telnet failedlogin " + error)
      embed.addField("status", ":x: Server Initialization failed - telnet error");
      embed.addField("Advice", "Verify your telnet credentials are correct");
      embed.addField("Error", error)
      msg.channel.send({
        embed
      })
    })

    client.logger.debug("Command setup - saving guild config")
    msg.guild.settings.set("serverip", ip);
    msg.guild.settings.set("webPort", apiPort);
    msg.guild.settings.set('authName', name);
    msg.guild.settings.set("authToken", token);

    client.logger.debug("Command setup - Connecting to telnet.")
    connection.connect(telnetParams)
      .then(function(prompt) {
        client.logger.debug("Command setup - Executing webtokens add command")
        connection.exec(`webtokens add ${name} ${token} 0`, telnetParams)
          .then(function(res) {
            checkServerWebApi()
          }).catch(function(error) {
            client.logger.error("Command setup - Executing webtokens add " + error);
            embed.addField("status", ":x: Server Initialization failed!")
          })
      }).catch(function(error) {
        client.logger.error("Command setup - Connection to telnet " + error);
        embed.addField("status", ":x: Server Initialization failed! Could not connect to telnet")
      })


    function checkServerWebApi() {
      client.logger.debug("Checking if setup success by executing cmd")
      client.sevendtdRequest.doRequest(msg.guild, "executeconsolecommand", {
          command: "mem"
        })
        .then(function(response) {
          client.logger.debug("Command setup - server install succes - check success");
          embed.addField("status", ":white_check_mark: Server succesfully initialized!");
          msg.channel.send({
            embed
          })
        })
        .catch(function(error) {
          client.logger.error("Command setup - server install fail - check failed " + error);
          embed.addField("status", ":x: Server Initialization failed with default web port!");
          embed.addField("Error", error);
          embed.addField("Advice", "Verify your input is correct. If you've set a different ControlPanelPort in serverconfig.xml, run the command again like this: setup IP telnetPort Password ControlPanelPort+2")
          msg.channel.send({
            embed
          })
        })

    }

  }
}


module.exports = Setup;
