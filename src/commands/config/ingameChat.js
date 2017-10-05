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
        msg.channel.send("You've already got a chat bridge set up! Switching to this channel")
      } else {
        msg.channel.send("Initializing a chat bridge in this channel!")
      }
      msg.guild.settings.set("chatChannel", msg.channel.id);
      msg.guild.sevendtdServer.logService.chatBridge.initialize(msg.channel)
      
    }

    if (args.action == "stop") {
      msg.guild.settings.set("chatChannel", false)
      msg.guild.sevendtdServer.logService.chatBridge.stop()
      return msg.channel.send("Stopping chat channel.")
    }

  }
}

module.exports = IngameChat;
