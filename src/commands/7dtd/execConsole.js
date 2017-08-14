const Commando = require('discord.js-commando');
const request = require('request-promise');


class ExecConsole extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'execconsole',
      aliases: ['telnet', 'ex'],
      group: '7dtd',
      memberName: 'execconsole',
      description: 'Executes a console command',
      details: "Only administrators can use this command",
      examples: ['day7']
    });
  }

  async run(msg, args) {
    const client = this.client
    const guildOwner = msg.guild.owner
    const ownerRole = msg.guild.ownerID
    const adminRole = guildOwner.highestRole
    const Arguments = args

    let argsArr = args.split(" ");
    const cmdToRun = argsArr[0]
    const params = argsArr.splice(1, argsArr.length).join(' ')

    let requestOptions = await client.getRequestOptions(msg.guild, '/executeconsolecommand')
    requestOptions.qs.command = cmdToRun + " " + params
    // Check if author of command is guild administrator or bot owner
    if (!checkIfAdmin(msg.member)) {
      client.logger.error(msg.author.username + " tried to run " + msg.content + " command but is not authorized!");
      return msg.channel.send("You need to have the administrator role to run console commands");
    }

    await request(requestOptions)
      .then(function(data) {
        const Input = ":inbox_tray: `" + data.command + " " + data.parameters + "`"
        const Output = ":outbox_tray: \n```" + data.result + "\n```"
        let embed = client.makeBillEmbed()
          .setTitle("Console command ran")
          .setDescription(Input + "\n\n" + Output);
        msg.channel.send({
          embed
        })
      })
      .catch(function(error, response) {
        client.logger.error("Error! Exec Console request failed: " + error);
        return msg.channel.send("Error! Request to api/executeconsolecommand failed, did you set correct IP:port, authorization token and permissions?");
      })

    function checkIfAdmin(member) {
      var isAdmin = member.roles.has(adminRole.id);
      client.logger.debug("Checking if " + member.user.username + " is admin. " + isAdmin);
      if (isAdmin || client.isOwner(member.user)) {
        return true
      } else {
        return false
      }
    }
  }
}

module.exports = ExecConsole;
