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

  async run(msg, args) {
    const client = this.client
    let minutes = args.minutes;
    const timeout = minutes * 60000;
    let amountOfTimesToCheckIfBackOnline = 10
    // Check if author of command is guild administrator or bot owner
    if (!client.checkIfAdmin(msg.member, msg.guild)) {
      client.logger.error(msg.author.username + " tried to run " + msg.content + " command but is not authorized!");
      return msg.channel.send("You need to have the administrator role to restart the server!");
    }

    if (minutes == "stop") {
      msg.channel.send("Canceling currently scheduled restart (if there is one)");
      if (msg.guild.hasOwnProperty("interval")) {
        client.logger.debug("Cancelling server restart");
        return clearInterval(msg.guild.interval);
      }
      return
    }

    if (isNaN(minutes)) {
      return msg.channel.send("Argument has to be either a number or 'stop'!");
    }

    msg.channel.send('Server restart has been scheduled. Restart will happen in ' + minutes + " minutes");
    msg.guild.interval = setInterval(async function() {
      if (minutes == 0) {
        clearInterval(msg.guild.interval);
        restartServer();
      } else {
        msg.channel.send('Restarting the server in ' + minutes + ' minutes!');
        let requestOptions = await client.getRequestOptions(msg.guild, '/executeconsolecommand')
        requestOptions.qs.command = "say [ff00ff]Restarting_server_in_" + minutes + "_minutes."
        await request(requestOptions)
          .then(function() {})
          .catch(function(error, response) {
            client.logger.error("Error! Restart, console request failed: " + error);
            return msg.channel.send("Error executing a console command: " + requestOptions.qs.command + "error: " + error)
          })
        minutes -= 1;
      }
    }, 60000)

    async function restartServer() {
      // Kicking all players
      let requestOptions = await client.getRequestOptions(msg.guild, '/executeconsolecommand')
      requestOptions.qs.command = "kickall"
      await request(requestOptions)
        .then(async function() {
          client.logger.debug(msg.guild.name + " Succesfully kicked all players")
          // Saving the world
          let requestOptions = await client.getRequestOptions(msg.guild, '/executeconsolecommand')
          requestOptions.qs.command = "sa"
          await request(requestOptions)
            .then(async function() {
              client.logger.debug(msg.guild.name + " Succesfully saved the world")
              // Shutting down the server
              let requestOptions = await client.getRequestOptions(msg.guild, '/executeconsolecommand')
              requestOptions.qs.command = "shutdown"
              await request(requestOptions)
                .then(function() {
                  client.logger.debug(msg.guild.name + " Succesfully shut down the server")
                  msg.channel.send("Shutting down the server.")
                  // Check every 10 seconds until the server comes back online.
                  let CheckIfServerBackOnline = setInterval(async function() {
                    if (amountOfTimesToCheckIfBackOnline != 0) {
                      requestOptions = await client.getRequestOptions(msg.guild, '/executeconsolecommand');
                      requestOptions.qs.command = "help"
                      await request(requestOptions)
                        .then(function(data) {
                          clearInterval(CheckIfServerBackOnline)
                          client.logger.debug(msg.guild.name + " Server is back online!");
                          msg.channel.send("Server is back online!")
                        })
                        .catch(function(error) {
                          client.logger.debug(msg.guild.name + " Server is not online yet! Checking " + amountOfTimesToCheckIfBackOnline + " more times!");
                        })
                      amountOfTimesToCheckIfBackOnline -= 1;
                    } else {
                      clearInterval(CheckIfServerBackOnline)
                      client.logger.debug(msg.guild.name + " Server did not come back online in time!");
                      msg.channel.send("Server did not come back online in time!")
                    }
                  }, 10000);
                })
                .catch(function(error, response) {
                  client.logger.error("Error! Restart, console request failed: " + error);
                  throw error
                })
            })
            .catch(function(error, response) {
              client.logger.error("Error! Restart, console request failed: " + error);
              throw error
            })
        })
        .catch(function(error, response) {
          client.logger.error("Error! Restart, console request failed: " + error);
          return msg.channel.send("Error restarting the server: " + error)
        })
    }


  }
}

module.exports = Restart;
