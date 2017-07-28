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
    const thisConf = await client.guildConf.get(msg.guild.id);
    const serverip = thisConf.serverip;
    var timeLastOnline;
    var msgToSend = ""; // Used for building the message to send
    if (args == "") {
      return msg.channel.send("Specify a player please! \n Example: !seen <playername>");
    }

    function getPlayers() {
      request('http://' + serverip + '/api/getplayerslocation', function(error, response, body) {
        if (error) {
          client.logger.error(error);
          return msg.reply("Error! Request to server failed, did you set a correct IP?");
        }
        var data = JSON.parse(body);
        var i = 0;
        args = args.toLocaleUpperCase();

        var amountOfLines = 0; // Amount of results
        for (var i = 0; i < data.length; i++) {
          var playername = data[i].name.toLocaleUpperCase();
          if (playername.includes(args)) {
            var d = new Date(data[i].lastonline);
            var line = "Player " + playername + " was last seen on " + d + "\n"
            msgToSend += line;
            amountOfLines += 1;
          }
          if (amountOfLines > 10) {
            client.logger.debug("COMMAND seen: too many results found! " + msg.author.username + " searched for " + args);
            return msg.reply("Too many results! Please be more specific");
          }
        }
        if (msgToSend == "") {
          msg.channel.send("Player not found! (Mistyped?)");
        } else {
          msg.channel.send(msgToSend);
        }

      });
    }
    getPlayers();
  }
}

module.exports = Seen;
