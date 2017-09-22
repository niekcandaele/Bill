const Commando = require('discord.js-commando');
const Discord = require('discord.js');

class AddAdmin extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'addadmin',
      group: 'config',
      memberName: 'addadmin',
      description: 'adds a new admin role.',
      examples: ['addadmin'],
      args: [{
        key: 'role',
        label: 'role to add as admin',
        prompt: 'please mention a role',
        type: 'string'
      }],
    });
  }

  hasPermission(msg) {
    let isBotOwner = this.client.isOwner(msg.author);
    let isGuildOwner = msg.guild.ownerID == msg.author.id;
    let hasPerm = (isBotOwner || isGuildOwner)
    return hasPerm
  }

  async run(msg, args) {
    const client = msg.client;
    let roleID = args.role.slice(3, args.role.length-1);

    msg.guild.settings.set("adminRole", roleID);
    msg.channel.send(`A new admin role was added for your server!`)
  }
}

module.exports = AddAdmin;
