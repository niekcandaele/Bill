const Commando = require('discord.js-commando');
const Discord = require('discord.js');

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
        var bootTime = await client.botStats.get("bootTime");
        var amountGuilds = await client.guilds.size;
        var amountUsers = await client.users.size;
        /*
@@@@@@@@@@@@ !!!!!!!!!!!!  curl https://api.github.com/repos/niekcandaele/Bill/git/refs/heads/master
{
  "ref": "refs/heads/master",
  "url": "https://api.github.com/repos/niekcandaele/Bill/git/refs/heads/master",
  "object": {
    "sha": "deccaaac2313e506de0adb7388bfad36053459fd",
    "type": "commit",
    "url": "https://api.github.com/repos/niekcandaele/Bill/git/commits/deccaaac2313e506de0adb7388bfad36053459fd"
  }
}
@@@@@@@@@@@@ !!!!!!!!!!!! curl https://api.github.com/repos/niekcandaele/Bill/git/commits/deccaaac2313e506de0adb7388bfad36053459fd
{
  "sha": "deccaaac2313e506de0adb7388bfad36053459fd",
  "url": "https://api.github.com/repos/niekcandaele/Bill/git/commits/deccaaac2313e506de0adb7388bfad36053459fd",
  "html_url": "https://github.com/niekcandaele/Bill/commit/deccaaac2313e506de0adb7388bfad36053459fd",
  "author": {
    "name": "Niek Candaele",
    "email": "niekcandaele@gmail.com",
    "date": "2017-08-02T22:50:21Z"
  },
  "committer": {
    "name": "Niek Candaele",
    "email": "niekcandaele@gmail.com",
    "date": "2017-08-02T22:50:21Z"
  },
  "tree": {
    "sha": "40507656a2bc57f31bffd3ecab86dd75a11313e8",
    "url": "https://api.github.com/repos/niekcandaele/Bill/git/trees/40507656a2bc57f31bffd3ecab86dd75a11313e8"
  },
  "message": "Comma at end of online player list deleted",
  "parents": [
    {
      "sha": "74c3419d8b2154273235a33a0b117ed396fbc3f9",
      "url": "https://api.github.com/repos/niekcandaele/Bill/git/commits/74c3419d8b2154273235a33a0b117ed396fbc3f9",
      "html_url": "https://github.com/niekcandaele/Bill/commit/74c3419d8b2154273235a33a0b117ed396fbc3f9"
    }
  ]
}

        */
      } catch (e) {
        client.logger.error("COMMAND BOTINFO \n" + e);
        return msg.channel.send("Error loading data!");
      }
      return callback(website, githubLink, cmdsRan, amountGuilds, amountUsers, bootTime);
    }

    function buildMsg(website, githubLink, cmdsRan, amountGuilds, amountUsers, bootTime) {
      const currentDate = new Date();
      let time = process.uptime();
      let uptime = time.toString().toHHMMSS();

      if (typeof cmdsRan !== "number") {
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

    var msgToSend = await getData(buildMsg);
    msg.channel.send(msgToSend);
  }
}

module.exports = BotInfo;
