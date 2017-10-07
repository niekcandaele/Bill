class sevendtdChatService {
    constructor(discordClient, discordGuild, sevendtdServer, logService) {
        this.enabled = false
        let chatChannelID = logService.discordGuild.settings.get("chatChannel")
        this.chatChannel = logService.discordGuild.channels.get(chatChannelID)


        this.initialize = function (channel) {
            discordClient.logger.info(`Initializing chat bridge for ${discordGuild.name}`)
            this.enabled = true
            this.chatChannel = channel
            this.chatChannelID = channel.id
            logService.on("chatmessage", this.sendChatToDiscord)
            logService.on("connectionlost", this.sendConnectionLostToDiscord)
            logService.on("connectionregained", this.sendConnectionRegainedToDiscord)
            logService.on("playerconnected", this.sendPlayerConnectedToDiscord)
            logService.on("playerdisconnected", this.sendPlayerDisconnectedToDiscord)
            logService.on("playerdeath", this.sendPlayerDiedToDiscord)

        }

        this.stop = function () {
            discordClient.logger.info(`Stopping chat bridge for ${discordGuild.name}`)
            logService.removeListener("chatmessage", this.sendChatToDiscord)
            logService.removeListener("connectionlost", this.sendConnectionLostToDiscord)
            logService.removeListener("connectionregained", this.sendConnectionRegainedToDiscord)
            logService.removeListener("playerconnected", this.sendPlayerConnectedToDiscord)
            logService.removeListener("playerdisconnected", this.sendPlayerDisconnectedToDiscord)
            logService.removeListener("playerdeath", this.sendPlayerDiedToDiscord)
        }


        if (discordGuild.settings.get("chatChannel")) {
            discordClient.logger.debug(`${discordGuild.name} has a chat bridge configured, starting it.`)
            let channelID = discordGuild.settings.get("chatChannel")
            this.initialize(discordGuild.channels.get(channelID))
        }
    }



    sendChatToDiscord(chatMessage) {
        this.chatBridge.chatChannel.send(`${chatMessage.playerName} : ${chatMessage.messageText}`)
    }

    sendPlayerConnectedToDiscord(connectedMsg) {
        let embed = discordClient.makeBillEmbed()
            .setTitle("Player Connected")
            .addField("Name", connectedMsg.playerName, true)
            .addField("Steam ID", connectedMsg.steamID, true)
            .addField("Country", connectedMsg.country)
            .setColor("GREEN")
        this.chatBridge.chatChannel.send({ embed })
    }

    sendPlayerDisconnectedToDiscord(disconnectedMsg) {
        let embed = discordClient.makeBillEmbed()
            .setTitle("Player left")
            .addField("Name", disconnectedMsg.playerName, true)
            .addField("Steam ID", disconnectedMsg.playerID, true)
            .setColor("RED")
        this.chatBridge.chatChannel.send({ embed })
    }

    sendPlayerDiedToDiscord(deathMessage) {
        this.chatBridge.chatChannel.send(`${deathMessage.playerName} just died.`)
    }

    sendConnectionLostToDiscord() {
        this.chatBridge.chatChannel.send(`Whoa, I can't read logs! Server might be offline...`)
    }

    sendConnectionRegainedToDiscord() {
        this.chatBridge.chatChannel.send(`Hey good news, your server is back online!`)
    }



}

module.exports = sevendtdChatService

