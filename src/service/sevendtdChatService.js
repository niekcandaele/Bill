class sevendtdChatService {
    constructor(discordClient, discordGuild, sevendtdServer, logService) {
        this.enabled = false
        const defaultConfig = {
            enabled: false,
            chatChannelID: false,
            serverMessages: false,
            deathMessages: true,
            connectedMessages: true,
            disconnectedMessages: true,
            publicCommands: true,
            privateCommands: false,
            billCommands: true
        }
        this.config = discordGuild.settings.get("chatBridge")
        if (!this.config) {
            discordClient.logger.warn(`${discordGuild.name} has no chat config! Settings defaults`)
            discordGuild.settings.set("chatBridge", defaultConfig)
            this.config = defaultConfig
        }

        let chatChannelID = this.config.chatChannelID
        this.chatChannel = logService.discordGuild.channels.get(chatChannelID)


        this.initialize = function (channel) {
            discordClient.logger.info(`Initializing chat bridge for ${discordGuild.name}`)
            this.enabled = true
            this.chatChannel = channel
            this.chatChannelID = channel.id
            if (this.config.connectedMessages) {
                logService.on("playerconnected", this.sendPlayerConnectedToDiscord)
            }
            if (this.config.disconnectedMessages) {
                logService.on("playerdisconnected", this.sendPlayerDisconnectedToDiscord)
            }
            if (this.config.deathMessages) {
            logService.on("playerdeath", this.sendPlayerDiedToDiscord)
            }

            logService.on("chatmessage", this.sendChatToDiscord)
            logService.on("connectionlost", this.sendConnectionLostToDiscord)
            logService.on("connectionregained", this.sendConnectionRegainedToDiscord)
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
        let currentConfig = this.chatBridge.config
        let sent = false
        if (chatMessage.type == "server" && currentConfig.serverMessages && !sent) {
            this.chatBridge.chatChannel.send(`\`SERVER : ${chatMessage.messageText}\``)
            sent = true
        }
        if (chatMessage.type == "publicCommand" && currentConfig.publicCommands && !sent) {
            this.chatBridge.chatChannel.send(`\`Public command ran by ${chatMessage.playerName}: ${chatMessage.messageText}\``)
            sent = true
        }
        if (chatMessage.type == "privateCommand" && currentConfig.privateCommands && !sent) {
            this.chatBridge.chatChannel.send(`\`Private command ran by ${chatMessage.playerName}: ${chatMessage.messageText}\``)
            sent = true
        }
        if (chatMessage.type == "billCommand" && currentConfig.billCommands && !sent) {
            this.chatBridge.chatChannel.send(`\`Bill command ran by ${chatMessage.playerName}: ${chatMessage.messageText}\``)
            sent = true
        }
        if (chatMessage.type == "chat" && !sent) {
            this.chatBridge.chatChannel.send(`${chatMessage.playerName} : ${chatMessage.messageText}`)
            sent = true
        }
       
    }

    sendPlayerConnectedToDiscord(connectedMsg) {
        let embed = this.discordClient.makeBillEmbed()
            .setTitle("Player Connected")
            .addField("Name", connectedMsg.playerName, true)
            .addField("Steam ID", connectedMsg.steamID, true)
            .addField("Country", connectedMsg.country)
            .setColor("GREEN")
        this.chatBridge.chatChannel.send({ embed })
    }

    sendPlayerDisconnectedToDiscord(disconnectedMsg) {
        let embed = this.discordClient.makeBillEmbed()
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

