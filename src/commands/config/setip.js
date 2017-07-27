const Discord = require('discord.js');
const Commando = require('discord.js-commando');

class Setip extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'setip',
      group: 'config',
      memberName: 'setip',
      description: 'Sets the ip of your server',
      examples: ['setip 192.168.0.1']
    });
  }

  async run(msg, args) {
    const client = msg.client;
    const thisConf = client.guildConf.get(msg.guild.id);
    const adminRole = msg.guild.roles.find("name", guildConf.adminRole);

    if (!adminRole || !msg.member.has(adminRole.id)) {
      client.logger.info(msg.author.username + " tried to run setip command but is not authorized!");
      return msg.reply("You're not an admin, sorrynotsorry!");
    }

    if (args == "") {
      return msg.reply("Arguments cannot be empty!");
      console.log("set IP");
    }

    thisConf.serverip = "args";
  }
}

module.exports = Setip;
