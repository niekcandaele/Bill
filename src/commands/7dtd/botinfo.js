const Commando = require('discord.js-commando');

class BotInfo extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'botinfo',
      group: '7dtd',
      memberName: 'botinfo',
      description: 'Show information about the bot.',
      examples: ['botinfo']
    });
  }

  async run(msg, args) {
    const client = msg.client;
  }
}

module.exports = BotInfo;
