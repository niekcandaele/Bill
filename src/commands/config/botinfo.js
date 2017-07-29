const Commando = require('discord.js-commando');

class BotInfo extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'botinfo',
      group: 'config',
      memberName: 'botinfo',
      description: 'Show information about the bot.',
      examples: ['botinfo']
    });
  }

  async run(msg, args) {
    const client = msg.client;

    async function getData(callback) {
      try {
        client.logger.debug("COMMAND BOTINFO GETTING DATA");
        var website = await client.botStats.get("website");
        var githubLink = await client.botStats.get("githubLink");
        var cmdsRan = await client.botStats.get("cmdsRan");
        var amountGuilds = await client.guilds.size;
        var amountUsers = await client.users.size;
      } catch (e) {
        client.logger.error("COMMAND BOTINFO \n" + e);
        return msg.reply(e);
      }
      return callback(website,githubLink,cmdsRan, amountGuilds, amountUsers);
    }

    function buildMsg(website, githubLink, cmdsRan, amountGuilds, amountUsers) {
      var embed = {
        "content": "Bot Info",
        "embed": {
          "url": client.botStats.get("githubLink"),
          "color": 15312430,
          "timestamp": new Date(),
          "footer": {
            "icon_url": "https://cdn.discordapp.com/embed/avatars/0.png",
            "text": "Bill"
          },
          "thumbnail": {
            "url": client.displayAvatarURL
          },
          "author": {
            "name": client.username,
            "url": "https://discordapp.com",
            "icon_url": "https://cdn.discordapp.com/embed/avatars/0.png"
          },
          "fields": [{
              "name": "Discord guilds served",
              "value": amountGuilds,
              "inline": true
            },
            {
              "name": "Users",
              "value": amountUsers,
              "inline": true
            },
            {
              "name": "Commands ran",
              "value": cmdsRan
            },
            {
              "name": "Website",
              "value": website,
              "inline": true
            },
            {
              "name": "Source code",
              "value": githubLink,
              "inline": true
            },
          ]
        }
      }
      return embed
    }

    var msgToSend = await getData(buildMsg);
    msg.channel.send(msgToSend);
  }
}

module.exports = BotInfo;
