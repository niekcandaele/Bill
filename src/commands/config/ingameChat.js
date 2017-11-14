const Commando = require('discord.js-commando');
const Discord = require('discord.js');

class IngameChat extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'ingamechat',
            group: 'config',
            memberName: 'ingamechat',
            guildOnly: true,
            description: 'Command to control the ingame chat bridge',
            aliases: ['chatbrige', 'igc'],
            args: [{
                key: 'action',
                label: 'What action to perform on the chat bridge',
                type: 'string',
                prompt: "Please provide an action"
            }],
        });
    }

    hasPermission(msg) {
        const adminRole = msg.guild.settings.get("adminRole")
        let isBotOwner = this.client.isOwner(msg.author);
        let isGuildOwner = msg.guild.ownerID == msg.author.id;
        let isAdminUser = msg.member.roles.has(adminRole)
        let hasPerm = (isBotOwner || isGuildOwner || isAdminUser)
        return hasPerm
    }

    async run(msg, args) {
        const currentConfig = msg.guild.settings.get("chatBridge")
        let newConfig = currentConfig

        if (!msg.guild.sevendtdServer) {
            return msg.channel.send("No 7DTD Server initialized. Please set up your server before using commands")
        }

        if (args.action == "init") {
            if (currentConfig.enabled) {
                msg.channel.send("You've already got a chat bridge set up! Reloading your configuration")
                msg.guild.sevendtdServer.chatBridge.stop()
            } else {
                msg.channel.send("Initializing a chat bridge in this channel!")
            }
            newConfig.enabled = true
            newConfig.chatChannelID = msg.channel.id
            msg.guild.sevendtdServer.chatBridge.initialize(msg.channel)
        }

        if (args.action == "stop") {
            newConfig.chatChannelID = false
            msg.guild.sevendtdServer.chatBridge.stop()
            return msg.channel.send("Stopping chat channel.")
        }

        if (args.action == "connectedMessages") {
            if (currentConfig.connectedMessages) {
                msg.channel.send("Turning off player connect messages")
            } else {
                msg.channel.send("Turning on player connect messages")
            }
            newConfig.connectedMessages = !currentConfig.connectedMessages
        }

        if (args.action == "disconnectedMessages") {
            if (currentConfig.disconnectedMessages) {
                msg.channel.send("Turning off player disconnect messages")
            } else {
                msg.channel.send("Turning on player disconnect messages")
            }
            newConfig.disconnectedMessages = !currentConfig.disconnectedMessages
        }

        if (args.action == "deathMessages") {
            if (currentConfig.deathMessages) {
                msg.channel.send("Turning off player death messages")
            } else {
                msg.channel.send("Turning on player death messages")
            }
            newConfig.deathMessages = !currentConfig.deathMessages
        }


        if (args.action == "serverMessages") {
            if (currentConfig.serverMessages) {
                msg.channel.send("Turning off server messages")
            } else {
                msg.channel.send("Turning on server messages")
            }
            newConfig.serverMessages = !currentConfig.serverMessages
        }


        if (args.action == "publicCommands") {
            if (currentConfig.publicCommands) {
                msg.channel.send("Turning off public commands")
            } else {
                msg.channel.send("Turning on public commands")
            }
            newConfig.publicCommands = !currentConfig.publicCommands
        }

        if (args.action == "privateCommands") {
            if (currentConfig.privateCommands) {
                msg.channel.send("Turning off private commands")
            } else {
                msg.channel.send("Turning on private commands")
            }
            newConfig.privateCommands = !currentConfig.privateCommands
        }

        if (args.action == "billCommands") {
            if (currentConfig.billCommands) {
                msg.channel.send("Turning off Bill commands")
            } else {
                msg.channel.send("Turning on Bill commands")
            }
            newConfig.billCommands = !currentConfig.billCommands
        }

        if (args.action == "config") {
            let embed = this.client.makeBillEmbed()
                .addField("Status", currentConfig.enabled, true)
                .addField("Chat channel ID", currentConfig.chatChannelID, true)
                .addField("Server messages", currentConfig.serverMessages, true)
                .addField("Death messages", currentConfig.deathMessages, true)
                .addField("Connected messages", currentConfig.connectedMessages, true)
                .addField("Disconnected messages", currentConfig.disconnectedMessages, true)
                .addField("Public commands", currentConfig.publicCommands, true)
                .addField("Private commands", currentConfig.privateCommands, true)
                .addField("Bill Commands", currentConfig.billCommands, true)
                .setTitle("Current chat bridge config")
            msg.channel.send({ embed })
        }

        msg.guild.settings.set("chatBridge", newConfig)
    }
}

module.exports = IngameChat;