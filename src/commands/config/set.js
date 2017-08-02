const Discord = require('discord.js');
const Commando = require('discord.js-commando');
const validateIP = require('validate-ip-node');

class Set extends Commando.Command {
    constructor(client) {
      super(client, {
        name: 'set',
        group: 'config',
        memberName: 'set',
        description: 'Config command. Set ip, port, authName, authToken.',
        examples: ['setip 192.168.0.1']
      });
    }

    async run(msg, args) {
      var argsArr = args.split(" ");

      var configTypes = new Discord.Collection([
        ["ip", setIP()],
        ["port", setPort()],
        ["authName", setAuthName()],
        ["authToken", setAuthToken()]
      ]);

      msg.reply(configTypes.get(argsArr[0]));

      function setIP() {
        return "jeepse"
      };
      function setPort() {};
      function setAuthName() {};
      function setAuthToken(){};
    }
  }
    module.exports = Set;
