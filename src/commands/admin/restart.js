const Commando = require('discord.js-commando');
const request = require('request-promise');
const util = require('util');
const setTimeoutPromise = util.promisify(setTimeout);


class Restart extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'restart',
      aliases: ['restart', 'r'],
      guildOnly: true,
      group: 'admin',
      memberName: 'restart',
      description: 'Shuts down the server after x minutes. Assumes the server host will restart the server automatically.',
      examples: ['restart'],
      args: [{
        key: 'minutes',
        label: 'Minutes to wait for restart',
        prompt: 'Specify minutes to restart please.',
        type: 'string',
        default: '5'
      }],
    });
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
    let minutes = args.minutes;
    const timeout = minutes * 60000;
    const sevendtdServer = msg.guild.sevendtdServer

    if (!sevendtdServer) {
      return msg.channel.send("No 7DTD Server initialized. Please set up your server before using commands")
    }

    if (args.minutes == "stop") {
      msg.channel.send("Cancelling server restart (if there is one)")
      clearInterval(msg.guild.messageInterval)
      clearTimeout(msg.guild.restartTimeout)
    } else {
      let amountOfTimesToCheckIfBackOnline = 10

      msg.guild.messageInterval = setInterval(function() {
        minutes -= 1;
        if (minutes == 0) clearInterval(msg.guild.messageInterval)
        sendRemainingTime(msg, minutes);
      }, 60000)

      msg.guild.restartTimeout = setTimeout(function() {
        msg.channel.send(`Restarting the server!`)
        sevendtdServer.executeConsoleCommand("sa")
          .then(() => sevendtdServer.executeConsoleCommand("shutdown"))
          .then(() => msg.guild.backOnlineInterval = setInterval(function() {
              amountOfTimesToCheckIfBackOnline -= 1
              if (CheckIfServerBackOnline()) {
                msg.channel.send("Server is back online!")
                clearInterval(msg.guild.backOnlineInterval)
              }
              if (amountOfTimesToCheckIfBackOnline == 0) {
                msg.channel.send("Server did not come back online in time.")
                clearInterval(msg.guild.backOnlineInterval)
              }
            }, 1000)
          )
      }, timeout)
      msg.channel.send(`Restarting the server in ${args.minutes} minutes!`)
    }


    function sendRemainingTime(msg, timeLeft) {
      if (timeLeft > 0) {
        sevendtdServer.executeConsoleCommand("say server_restart_in_" + timeLeft + "_minutes")
          .then(function() {
            return msg.channel.send(`${timeLeft} minutes(s) until server restart`);
          })
          .catch(function(error) {
            client.logger.error(`Command restart - error Say command ${error}`)
          })
      }
    }

    function CheckIfServerBackOnline() {
      return sevendtdServer.getStats().then(() => true).catch(() => false)
    }


  }
}

module.exports = Restart;
