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
    const webPort = thisConf.webPort;
    const serverAdress = "http://" + serverip + ":" + webPort;
    var timeLastOnline;
    var msgToSend = ""; // Used for building the message to send
    if (args == "") {
      return msg.channel.send("Specify a player please! \n Example: !seen <playername>");
    }

    function getPlayers() {
      request(serverAdress + '/api/getplayerslocation', function(error, response, body) {
        if (error) {
          client.logger.error(error);
          return msg.reply("Error! Request to server failed, did you set a correct IP?");
        }
        var data = JSON.parse(body);
        var i = 0;
        args = args.toLocaleUpperCase();
        let embed = client.makeBillEmbed();
        embed.setTitle("Last seen");

        var amountOfLines = 0; // Amount of results
        for (var i = 0; i < data.length; i++) {
          var playername = data[i].name;
          if (playername.toLocaleUpperCase().includes(args)) {
            var monthNames = ["January", "February", "March", "April", "May", "June",
              "July", "August", "September", "October", "November", "December"
            ];
            var d = new Date(data[i].lastonline);
            var day = d.getDate();
            var month = monthNames[d.getMonth()];
            var year = d.getFullYear();
            var hours = d.getHours() + 1;
            var minutes = d.getMinutes() + 1;
            var date = day + " " + month + " " + year + " at " + hours + ":" + minutes;
            embed.addField(playername, date);
            amountOfLines += 1;
          }
          if (amountOfLines > 10) {
            client.logger.debug("COMMAND seen: too many results found! " + msg.author.username + " searched for " + args);
            return msg.channel.send("Too many results! Please be more specific");
          }
        }
        if (amountOfLines == 0) {
          msg.channel.send("Player not found! (Mistyped?)");
        } else {
          msg.channel.send({embed});
        }

      });
    }
    getPlayers();
  }
}

module.exports = Seen;
