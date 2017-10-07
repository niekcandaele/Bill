const EventEmitter = require('events');
const chatService = require("./sevendtdChatService.js")
const ipCountry = require('ip-country')

class sevendtdLogService extends EventEmitter {
    constructor(discordClient, discordGuild, sevendtdServer) {
        super()
        this.discordClient = discordClient
        this.discordGuild = discordGuild
        this.sevendtdServer = sevendtdServer
        var that = this
        let loggingInterval = discordGuild.settings.get("loggingInterval")
        if (!loggingInterval) {
            loggingInterval = 5000
        }
        ipCountry.init({
            // Return a default country when the country can not be detected from the IP. 
            fallbackCountry: 'Unknown',
            exposeInfo: false
        })
        this.chatBridge = new chatService(discordClient, discordGuild, sevendtdServer, this)

        this.initialize = function () {
            that.emit("initialize")
            discordClient.logger.info(`Initializing logging for ${this.discordGuild.name}`)

            if (discordGuild.loggingIntervalObj) {
                discordClient.logger.info(`${discordGuild.name} already has a logging object, replacing the old one.`)
                clearInterval(discordGuild.loggingIntervalObj)
            }

            // Get the latest logline and start a interval for getting new logs.
            sevendtdServer.getWebUIUpdates().then(function (result) {
                let firstLine = result.newlogs;
                discordGuild.loggingIntervalObj = setInterval(function () {
                    // Get new logs
                    sevendtdServer.getWebUIUpdates().then(function (result) {
                        if (result.newlogs > firstLine) {
                            sevendtdServer.getLogs(firstLine).then(function (result) {
                                firstLine = result.lastLine
                                for (var logLine of result.entries) {
                                    that.handleLog(logLine)
                                }
                            }).catch(e => discordClient.logger.error(e))
                        }
                    }).catch(e => {
                        discordClient.logger.warn(`Request to ${discordGuild.name} failed! Server offline? ${e}`)
                        that.emit("connectionlost", e)
                        that.passiveLogging()
                        clearInterval(discordGuild.loggingIntervalObj)
                    })

                }, loggingInterval)
            }).catch(function (error) {
                discordClient.logger.error(`Error Initializing 7dtd log service for ${discordGuild.name} \n ${error}`)
            })
        }

        this.stop = function () {
            return stopLogging(discordClient, discordGuild, sevendtdServer)
        }

    }

    passiveLogging() {
        discordGuild.passiveLoggingIntervalObj = setInterval(function() {
            if (sevendtdServer.checkIfOnline()) {
                discordClient.logger.info(`Server for ${discordGuild.name} is available again. Restarting regular logging.`)
                clearInterval(discordGuild.passiveLoggingIntervalObj)
                this.emit("connectionregained")
                this.initialize()
            }
        }, loggingInterval*10)
    }

    // Detect what log line is for and send out an event
    handleLog(logLine) {
        this.emit("newlogline", logLine)
        if (logLine.msg.startsWith("Chat:")) {
            // Chat: 'Dave': can you enter the radiated zone with full hazmat>?
            let chatMessage = logLine.msg.split(" ")
            let playerName = chatMessage[1].replace(/'/g, "").replace(":", "").trim();
            let messageText = chatMessage.slice(2, chatMessage.length).join(' ');
            let date = logLine.date
            let time = logLine.time
            chatMessage = {
                playerName,
                messageText,
                date,
                time
            }
            this.emit("chatmessage", chatMessage)
        }
        if (logLine.msg.startsWith("Player connected,")) {
            let date = logLine.date
            let time = logLine.time
            let logMsg = logLine.msg.split(",")

            let entityID = logMsg[1].replace("entityid=", "").trim()
            let playerName = logMsg[2].replace("name=", "").trim()
            let steamID = logMsg[3].replace("steamid=", "").trim()
            let steamOwner = logMsg[4].replace("steamOwner=", "").trim()
            let ip = logMsg[5].replace("ip=", "").trim()
            let country = ipCountry.country(ip)

            let connectedMsg = {
                entityID,
                playerName,
                steamID,
                steamOwner,
                ip,
                country,
                date,
                time
            }
            this.emit("playerconnected", connectedMsg)
        }

        if (logLine.msg.includes("GMSG: Player") && logLine.msg.includes("died")) {
            let deathMessage = logLine.msg.split(" ")
            let playerName = deathMessage.slice(2,deathMessage.length-1).join(" ").replace(/'/g, "")
            let date = logLine.date
            let time = logLine.time
            deathMessage = {
                playerName,
                date,
                time
            }
            this.emit("playerdeath", deathMessage)
        }

        if (logLine.msg.startsWith("Player disconnected:")) {
            let date = logLine.date
            let time = logLine.time
            let logMsg = logLine.msg
            logMsg = logMsg.replace("Player disconnected", "")
            logMsg = logMsg.split(",")


            let entityID = logMsg[0].replace(": EntityID=", "").trim()
            let playerID = logMsg[1].replace("PlayerID=", "").replace(/'/g, "").trim()
            let ownerID = logMsg[2].replace("OwnerID=", "").replace(/'/g, "").trim()
            let playerName = logMsg[3].replace("PlayerName=", "").replace(/'/g, "").trim()

            let disconnectedMsg = {
                entityID,
                playerName,
                ownerID,
                playerID,
                date,
                time
            }
            this.emit("playerdisconnected", disconnectedMsg)


        }

    }

    static stopLogging() {

    }


}

module.exports = sevendtdLogService


