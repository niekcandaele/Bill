const Commando = require('discord.js-commando');
const Discord = require('discord.js');

const toDDHHMMSS = require('../../util/toDDHHMMSS.js')

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

    try {
      client.logger.debug("Command botinfo - getting data");
      var cmdsRan = await client.botStats.get("cmdsRan");
      var website = client.config.website
      var githubLink = client.config.github
      var amountGuilds = await client.guilds.size;
      var amountUsers = await client.users.size;
    } catch (e) {
      client.logger.error("Command botinfo - \n" + e);
      return msg.channel.send("Error loading data!");
    }

    function buildMsg(website, githubLink, cmdsRan, amountGuilds, amountUsers) {
      const currentDate = new Date();
      let time = process.uptime();
      let uptime = toDDHHMMSS(time.toString())
      if (isNaN(cmdsRan)) {
        client.logger.debug("Type of cmdsRan: " + typeof cmdsRan);
        client.logger.error("BOTINFO CmdsRan == " + typeof cmdsRan + "--- Setting to 0");
        cmdsRan = 0;
        client.botStats.set("cmdsRan", cmdsRan);
      }
      var embed = client.makeBillEmbed();
      embed.setTitle("Bill - A discord bot for 7 days to die")
        .addField("Discord guilds served: " + amountGuilds, "Users: " + amountUsers, true)
        .addField("Uptime", uptime.days + ":" + uptime.hours + ":" + uptime.minutes + ":" + uptime.seconds, true)
        .addField("Commands Ran", cmdsRan)
        .addField("Website", website, true)
        .addField("Source Code", githubLink, true)
      return {
        embed
      }
    }
    var msgToSend = buildMsg(website, githubLink, cmdsRan, amountGuilds, amountUsers)
    msg.channel.send(msgToSend);
  }
}

module.exports = BotInfo;
