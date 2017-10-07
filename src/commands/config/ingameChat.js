const Commando = require('discord.js-commando');
const Discord = require('discord.js');

const toDDHHMMSS = require('../../util/toDDHHMMSS.js')

class IngameChat extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'ingamechat',
      group: 'config',
      memberName: 'ingamechat',
      guildOnly: true,
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
    const currentConfig = msg.guild.settings.get("chatBridge")
    let newConfig = currentConfig

    if (args.action == "init") {
      if (currentConfig.chatChannelID) {
        msg.channel.send("You've already got a chat bridge set up! Reloading your configuration")
        msg.guild.sevendtdServer.logService.chatBridge.stop()
      } else {
        msg.channel.send("Initializing a chat bridge in this channel!")
      }
      newConfig.chatChannelID = msg.channel.id
      msg.guild.sevendtdServer.logService.chatBridge.initialize(msg.channel)
    }

    if (args.action == "stop") {
      newConfig.chatChannelID = false
      msg.guild.sevendtdServer.logService.chatBridge.stop()
      return msg.channel.send("Stopping chat channel.")
    }

    if (args.action == "connectedMessages") {
      if (currentConfig.connectedMessages) {
        msg.channel.send("Turning off player connect messages")
      } else {
        msg.channel.send("Turning on player connect messages")
      }
      newConfig.connectedMessages = !currentConfig.connectedMessages
    }

    if (args.action == "disconnectedMessages") {
      if (currentConfig.disconnectedMessages) {
        msg.channel.send("Turning off player disconnect messages")
      } else {
        msg.channel.send("Turning on player disconnect messages")
      }
      newConfig.disconnectedMessages = !currentConfig.disconnectedMessages
    }

    if (args.actions == "deathMessages") {
      if (currentConfig.deathMessages) {
        msg.channel.send("Turning off player death messages")
      } else {
        msg.channel.send("Turning on player death messages")
      }
      newConfig.deathMessages = !currentConfig.deathMessages
    }

    msg.guild.settings.set("chatBridge", newConfig)
  }
}

module.exports = IngameChat;
