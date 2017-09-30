const Commando = require('discord.js-commando');
const Discord = require('discord.js');

const toDDHHMMSS = require('../../util/toDDHHMMSS.js')

class InitChat extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'initchat',
      group: 'config',
      memberName: 'initchat',
      description: 'Initialize a text channel for chat bridge',
      args: [{
        key: 'stop',
        label: 'stop messages',
        type: 'string',
        prompt: "Please provide a message",
        default: false
      }],
    });
  }

  async run(msg, args) {

    if (args.stop == "stop") {
      msg.guild.settings.set("chatChannel", false)
      return msg.channel.send("Stopping chat channel.")
    }
    
    msg.guild.settings.set("chatChannel", msg.channel.id)
    msg.guild.sevendtdServer.logService.initialize()
    msg.channel.send("Chat channel initialized")
  }
}

module.exports = InitChat;
