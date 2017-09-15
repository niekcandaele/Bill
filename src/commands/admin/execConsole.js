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
        },
        {
          key: 'parameters',
          label: 'Parameters to go with the command',
          prompt: 'Specify parameters please',
          default: ' ',
          type: 'string'
        },
        {
          key: 'file',
          label: 'Return output as file or regular',
          prompt: 'Specify wheter you want a file or note please',
          default: '0',
          type: 'boolean'
        }
      ],
      memberName: 'execconsole',
      description: 'Executes a console command',
      details: "Only administrators can use this command",
      examples: ['day7']
    });
  }

  async run(msg, args) {
    const client = this.client
    // Check if author of command is guild administrator or bot owner
    if (!client.checkIfAdmin(msg.member, msg.guild)) {
      client.logger.error(msg.author.username + " tried to run " + msg.content + " command but is not authorized!");
      return msg.channel.send("You need to have the administrator role to run console commands");
    }

    const cmdToRun = args.command
    const params = args.parameters

    let requestOptions = await client.getRequestOptions(msg.guild, '/executeconsolecommand')
    requestOptions.qs.command = cmdToRun + " " + params

    await request(requestOptions)
      .then(function(data) {
        let input = ":inbox_tray: `" + data.command + " " + data.parameters + "`"
        let output = ":outbox_tray: \n```" + data.result + "\n```"
        let filePath = path.dirname(process.cwd()) + "/data/output/"
        let fileName = msg.guild.name + "_" + data.command + ".txt"
        let embed = client.makeBillEmbed().setTitle("Console command ran");

        if (output.length > 1750 || args.file == 1) {
          fs.writeFile(filePath + fileName, data.result, function(err) {
            if (err) {
              throw err
            }
            embed.setDescription(input + "\n\n" + ":outbox_tray: \n```\n Logging to file. \n```");
            msg.channel.send({
              embed: embed,
              files: [filePath + fileName]
            })
          })
        } else {
          embed.setDescription(input + "\n\n" + output);
          msg.channel.send({
            embed: embed
          })

        }

      })
      .catch(function(error, response) {
        client.logger.error("Error! Exec Console request failed: " + error);
        return msg.channel.send("Error! Request to api/executeconsolecommand failed. \n" + error);
      })

  }
}



module.exports = ExecConsole;
