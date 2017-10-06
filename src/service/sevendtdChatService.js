class sevendtdChatService {
    constructor(discordClient, discordGuild, sevendtdServer, logService) {
        this.enabled = false
        let chatChannelID = logService.discordGuild.settings.get("chatChannel")
        let chatChannel = logService.discordGuild.channels.get(chatChannelID)

        this.initialize = function (channel) {
            discordClient.logger.info(`Initializing chat bridge for ${discordGuild.name}`)
            this.enabled = true
            chatChannel = channel
            chatChannelID = channel.id
        }

        this.stop = function () {
            discordClient.logger.info(`Stopping chat bridge for ${discordGuild.name}`)
            this.enabled = false
        }


        if (discordGuild.settings.get("chatChannel")) {
            discordClient.logger.debug(`${discordGuild.name} has a chat bridge configured, starting it.`)
            this.enabled = true
        }

        logService.on("chatmessage", chatMessage => {
            if (this.enabled && chatMessage.playerName != "Server") {
                chatChannel.send(`${chatMessage.playerName} : ${chatMessage.messageText}`)
            }
        })

        logService.on("connectionlost", error => {
            if (this.enabled) {
                chatChannel.send(`Whoa, I can't read logs! Server might be offline...`)
            }
        })

        logService.on("playerconnected", connectedMsg => {
            if (this.enabled) {
                discordClient.logger.debug(`${connectedMsg.playerName} has connected to ${discordGuild.name}`)
                let embed = discordClient.makeBillEmbed()
                    .setTitle("Player Connected")
                    .addField("Name", connectedMsg.playerName, true)
                    .addField("Steam ID", connectedMsg.steamID, true)
                    .addField("Country", connectedMsg.country)
                    .setColor("GREEN")
                chatChannel.send({ embed })
            }
        })

        logService.on("playerdisconnected", disconnectedMsg => {
            if (this.enabled) {
                discordClient.logger.debug(`${disconnectedMsg.playerName} has disconnected to ${discordGuild.name}`)
                let embed = discordClient.makeBillEmbed()
                    .setTitle("Player left")
                    .addField("Name", disconnectedMsg.playerName, true)
                    .addField("Steam ID", disconnectedMsg.playerID, true)
                    .setColor("RED")
                chatChannel.send({ embed })
            }
        })

        logService.on("playerdeath", deathMessage => {
            if (this.enabled) {
                chatChannel.send(`${deathMessage.playerName} just died.`)
            }
        })

    }

}

module.exports = sevendtdChatService

