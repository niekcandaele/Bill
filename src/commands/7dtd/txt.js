const Commando = require('discord.js-commando');
const Discord = require('discord.js');
const request = require('request');

class Txt extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'txt',
      group: '7dtd',
      memberName: 'txt',
      description: 'Custom text command.',
      details: "Set text specific to your guild, useful for serverip, rules, help, ...",
      examples: [
        'txt set yourtextname yourtext',
        'yourtextname',
        'txt delete yourtextname',
        'txt reset',
        'txt list'
      ]
    });
  }

  async run(msg, args) {
    const client = msg.client;
    const thisConf = await client.guildConf.get(msg.guild.id);
    var textFiles = await client.txtFiles.get(msg.guild.id);
    const ownerRole = msg.guild.owner
    const adminRole = ownerRole.highestRole
    var argsArr = args.split(" ");
    const maxTextFiles = 20
    const defaultTxt = client.defaultTxt
    // Check if textFiles exist and fix if it is not the case
    client.guildTextFilesExists(textFiles, msg.guild);
    // Check if empty command
    if (args == "") {
      return msg.channel.send("Error: Arguments cannot be empty!");
    }
    // Sets a new txt entry
    if (argsArr[0] == 'set') {
      // Check if author of command is guild owner or bot owner
      if (!checkIfAdmin(msg.member)) {
        client.logger.error(msg.author.username + " tried to run " + msg + " command but is not authorized!");
        return msg.channel.send("Error: You're not the guildowner.");
      }
      if (client.getProperties(textFiles).length > maxTextFiles - 1 && !txtExist(argsArr[1])) {
        client.logger.error(msg.author.username + " on server: " + msg.guild.name + " tried to set too much txtFiles!");
        return msg.channel.send("Error: Currently you can only have a maximum of " + maxTextFiles + " txt files set. Consider deleting one to create a new file");
      }
      client.logger.info("Setting a new textfile for " + msg.guild.name);
      setTxt(argsArr.splice(1, argsArr.length));
      return
    }
    // Deletes a txt entry
    if (argsArr[0] == 'delete') {
      if (!checkIfAdmin(msg.member)) {
        client.logger.error(msg.author.username + " tried to run " + msg + " command but is not authorized!");
        return msg.channel.send("Error: You're not the guildowner.");
      }
      client.logger.info("Deleting a textfile for " + msg.guild.name);
      let newArgs = argsArr.splice(1, argsArr.length);
      delTxt(newArgs);
      return msg.channel.send("Your message has been deleted! Say goodbye one last time ----- " + newArgs);
    }

    // Lists all current txt files set
    if (argsArr[0] == 'list') {
      client.logger.info("Listing textFiles for " + msg.guild.name);
      listTxt();
      return;
    }

    // Resets text files on server and sets a default message.
    if (argsArr[0] == 'reset') {
      if (!checkIfAdmin(msg.member)) {
        client.logger.error(msg.author.username + " tried to run " + msg + " command but is not authorized!");
        return msg.channel.send("Error: You're not the guildowner.");
      }
      client.logger.info("Resetting textFiles for " + msg.guild.name + " by " + msg.author.username);
      client.txtFiles.set(msg.guild.id, defaultTxt);
      msg.channel.send("Your messages have been reset. A message will follow with your old text files if this was a mistake.");
      listTxt();
      return;
    }

    // Finds text you want to send, calls the sendTxt func to handle it
    var name = argsArr[0];
    var txtToSend = textFiles[name];
    if (typeof txtToSend == "undefined") {
      return msg.channel.send("Text not found! Mistyped?");
    } else {
      client.logger.debug("Sending txt message to: " + msg.guild.name + " ---- " + argsArr[0]);
      sendTxt([argsArr[0], txtToSend], msg);
    }
    // Sends the txt in a pretty format
    function sendTxt(txtArr, msg) {
      let txtName = txtArr[0];
      let message = txtArr[1];
      var embed = client.makeBillEmbed()
        .setTitle(txtArr[0])
        .setDescription(txtArr[1])
      msg.channel.send({
        embed
      });
    }
    // Deletes a text entry from the data
    function delTxt(args) {
      if (args.length > 1) {
        return msg.channel.send("Error: Too many arguments");
      }
      let txtName = args[0];
      delete textFiles[txtName];
      client.txtFiles.set(msg.guild.id, textFiles);
      client.logger.debug("Deleted a text file, name: " + txtName);
      return
    }
    // Adds a new text entry
    function setTxt(args) {
      client.logger.debug("Adding new text file for: " + msg.guild.name + " name: " + args[0]);
      let txtName = args[0];
      let txtText = args.slice(1, args.length).join(" ");

      // Discord embed doesn't allow messages longer than 1024 characters.
      if (txtText.length > 1000) {
        return msg.channel.send("Messages can not be longer than 1000 characters");
      }

      if (txtExist(txtName)) {
        client.logger.debug("Txt was already in config, overwriting! --- " + txtName);
        delTxt([txtName]);
      }
      textFiles[txtName] = txtText.toString();
      client.txtFiles.set(msg.guild.id, textFiles);
      msg.channel.send("Your message has been saved! Use it by typing " + client.commandPrefix + "txt" + " " + txtName);


    }
    // Lists the text entries set
    function listTxt() {
      const textFilesArr = client.getProperties(textFiles);
      try {
        let embed = client.makeBillEmbed()
          .setTitle("Amount of txt files configured: " + textFilesArr.length);
        if (textFilesArr.length == 0) {
          embed.setDescription("No text files set!");
          return msg.channel.send({embed});
        }
        for (var i = 0; i < textFilesArr.length; i++) {
          embed.addField(textFilesArr[i], textFiles[textFilesArr[i]], true)
        }
        return msg.channel.send({
          embed
        });
      } catch (e) {
        client.logger.error("Error sending list of txt files: " + e);
        return msg.channel.send("Error sending list of text files!")
      }

    }

    function txtExist(name) {
      if (textFiles[name] == undefined) {
        client.logger.debug("Txt file doesn't exist! --- " + name);
        return false
      } else {
        return true
      }
    }
    function checkIfAdmin(member) {
      var isAdmin = member.roles.has(adminRole.id);
      client.logger.debug("Checking if " + member.user.username + " is admin. " + isAdmin);
      if (isAdmin || client.isOwner(member.user)) {
        return true
      } else {
        return false
      }
    }
  }
}

module.exports = Txt;
