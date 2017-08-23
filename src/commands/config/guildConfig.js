const Commando = require('discord.js-commando');

class GuildConfig extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'guildconfig',
      group: 'config',
      memberName: 'guildconfig',
      guildOnly: true,
      description: 'Shows a list of the current config',
      examples: ['guildconfig']
    });
  }

  async run(msg, args) {
    const client = this.client;
    const thisConf = await client.guildConf.get(msg.guild.id);
    const guildOwner = msg.guild.owner

    // Check if author of command is guild administrator or bot owner
    if (!client.checkIfAdmin(msg.member, msg.guild)) {
      client.logger.error(msg.author.username + " tried to run " + msg.content + " command but is not authorized!");
      return msg.channel.send("You need to have the administrator role to view the server config");
    }

    let confKeys = Object.keys(thisConf);
    let confValues = Object.values(thisConf);

    let embed = client.makeBillEmbed().setTitle("Current config for " + msg.guild.name);

    for (var i = 0; i < confKeys.length; i++) {
      // We don't want to post the authname and token to the public!
      if (confKeys[i] != 'authName' && confKeys[i] != 'authToken') {
        embed.addField(confKeys[i], confValues[i], true)
      }
    }
    msg.channel.send({embed})
  }
}
module.exports = GuildConfig;
