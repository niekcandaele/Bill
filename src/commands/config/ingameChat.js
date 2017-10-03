const Commando = require('discord.js-commando');
const Discord = require('discord.js');

const toDDHHMMSS = require('../../util/toDDHHMMSS.js')

class IngameChat extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'ingamechat',
      group: 'config',
      memberName: 'ingamechat',
      description: 'Command to control the ingame chat bridge',
      args: [{
        key: 'action',
        label: 'What action to perform on the chat bridge',
        type: 'string',
        prompt: "Please provide an action"
      }],
    });
  }

  hasPermission(msg) {
    const adminRole = msg.guild.settings.get("adminRole")
    let isBotOwner = this.client.isOwner(msg.author);
    let isGuildOwner = msg.guild.ownerID == msg.author.id;
    let isAdminUser = msg.member.roles.has(adminRole)
    let hasPerm = (isBotOwner || isGuildOwner || isAdminUser)
    return hasPerm
  }

  async run(msg, args) {

    if (args.action == "init") {
      if (msg.guild.settings.get("chatChannel")) {
        msg.channel.send("Looks like you already chat a chat channel set, switching to this channel.")
        msg.guild.sevendtdServer.logService.setChatChannel(msg.channel)
      } else {
        msg.guild.settings.set("chatChannel", msg.channel.id);
        msg.guild.sevendtdServer.logService.setChatChannel(msg.channel)
        msg.guild.sevendtdServer.logService.initialize();
        msg.channel.send("Initialized a chat bridge in this channel.")
      }

    }

    if (args.action == "stop") {
      msg.guild.settings.set("chatChannel", false)
      msg.guild.sevendtdServer.logService.stop()
      return msg.channel.send("Stopping chat channel.")
    }
  
  }
}

module.exports = IngameChat;
