const Discord = require('discord.js');
const Commando = require('discord.js-commando');
const validateIP = require('validate-ip-node');

class Set extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'set',
      group: 'config',
      memberName: 'set',
      description: 'Config command. Set ip, port, authName, authToken.',
      examples: ['setip 192.168.0.1']
    });
  }

  async run(msg, args) {
    const client = msg.client;
    const thisConf = await client.guildConf.get(msg.guild.id);
    const ownerRole = thisConf.guildOwner;
    var argsArr = args.split(" ");

    var configTypes = new Map([
      ["ip", setIP],
      ["port", setPort],
      ["authname", setAuthName],
      ["authtoken", setAuthToken]
    ]);

    // Check if author of command is guild owner or bot owner
    if (ownerRole !== msg.author.id && client.owner !== msg.author.id) {
      client.logger.info(msg.author.username + " tried to run " + msg + " command but is not authorized!");
      return msg.reply("You're not the guildowner.");
    }

    // Check if empty command
    if (args == "") {
      return msg.reply("Arguments cannot be empty!");
    } else if (argsArr[1] == undefined) {
      return msg.reply("You must provide arguments for " + argsArr[0]);
    }

    // Select the function which needs to be executed
    let configType = configTypes.get(argsArr[0].toLowerCase());
    // Execute function, leaving out the first argument
    let newArgs = argsArr.splice(1, argsArr.length)
    configType(newArgs);


    // INDIVIDUAL CONFIG FUNCTIONS
    function setIP(args) {
      // Check if valid IP address
      if (!validateIP(args)) {
        console.log(args);
        return msg.reply("Invalid IP! Make sure you set a correct IP address");
      }

      let oldVal = thisConf.serverip;
      try {
        client.logger.debug("Trying to set IP for " + msg.guild.id + " to: " + args);
        thisConf.serverip = args;
        client.guildConf.set(msg.guild.id, thisConf);
      } catch (e) {
        client.logger.error(e);
        client.logError(msg, e);
      }
      let message = "IP for " + msg.guild.name + " was changed \nFrom: " + oldVal + " \nTo:   " + thisConf.serverip
      client.logger.debug(message);
      return msg.channel.send(message, {code: true})
    };

    function setPort(args) {

      let oldVal = thisConf.webPort;
      try {
        client.logger.debug("Trying to set port for " + msg.guild.id + " to: " + args);
        thisConf.webPort = args;
        client.guildConf.set(msg.guild.id, thisConf);
      } catch (e) {
        client.logger.error(e);
      }
      let message = "Port for " + msg.guild.name + " was changed \nFrom: " + oldVal + " \nTo:   " + thisConf.webPort;
      client.logger.debug(message);
      return msg.channel.send(message, {code: true})
    }


    function setAuthName(args) {};

    function setAuthToken(args) {};
  }
}
module.exports = Set;
