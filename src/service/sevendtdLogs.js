

class sevendtdLogs {
  constructor(discordClient, discordGuild, sevendtdServer) {
    this.guild = discordGuild
    const client = discordClient
    let chatChannelID = discordGuild.settings.get("chatChannel")
    let chatChannel = discordGuild.channels.get(chatChannelID)
    let firstLine = 1
    let loggingInterval
    if (discordGuild.settings.get("loggingInterval")) {
      loggingInterval = discordGuild.settings.get("loggingInterval")
    } else {
      loggingInterval = 3000
    }

    if (chatChannel) {
      initLogs()
    }

    function initLogs() {
      client.logger.info("Initializing a new logging service")
      if (discordGuild.loggingIntervalObj) {
        client.logger.info(`${discordGuild.name} already has a logging object, replacing the old one.`)
        clearInterval(discordGuild.loggingIntervalObj)
      }
      createLoggingInterval()
    }

    function createLoggingInterval() {
      sevendtdServer.getWebUIUpdates().then(function (result) {
        firstLine = result.newlogs;
        discordGuild.loggingIntervalObj = setInterval(function () {
          getNewLogs(firstLine)
        }, loggingInterval)
      }).catch(function (error) {
        client.logger.error(`Error Initializing 7dtd log service \n ${error}`)
      })
    }

    function getNewLogs(firstLineToCheck) {
      sevendtdServer.getWebUIUpdates().then(function (result) {
        if (result.newlogs > firstLine) {
          sevendtdServer.getLogs(firstLineToCheck).then(function (result) {
            firstLine = result.lastLine
            for (var logLine of result.entries) {
              handleLog(logLine)
            }
          }).catch(e => client.logger.error(e))
        }
      }).catch(e => {
        client.logger.error(`Request to ${discordGuild.name} failed! Server offline? Switching to passive logging.`)
        chatChannel.send("Oh no! I can't get logs for your server! Maybe it went down? I'll check every so often for you.")
        this.stop();
        passiveLogging();
      })
    }

    function handleLog(logLine) {
      if (discordGuild.channels.has(chatChannelID)) {
        if (logLine.msg.startsWith("Chat:")) {
          let msgToSend = logLine.msg.slice(5, logLine.msg.length)
          chatChannel.send(`INGAME: ${msgToSend}`)
        }
      }
    }

    // Less frequent checks, switches back to normal once the requests work again.
    function passiveLogging() {
      client.logger.debug(`Starting passive logging for ${discordGuild.name}`)
      discordGuild.loggingIntervalObj = setInterval(function () {
        if (sevendtdServer.checkIfOnline()) {
          client.logger.info(`Srver for ${discordGuild.name} is back online.`)
          chatChannel.send("Hey good news, your server is back online! Wooo")
        } 
      }, loggingInterval*10)
    }

    this.initialize = function () {
      client.logger.info(`Initializing 7dtd logs for ${this.guild.id}`)
      initLogs()
    }

    this.stop = function() {
      client.logger.info(`Stopping logging for ${discordGuild.name}`)
      chatChannel = false
      chatChannelID = false
      return clearInterval(discordGuild.loggingIntervalObj)
    }

    this.setChatChannel = function(newChatChannel) {
      chatChannel = newChatChannel
      chatChannelID = newChatChannel.id
    }

  }


}

module.exports = sevendtdLogs
