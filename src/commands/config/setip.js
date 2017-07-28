const Discord = require('discord.js');
const Commando = require('discord.js-commando');

class Setip extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'setip',
      group: 'config',
      memberName: 'setip',
      description: 'Sets the ip of your server. Expects the port aswell \n Can only be used by guild owner!',
      examples: ['setip 192.168.0.1:1234']
    });
  }

  async run(msg, args) {
    const client = msg.client;
    const thisConf = await client.guildConf.get(msg.guild.id);
    const ownerRole = thisConf.guildOwner;

    if (ownerRole !== msg.author.id) {
      client.logger.info(msg.author.username + " tried to run " + msg + " command but is not authorized!");
      return msg.reply("You're not the guildowner, sorrynotsorry!");
    }

    if (args == "") {
      return msg.reply("Arguments cannot be empty!");
    }
    try {
      client.logger.debug("Trying to set IP for " + msg.guild.id + " to: " + args);
      thisConf.serverip = args;
      client.guildConf.set(msg.guild.id,thisConf);
    } catch (e) {
      client.logger.error(e);
    }
    msg.reply("You've set the server IP for this guild to be: " + thisConf.serverip);
    client.logger.debug("IP for " + msg.guild.id + " was set to: " + thisConf.serverip);
  }
}

module.exports = Setip;
