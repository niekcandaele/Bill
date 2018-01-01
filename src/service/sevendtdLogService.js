const EventEmitter = require('events');

var sevenDays = require('machinepack-7daystodiewebapi');

class sevendtdLogService extends EventEmitter {
    constructor(discordClient, discordGuild, sevendtdServer) {
        super()
        this.discordClient = discordClient
        this.discordGuild = discordGuild
        this.sevendtdServer = sevendtdServer
        var that = this
        var eventEmitter = this
        const defaultConfig = {
            loggingInterval: "5000"
        }

        const sdtdServerConf = discordGuild.settings;
        const serverip = sdtdServerConf.get("serverip");
        const webPort = sdtdServerConf.get("webPort");
        const authName = sdtdServerConf.get('authName');
        const authToken = sdtdServerConf.get("authToken");

        // Make sure a config is loaded
        this.config = discordGuild.settings.get("loggingService")
        if (!this.config) {
            discordClient.logger.warn(`${discordGuild.name} has no logging config! Settings defaults`)
            discordGuild.settings.set("loggingService", defaultConfig)
            this.config = defaultConfig
        }


        this.initialize = function() {
            sevenDays.startLoggingEvents({
                ip: serverip,
                port: webPort,
                authName: authName,
                authToken: authToken
            }).exec({
                error: function() {
                    discordClient.logger.warn(`Error getting logs for ${discordGuild.name}`)
                    throw e
                },
                success: function(logEmitter) {
                    discordClient.logger.debug(`Successfully got a log emitter object for ${discordGuild.name}`)
                    logEmitter.on('logLine', function newLogLine(logLine) {
                        that.handleLog(logLine)
                    })
                    logEmitter.on('connectionLost', function connectionLost(conLostMsg) {
                        eventEmitter.emit('connectionlost')
                    })
                    logEmitter.on('connected', function connectionLost(conLostMsg) {
                        eventEmitter.emit('connected')
                    })
                }

            })
        }

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
            let type = "chat"
            if (playerName == 'Server') {
                type = "server"
            }
            if (messageText.startsWith("!")) {
                type = "publicCommand"
            }
            if (messageText.startsWith("/")) {
                type = "privateCommand"
            }
            if (messageText.startsWith(this.discordGuild.commandPrefix)) {
                type = "billCommand"
                this.emit("billCommand", chatMessage)
            }
            chatMessage = {
                playerName,
                messageText,
                type,
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
            this.discordClient.logger.debug(`${connectedMsg.playerName} has connected to ${this.discordGuild.name}`)
            this.emit("playerconnected", connectedMsg)
        }

        if (logLine.msg.includes("GMSG: Player") && logLine.msg.includes("died")) {
            let deathMessage = logLine.msg.split(" ")
            let playerName = deathMessage.slice(2, deathMessage.length - 1).join(" ").replace(/'/g, "")
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
            this.discordClient.logger.debug(`${disconnectedMsg.playerName} has disconnected from ${this.discordGuild.name}`)
            this.emit("playerdisconnected", disconnectedMsg)


        }

    }

    stop() {
        clearInterval(this.loggingIntervalObj)
        clearInterval(this.passiveLoggingIntervalObj)
    }


}

module.exports = sevendtdLogService