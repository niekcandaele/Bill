const Commando = require('discord.js-commando');
const request = require('request');

class Seen extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'seen',
      group: '7dtd',
      memberName: 'seen',
      description: 'Tells you when a player was last online',
      details: "Shows dateTime",
      examples: ['seen Catalysm']
    });
  }

  async run(msg, args) {
    const client = msg.client;
    var timeLastOnline;
    if (args == "") {
      return msg.channel.send("Specify a player please! \n Example: !seen <playername>");
    }

    function getPlayers() {
      request('http://147.135.220.171:18246/api/getplayerslocation', function(error, response, body) {
        var data = JSON.parse(body);
        var i = 0;
        args = args.toLocaleUpperCase();

        for (var i = 0; i < data.length; i++) {
          var playername = data[i].name.toLocaleUpperCase();
          if (playername == args) {
            var d = new Date(data[i].lastonline);
            return msg.channel.send("Player " + args + " was last seen on " + d)
          }
        }
        msg.channel.send("Player not found! (Mistyped?)")

      });
    }
    getPlayers();
  }
}

module.exports = Seen;
