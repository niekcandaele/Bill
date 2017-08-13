const Commando = require('discord.js-commando');
const Discord = require('discord.js');
const fs = require('fs');
const request = require('request');
const path = require('path');
const logger = require('logger');
const persistentCollection = require('djs-collection-persistent');

const client = new Commando.Client({
  owner: '220554523561820160',
  commandPrefix: '$',
  invite: "https://discordapp.com/invite/kuDJG6e",
  unknownCommandResponse: false
});

var loggerLevel;

client.on('ready', () => {
  client.logger = logger.createLogger('../logs/development.log');
  client.logger.info('Bot has logged in');
  client.logger.setLevel(loggerLevel);
  client.logger.info("Loading guild Configs");
  client.guildConf = new persistentCollection({
    name: 'guildConf',
    dataDir: '../data'
  });
  client.botStats = new persistentCollection({
    name: 'botStats',
    dataDir: '../data'
  });
  client.txtFiles = new persistentCollection({
    name: 'txtFiles',
    dataDir: '../data'
  });
  client.defaultTxt = {
    default: 'Default message. See website for info on how to set up text messages!'
  };
  // Wait for the collections to be loaded to start initializing data
  client.txtFiles.event.on('ready', () => {
    client.logger.info("Guild configs created");
    initData();
  })
  client.commandPrefix = client.guildConf.get("prefix");
  client.user.setGame(client.commandPrefix + "botinfo");
  console.log('Bill\'s  ready!');


  // Reset data on test server
  //client.guildConf.set("336821518250147850", defaultSettings);
  // Set test data for txt files on test server
  //client.txtFiles.delete("336821518250147850"); //, {default: 'test',default2: 'test2'});

});

// Logs when a command is run (monitoring for beta stage)
client.on('commandRun', (command, promise, message) => {
  client.logger.info("COMMAND RAN: " + command.name + " run by " + message.author.username + " like this: " + message.cleanContent);
  var cmdsRan = client.botStats.get('cmdsRan');
  client.botStats.set('cmdsRan', cmdsRan + 1);
});
client.on("guildCreate", guild => {
  if (!client.guildConf.has(guild.id)) {
    client.logger.info("New guild added, default settings loaded. -- " + guild.name);
    var thisConf = defaultSettings;
    thisConf.guildOwner = guild.ownerID;
    client.guildConf.set(guild.id, defaultSettings);
    client.txtFiles.set(guild.id, client.defaultTxt);
  }
});
client.on("guildDelete", guild => {
  try {
    client.logger.info("Deleting guild -- " + guild.name);
    client.guildConf.delete(guild.id);
    client.txtFiles.delete(guild.id);
    client.logger.info("Guild deleted -- " + guild.name);
  } catch (e) {
    client.logger.error("Guild Delete " + e)
  }
});
// Custom messages with txt command. This is where we check for shortform txt commands
client.on("message", message => {
  const Registry = client.registry;
  const Commands = Registry.commands;
  let args = message.content.slice(1, message.content.length);

  // If message doesn't start with the command prefix, we don't do anything
  if (message.content.startsWith(client.commandPrefix)) {
    // Shortform text only has a textname without spaces.
    if (args.includes(" ")) {
      return
    }
    const textFiles = client.txtFiles.get(message.guild.id);
    // Check if textFiles for guild is defined. (Data is sometimes not initialized properly if bot gets added when offline)
    if (!client.guildTextFilesExists(textFiles, message.guild)) {
      return message.channel.send("Error! TextFiles undefined, setting defaults! Try running your command again")
    }
    // Check if message exists in textfiles
    if (textFiles[args]) {
      const txtName = args
      const txtToSend = textFiles[args];
      // Sends the text
      let embed = client.makeBillEmbed();
      client.logger.info("Short form of txt ran: --- " + message.guild.name + " " + message.content)
      embed.setDescription(txtToSend)
        .setTitle(txtName);
      return message.channel.send({
        embed
      });
    } else {
      // Check if it is a command
      client.logger.debug("Message sent -- Is " + args + " in Commands? : " + Commands.has(args));
      if (Commands.has(args)) {
        return
      }
      return client.logger.info(message.guild.name + " --- Invalid command --- By: " + message.author.username + " --- " + message.content);
    }

  }
});

client.on("commandError", (command, err, message) => {
  client.logError(err);
});

client.logError = function(error) {
  client.logger.error("Logging error to dev server");
  const devGuild = client.guilds.get("336821518250147850");
  const errorChannel = devGuild.channels.get("336823516383150080");
  errorChannel.send("Error!\nError trace: " + error, {code: true});
}

process.on('uncaughtException', function(err) {
  client.logError(err);
  client.logger.error(err);
  console.log(err); //Send some notification about the error
  //process.exit(1);
});

const defaultSettings = {
  prefix: "$",
  modRole: "Moderator",
  adminRole: "Administrator",
  guildOwner: "id",
  serverip: "localhost",
  webPort: "1234",
  authName: "bill",
  authToken: "secretToken"
}; // authToken should be changed!

function getDateStamp() {
  let currentDate = new Date();
  let dd = currentDate.getDate();
  let mM = currentDate.getMonth() + 1;
  let hh = currentDate.getHours();
  let mm = currentDate.getMinutes();
  var yyyy = currentDate.getFullYear();
  if (dd < 10) {
    dd = '0' + dd
  }
  if (mm < 10) {
    mm = '0' + mm
  }
  if (mM < 10) {
    mM = '0' + mM
  }
  if (hh < 10) {
    hh = '0' + hh
  }
  return currentDate = yyyy + '.' + mM + '.' + dd; // + '.' + hh;
}

// Format for sending messages that look consistent
client.makeBillEmbed = function() {
  const Colours = [
    'D2FF28',
    'D6F599',
    '436436',
    'C84C09'
  ]
  var randomColour = Colours[Math.floor(Math.random() * Colours.length)]
  var embed = new Discord.RichEmbed()
    //    .setTitle("Bill - A discord bot for 7 days to die")
    .setColor(randomColour)
    .setTimestamp()
    .setURL("https://niekcandaele.github.io/Bill/")
    .setFooter("-", "http://i.imgur.com/5bm3jzh.png")
    .setThumbnail("http://i.imgur.com/5bm3jzh.png")
  return embed
}

// Check if textFiles exist for a guild -- If not, sets the default settings
client.guildTextFilesExists = function(textFiles, guild) {
  if (typeof textFiles == 'undefined') {
    client.logger.error("Error textFiles = undefined for guild: " + guild.name + "--- Setting default settings");
    client.txtFiles.set(guild.id, client.defaultTxt);
    return false
  }
  return true
}

// Gets the properties of an object and returns an array with property names
client.getProperties = function(obj) {
  var result = [];
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      result.push(i);
    }
  }
  return result;
}

String.prototype.toHHMMSS = function() {
  var sec_num = parseInt(this, 10);
  var days = Math.floor(sec_num / (3600 * 24));
  var hours = Math.floor((sec_num - (days * (3600 * 24))) / 3600);
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  var seconds = sec_num - (hours * 3600) - (minutes * 60);

  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  var time = days + ":" + hours + ':' + minutes + ':' + seconds;
  return time;
}

async function initData() {
  client.logger.info("Initializing data");
  //client.botStats.set('cmdsRan', 0);
  client.logger.info("Loading botStats info");
  client.botStats.set('githubLink', "https://github.com/niekcandaele/Bill");
  client.botStats.set('website', "https://niekcandaele.github.io/Bill/");
  client.botStats.set('bootTime', new Date().getTime());
}

// Registers all built-in groups, commands, and argument types
client.registry.registerDefaults();
client.registry.registerGroup("7dtd");
client.registry.registerGroup("config");
// Registers all commands in the ./commands/ directory
client.registry.registerCommandsIn(path.join(__dirname, '/commands'));

// read config file
fs.readFile('../config.json', 'utf8', function(err, data) {
  if (err) {
    return console.log(err);
  }
  data = JSON.parse(data);
  //owner = data.owner;
  var token = data.token;
  loggerLevel = data.loggerLevel; // TODO: add this as option during startup
  client.login(token);
});
