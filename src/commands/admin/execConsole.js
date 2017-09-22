const Commando = require('discord.js-commando');
const request = require('request-promise');
const fs = require('fs');
const path = require('path');


class ExecConsole extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'execconsole',
      aliases: ['telnet', 'ex'],
      format: 'execconsole command arguments',
      guildOnly: true,
      group: 'admin',
      args: [{
        key: 'command',
        label: 'Command to be executed',
        prompt: 'Specify a command please',
        type: 'string'
      }],
      memberName: 'execconsole',
      description: 'Executes a console command',
      details: "Only administrators can use this command",
      examples: ['day7']
    })

  }
  hasPermission(msg) {
    const adminRole = msg.guild.settings.get("adminRole")
    let isBotOwner = this.client.isOwner(msg.author);
    let isGuildOwner = msg.guild.ownerID == msg.author.id;
    let isAdminUser = msg.member.roles.has(adminRole)
    let hasPerm = (isBotOwner || isGuildOwner || isAdminUser)
    return hasPerm
  }

  async run(msg, args) {
    const client = this.client
    const command = args.command
    const sevendtdServer = msg.guild.sevendtdServer

    if (!sevendtdServer) {
      return msg.channel.send("No 7DTD Server initialized. Please set up your server before using commands")
    }

    sevendtdServer.executeConsoleCommand(command)
      .then(function(data) {
        let input = ":inbox_tray: `" + data.command + "`"
        let output = ":outbox_tray: \n```" + data.result + "\n```"
        let embed = client.makeBillEmbed().setTitle("Console command ran");

        if (output.length > 1000) {
          let filePath = path.dirname(process.cwd())
          let fileName = `${msg.guild.name} ${data.command}.txt`
          fs.writeFile(filePath + "/data/commands/" + fileName, data.result, function(err) {
            if (err) {
              throw err
            }
            embed.setDescription(input + "\n\n" + ":outbox_tray: \n```\n Logging to file. \n```");
            msg.channel.send({
              embed: embed,
              files: [filePath + "/data/commands/" + fileName]
            })
          })
        } else {
          embed.setDescription(input + "\n\n" + output);
          msg.channel.send({
            embed: embed
          })
        }
      })
      .catch(function() {})
  }
}

module.exports = ExecConsole;
