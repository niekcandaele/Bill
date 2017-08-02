const Commando = require('discord.js-commando');

class Setport extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'setport',
      group: 'config',
      memberName: 'setport',
      description: 'Sets the port of your server. \n Can only be used by guild owner! \n Port number is serverport+2 refer to the site for more info',
      examples: ['setport 20056']
    });
  }

  async run(msg, args) {

    try {
      client.logger.debug("Trying to set port for " + msg.guild.id + " to: " + args);
      thisConf.webPort = args;
      client.guildConf.set(msg.guild.id,thisConf);
    } catch (e) {
      client.logger.error(e);
    }
    msg.reply("You've set the server port for this guild to be: " + thisConf.webPort);
    client.logger.debug("Port for " + msg.guild.id + " was set to: " + thisConf.webPort);
  }
}

module.exports = Setport;
