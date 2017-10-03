

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
      loggingInterval = 1000
    }

    function initLogs() {
      client.logger.info("Initializing a new chat channel")
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
        
      })
    }

    function handleLog(logLine) {
      if (chatChannel) {
        if (logLine.msg.startsWith("Chat:")) {
          let msgToSend = logLine.msg.slice(5, logLine.msg.length)
          chatChannel.send(`INGAME: ${msgToSend}`)
        }
      }
    }

    this.initialize = function () {
      client.logger.info(`Initializing 7dtd logs for ${this.guild.id}`)
      initLogs()
    }

    this.stop = function() {
      return clearInterval(discordGuild.loggingIntervalObj)
    }

  }


}

module.exports = sevendtdLogs
