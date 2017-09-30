

class sevendtdLogs {
  constructor (discordClient, discordGuild, sevendtdServer) {
    this.guild = discordGuild
    const client = discordClient
    let chatChannelID = discordGuild.settings.get("chatChannel")
    let chatChannel = discordGuild.channels.get(chatChannelID)
    let firstLine = 1

    function initLogs() {
      sevendtdServer.getWebUIUpdates().then(function(result) {
        firstLine = result.newlogs;
        setInterval(function(){
          getNewLogs(firstLine)
        }, 1000)
      }).catch(function(error) {
        client.logger.error(`Error Initializing 7dtd log service \n ${error}`)
      })
    }

    function getNewLogs(firstLineToCheck) {
      sevendtdServer.getWebUIUpdates().then(function(result){
        if (result.newlogs > firstLine) {
          sevendtdServer.getLogs(firstLineToCheck).then(function(result) {
            firstLine = result.lastLine
            for (var logLine of result.entries) {
              handleLog(logLine)
            }
          }).catch(e => client.logger.error(e))
        }
      }).catch(e => client.logger.error(e))
    }

    function handleLog(logLine) {
      if (chatChannel) {
        if (logLine.msg.startsWith("Chat:")) {
          let msgToSend = logLine.msg.slice(5, logLine.msg.length)
          chatChannel.send(`INGAME: ${msgToSend}`)
        }
      }
    }

    this.initialize = function() {
      client.logger.info(`Initializing 7dtd logs for ${this.guild.id}`)
      initLogs()
    }

  }


}

module.exports = sevendtdLogs
