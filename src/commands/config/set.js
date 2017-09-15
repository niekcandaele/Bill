const Discord = require('discord.js');
const Commando = require('discord.js-commando');
const validateIP = require('validate-ip-node');

class Set extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'set',
      group: 'config',
      memberName: 'set',
      guildOnly: true,
      description: 'Config command. Set ip, port, authName, authToken.',
      examples: ['setip 192.168.0.1']
    });
  }

  async run(msg, args) {
    const client = this.client;
    const thisConf = await client.guildConf.get(msg.guild.id);
    const guildOwner = msg.guild.owner
    const ownerRole = msg.guild.ownerID;
    const adminRole = guildOwner.highestRole
    var argsArr = args.split(" ");

    var configTypes = new Map([
      ["ip", setIP],
      ["port", setPort],
      ["authname", setAuthName],
      ["authtoken", setAuthToken],
      ["prefix", setPrefix]
    ]);


    // Check if author of command is guild administrator or bot owner
    if (!checkIfAdmin(msg.member)) {
      client.logger.info(msg.author.username + " tried to run " + msg.content + " command but is not authorized!");
      return msg.reply("You need to have the administrator role to use the set command.");
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
    try {
      configTypes[configType(newArgs[0])];
    } catch (e) {
      client.logger.error("Invalid configtype for set command");
      return msg.channel.send("Invalid argument for set command")
    }


    // INDIVIDUAL CONFIG FUNCTIONS
    function setIP(args) {
      // Check if valid IP address
      if (!validateIP(args)) {
        client.logger.error(msg.author.username + " tried to set a bad ip for " + msg.guild.name + " ip: " + args);
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
        client.logger.error("Error set command: setPort: " + e);
      }
      let message = "Port for " + msg.guild.name + " was changed \nFrom: " + oldVal + " \nTo:   " + thisConf.webPort;
      client.logger.debug(message);
      return msg.channel.send(message, {code: true})
    }


    function setAuthName(args) {
      let oldVal = thisConf.authName;
      try {
        client.logger.debug("Trying to set authName for " + msg.guild.name);
        thisConf.authName = args;
        client.guildConf.set(msg.guild.id, thisConf);
      } catch (e) {
        client.logger.error("Error set command: setAdminName: " + e);
      }
      let message = "authName for " + msg.guild.name + " was changed"; // \nFrom: " + oldVal + " \nTo:   " + thisConf.authName
      client.logger.debug(message);
      if (msg.deletable) {
        deleteMsg();
      }
      return msg.channel.send(message, {code: true})
    }

    function setAuthToken(args) {


      let oldVal = thisConf.authToken;
      try {
        client.logger.debug("Trying to set authToken for " + msg.guild.name);
        thisConf.authToken = args;
        client.guildConf.set(msg.guild.id, thisConf);
      } catch (e) {
        client.logger.error("Error set command: setAuthToken: " + e);
      }
      let message = "authToken for " + msg.guild.name + " was changed"; // \nFrom: " + oldVal + " \nTo:   " + thisConf.authToken
      client.logger.debug(message);
      client.logger.debug(message);
      if (msg.deletable) {
        deleteMsg();
      }
      return msg.channel.send(message, {code: true})
    }

    function setPrefix(args) {
      let oldVal = thisConf.prefix;
      try {
        client.logger.debug("Trying to set prefix for " + msg.guild.id + " to: " + args);
        thisConf.prefix = args;
        client.guildConf.set(msg.guild.id, thisConf);
        msg.guild.commandPrefix = args;
      } catch (e) {
        client.logger.error(e);
        client.logError(msg, e);
      }
      let message = "Prefix for " + msg.guild.name + " was changed \nFrom: " + oldVal + " \nTo:   " + thisConf.prefix
      client.logger.debug(message);
      return msg.channel.send(message, {code: true})
    };


    function deleteMsg() {
      msg.delete();
    }

    function checkIfAdmin(member) {
      var isAdmin = member.roles.has(adminRole.id);
      client.logger.debug("Checking if " + member.user.username + " is admin. " + isAdmin);
      if (isAdmin || client.isOwner(member.user)) {
        return true
      } else {
        return false
      }
    }
  }
}
module.exports = Set;
