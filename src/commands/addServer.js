const Discord = require('discord.js');
const Commando = require('discord.js-commando');

class AddServer extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'addserver',
      group: 'config',
      memberName: 'addserver',
      description: 'Adds a server to your discord guild.',
      examples: ['addserver name 192.168.0.1:1234']
    });
  }

  async run(msg, args) {
  }
}

module.exports = AddServer;
