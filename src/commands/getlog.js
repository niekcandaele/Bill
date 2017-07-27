const request = require('request');
const Discord = require('discord.js');
const Commando = require('discord.js-commando');

class Getlog extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'getlog',
      group: '7dtd',
      memberName: 'getlog',
      description: 'Gives information about the zcoin shop',
      details: "Specify a category",
      examples: ['shop misc']
    });
  }

  async run(msg, args) {
    const client = msg.client;
    request('{{IP}}', function(error, response, body) {
      //var data = JSON.parse(body);
      console.log(body.entries);
      console.log(body.entries[0]);

    });
  }
}

module.exports = Getlog;
