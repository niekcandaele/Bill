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

  async run(msg, args) {

    if (args.action == "init") {
      msg.guild.settings.set("chatChannel", msg.channel.id)
      msg.guild.sevendtdServer.logService.initialize();
      return msg.channel.send("Initialized a chat bridge in this channel.")
    }

    if (args.action == "stop") {
      msg.guild.settings.set("chatChannel", false)
      msg.guild.sevendtdServer.logService.stop()
      return msg.channel.send("Stopping chat channel.")
    }
  
  }
}

module.exports = IngameChat;
