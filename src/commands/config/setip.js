const Discord = require('discord.js');
const Commando = require('discord.js-commando');
const validateIP = require('validate-ip-node');

class Setip extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'setip',
      group: 'config',
      memberName: 'setip',
      description: 'Sets the ip of your server. \n Can only be used by guild owner!',
      examples: ['setip 192.168.0.1']
    });
  }

  async run(msg, args) {









  }
}

module.exports = Setip;
