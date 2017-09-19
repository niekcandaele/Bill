const Commando = require('discord.js-commando');
const Discord = require('discord.js');
const request = require('request');

class customMessage extends Commando.Command {
  constructor(client) {
    const commandOptions = {
      "set": setMessage,
      "reset": resetMessages,
      "delete": deleteMessage,
      "list": listMessages
    }

    function validateOption(value, msg, arg) {
      return commandOptions.hasOwnProperty(value)
    }

    function parseOption(value, msg, arg) {
      return commandOptions[value](msg, msg.content.split(" "));

    }
    super(client, {
      name: 'custommessage',
      group: '7dtd',
      memberName: 'custommessage',
      aliases: ['cm'],
      guildOnly: true,
      description: 'Custom text command.',
      details: "Set custom messages your guild, useful for serverip, rules, help, ...",
      args: [{
          key: 'cmOption',
          label: 'Option for custom message',
          prompt: 'Specify a command option please',
          type: 'string',
          parse: parseOption,
          validate: validateOption,
          wait: 30
        },
        {
          key: 'messageTitle',
          label: 'Title of the message',
          prompt: "Specify a valid title for the message please",
          type: 'string',
          default: ""
        },
        {
          key: 'messageText',
          label: 'Text of the message',
          prompt: "Specify valid text for the message please",
          type: 'string',
          default: ""
        }
      ],
      examples: [
        'cm set yourtextname yourtext',
        'yourtextname',
        'cm delete yourtextname',
        'cm reset',
        'cm list'
      ]
    });

    function setMessage(msg) {
      client.logger.debug("CustomMessage - Setting a new message");
    }

    function resetMessages(msg) {
      client.logger.debug("CustomMessage - Resetting messages");
    }

    function deleteMessage(msg) {
      client.logger.debug("CustomMessage - Deleting message");
    }

    function listMessages(msg) {
      client.logger.debug("CustomMessage - Listing messages");
      const customMessages = client.CustomTextService.getTextFiles(msg.guild);
      let messageEmbed = client.makeBillEmbed();
      for (var message in customMessages) {
        console.log(message);
        messageEmbed.addField(message[0], message[1])
      }
      msg.channel.send({messageEmbed})
    }



  }

  async run(msg, args) {
    const client = this.client
    const messageService = client.CustomTextService

  }
}

module.exports = customMessage;
