const Commando = require('discord.js-commando');
const request = require('request-promise');

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

    // Requests the player data from server
    let requestOptions = await client.getRequestOptions(msg.guild, '/getplayerslocation');
    await request(requestOptions)
      .then(function(body) {
        args = args.toLocaleUpperCase();
        let embed = client.makeBillEmbed().setTitle("Last seen");
        var amountOfLines = 0; // Amount of results
        for (var i = 0; i < body.length; i++) {
          var playername = body[i].name;
          if (playername.toLocaleUpperCase().includes(args)) {
            var monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
              ],
              player = body[i],
              lastonline = player.lastonline,
              d = new Date(lastonline),
              month = monthNames[d.getMonth()],
              year = d.getFullYear(),
              day = d.getDate(),
              hours = d.getHours() + 1,
              minutes = d.getMinutes() + 1,
              lastonline = lastonline.toHHMMSS;

            // Taken from https://stackoverflow.com/questions/3177836/how-to-format-time-since-xxx-e-g-4-minutes-ago-similar-to-stack-exchange-site
            function timeSince(date) {

              var seconds = Math.floor((new Date() - date) / 1000);

              var interval = Math.floor(seconds / 31536000);

              if (interval > 1) {
                return interval + " years";
              }
              interval = Math.floor(seconds / 2592000);
              if (interval > 1) {
                return interval + " months";
              }
              interval = Math.floor(seconds / 86400);
              if (interval > 1) {
                return interval + " days";
              }
              interval = Math.floor(seconds / 3600);
              if (interval > 1) {
                return interval + " hours";
              }
              interval = Math.floor(seconds / 60);
              if (interval > 1) {
                return interval + " minutes";
              }
              return Math.floor(seconds) + " seconds";
            }
            let timeSinceOnline
            // Different message is a player is online
            if (player.online) {
              timeSinceOnline = ":white_circle: " + playername + " is online"
            } else {
              timeSinceOnline = ":black_circle: " + playername + " hasn't been online for " + timeSince(d)
            }
            var date = "Last login on " + day + " " + month + " " + year + " at " + hours + ":" + minutes;
            embed.addField(timeSinceOnline, date, true);
            amountOfLines += 1;
            if (amountOfLines > 10) {
              client.logger.debug("COMMAND seen: too many results found! " + msg.author.username + " searched for " + args);
              return msg.channel.send("Too many results! Please be more specific");
            }
          }
        }
        if (amountOfLines == 0) {
          return msg.channel.send("Player not found! (Mistyped?)");
        }
        msg.channel.send({
          embed
        })

      })
      .catch(function(error) {
        client.logger.error("Error! seen getPlayers : " + error);
        return msg.channel.send("Error! Request to server failed, did you set correct IP:port and authorization token?");
      })
  }
}

module.exports = Seen;
