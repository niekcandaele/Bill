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
    const guild =  msg.guild
    const ip = guild.settings.get("serverip");
    const port = guild.settings.get("webPort");

    let embed = client.makeBillEmbed().setTitle("Current config for " + msg.guild.name)
    .addField("IP", ip).addField("Port", port);


    msg.channel.send({
      embed
    })
  }
}
module.exports = GuildConfig;
