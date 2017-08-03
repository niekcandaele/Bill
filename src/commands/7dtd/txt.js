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
        'txt yourtextname'
      ]
    });
  }

  async run(msg, args) {
    const client = msg.client;
    const thisConf = await client.guildConf.get(msg.guild.id);
    var textFiles = await client.txtFiles.get(msg.guild.id);
    const ownerRole = thisConf.guildOwner;
    var argsArr = args.split(" ");


    // Check if empty command
    if (args == "") {
      return msg.reply("Arguments cannot be empty!");
    }
    if (args == "test") {
      return console.log(textFiles);
    }
    if (argsArr[0] == 'set') {
      client.logger.debug("Setting a new textfile for " + msg.guild.name);
      setTxt(argsArr.splice(1, argsArr.length));
      msg.channel.send("Your message has been saved! Use it by typing " + client.commandPrefix + this.name + " " + args.split(" ")[1]);
      return
    }
    if (argsArr[0] == 'delete') {
      client.logger.debug("Deleting a textfile for " + msg.guild.name);
      delTxt(argsArr.splice(1, argsArr.length));
      return msg.channel.send("Your message has been deleted! Say goodbye one last time ----- " + args.split(" ")[1])
    }

    // Finds text you want to send, calls the sendTxt func to handle it
    var name = argsArr[0];
    var txtToSend = await textFiles[name];
    if (txtToSend == undefined) {
      return msg.reply("Text not found! Mistyped?");
    } else {
      client.logger.debug("Sending txt message to: " + msg.guild.name + " ---- " + argsArr[0]);
      sendTxt([argsArr[0],txtToSend], msg);
    }



    function sendTxt(txtArr, msg) {
      var embed = new Discord.RichEmbed()
        .setTitle("Bill - A discord bot for 7 days to die")
        .setDescription(txtArr[0])
        .setColor(3447003)
        .setTimestamp()
        .setURL("https://niekcandaele.github.io/Bill/")
        .setFooter("-", "http://i.imgur.com/ljZEihK.png")
        .setThumbnail("http://i.imgur.com/ljZEihK.png")
        .addField("Message", txtArr[1]);
      msg.channel.send({
        embed
      });
    }

    function delTxt(args) {

      if (args.length > 1) {
        return msg.reply("Too many arguments");
      }

      console.log(args);

      client.logger.debug("Deleted a text file, name: " + args[0]);


    }

    function setTxt(args) {
      client.logger.debug("Adding new text file for: " + msg.guild.name +  " name: " + args[0]);
      let txtName = args[0];
      let txtText = args.slice(1, args.length);
      console.log(txtText);

      if (txtExist(txtName)) {
        client.logger.debug("Txt was already in config, overwriting! --- " + txtName);
        delTxt(txtName);
      }

      textFiles[txtName] = txtText;
      client.txtFiles.set(msg.guild.id, textFiles);




      function txtExist(name) {
        if (textFiles.name == undefined) {
          client.logger.debug("Txt file doesn't exist! --- " + name);
          return false
        } else {
          return true
        }
      }

    }


  }
}

module.exports = Txt;
