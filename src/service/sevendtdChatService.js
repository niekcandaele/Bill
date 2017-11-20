class sevendtdChatService {
    constructor(discordClient, discordGuild, sevendtdServer, logService) {
        this.discordClient = discordClient
        this.discordGuild = discordGuild
        this.logService = logService
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

        if (this.config.enabled) {
            discordClient.logger.debug(`${discordGuild.name} has a chat bridge configured, starting it.`)
            let channelID = discordGuild.settings.get("chatChannel")
            this.initialize(channelID)
        }

    }

    initialize(channelID) {
        this.discordClient.logger.info(`Initializing chat bridge for ${this.discordGuild.name}`)
        this.enabled = true
        var chatChannel = this.discordGuild.channels.get(channelID)
        if (this.config.connectedMessages) {
            this.logService.on("playerconnected", this.sendPlayerConnectedToDiscord)
        }
        if (this.config.disconnectedMessages) {
            this.logService.on("playerdisconnected", this.sendPlayerDisconnectedToDiscord)
        }
        if (this.config.deathMessages) {
            this.logService.on("playerdeath", this.sendPlayerDiedToDiscord)
        }

        this.logService.on("chatmessage", this.sendChatToDiscord)
        this.logService.on("connectionlost", this.sendConnectionLostToDiscord)
        this.logService.on("connected", this.sendConnectedToDiscord)
    }

    stop() {
        this.enabled = false
        this.discordClient.logger.info(`Stopping chat bridge for ${this.discordGuild.name}`)
        this.logService.removeListener("chatmessage", this.sendChatToDiscord)
        this.logService.removeListener("connectionlost", this.sendConnectionLostToDiscord)
        this.logService.removeListener("connected", this.sendConnectedToDiscord)
        this.logService.removeListener("playerconnected", this.sendPlayerConnectedToDiscord)
        this.logService.removeListener("playerdisconnected", this.sendPlayerDisconnectedToDiscord)
        this.logService.removeListener("playerdeath", this.sendPlayerDiedToDiscord)
    }


    sendChatToDiscord(chatMessage) {
        let currentConfig = this.discordGuild.settings.get("chatBridge")
        let chatChannel = this.discordGuild.channels.get(currentConfig.chatChannelID)
        let sent = false

        if (chatMessage.type == "server" && currentConfig.serverMessages && !sent) {
            chatChannel.send(`\`SERVER : ${chatMessage.messageText}\``)
            sent = true
        }
        if (chatMessage.type == "publicCommand" && currentConfig.publicCommands && !sent) {
            chatChannel.send(`\`Public command ran by ${chatMessage.playerName}: ${chatMessage.messageText}\``)
            sent = true
        }
        if (chatMessage.type == "privateCommand" && currentConfig.privateCommands && !sent) {
            chatChannel.send(`\`Private command ran by ${chatMessage.playerName}: ${chatMessage.messageText}\``)
            sent = true
        }
        if (chatMessage.type == "billCommand" && currentConfig.billCommands && !sent) {
            chatChannel.send(`\`Bill command ran by ${chatMessage.playerName}: ${chatMessage.messageText}\``)
            sent = true
        }
        if (chatMessage.type == "chat" && !sent) {
            chatChannel.send(`${chatMessage.playerName} : ${chatMessage.messageText}`)
            sent = true
        }

    }

    sendPlayerConnectedToDiscord(connectedMsg) {
        let currentConfig = this.discordGuild.settings.get("chatBridge")
        let chatChannel = this.discordGuild.channels.get(currentConfig.chatChannelID)
        let embed = this.discordClient.makeBillEmbed()
            .setTitle("Player Connected")
            .addField("Name", connectedMsg.playerName, true)
            .addField("Steam ID", `[${connectedMsg.steamID}](https://steamidfinder.com/lookup/${connectedMsg.steamID}/)`, true)
            .addField("Country", connectedMsg.country)
            .setColor("GREEN")
        chatChannel.send({ embed })
    }

    sendPlayerDisconnectedToDiscord(disconnectedMsg) {
        let currentConfig = this.discordGuild.settings.get("chatBridge")
        let chatChannel = this.discordGuild.channels.get(currentConfig.chatChannelID)
        let embed = this.discordClient.makeBillEmbed()
            .setTitle("Player left")
            .addField("Name", disconnectedMsg.playerName, true)
            .addField("Steam ID", `[${disconnectedMsg.playerID}](https://steamidfinder.com/lookup/${disconnectedMsg.playerID}/)`, true)
            .setColor("RED")
        chatChannel.send({ embed })
    }

    sendPlayerDiedToDiscord(deathMessage) {
        let currentConfig = this.discordGuild.settings.get("chatBridge")
        let chatChannel = this.discordGuild.channels.get(currentConfig.chatChannelID)
        chatChannel.send(`${deathMessage.playerName} just died.`)
    }

    sendConnectionLostToDiscord() {
        let currentConfig = this.discordGuild.settings.get("chatBridge")
        let chatChannel = this.discordGuild.channels.get(currentConfig.chatChannelID)
        chatChannel.send(`Whoa, I can't read logs! Server might be offline...`)
    }

    sendConnectedToDiscord() {
        let currentConfig = this.discordGuild.settings.get("chatBridge")
        let chatChannel = this.discordGuild.channels.get(currentConfig.chatChannelID)
        chatChannel.send(`Connected to your server!`)
    }



}

module.exports = sevendtdChatService