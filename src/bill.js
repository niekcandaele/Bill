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



client.on('ready', () => {
  client.defaultTxt = {
    default: 'Default message. See website for info on how to set up text messages!'
  };
  client.commandPrefix = client.guildConf.get("prefix");
  client.user.setGame(client.commandPrefix + "botinfo");
  initData();
  client.logger.info('Bill\'s  ready!');


  // Reset data on test server
  //client.guildConf.set("336821518250147850", defaultSettings);
  // Set test data for txt files on test server
  //client.txtFiles.delete("336821518250147850"); //, {default: 'test',default2: 'test2'});

});

// Logs when a command is run (monitoring for beta stage)
client.on('commandRun', (command, promise, message) => {
  client.logger.info("COMMAND RAN: " + message.author.username + " ran " + command.name + " like this: " + message.cleanContent + " on " + message.guild.name);
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
    // Check if it is a command
    client.logger.debug("Message sent -- Is " + args + " in Commands? : " + Commands.has(args));
    if (Commands.has(args)) {
      return
    }

    const textFiles = client.txtFiles.get(message.guild.id);
    // Check if message exists in textfiles
    if (textFiles[args]) {
      const txtName = args
      const txtToSend = textFiles[args];
      // Sends the text
      let embed = client.makeBillEmbed();
      embed.setDescription(txtToSend)
        .setTitle(txtName);
      client.logger.info("Short form of txt ran: --- " + message.guild.name + " " + message.content)
      return message.channel.send({
        embed
      });
    } else {

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
  const errorChannel = devGuild.channels.get("342274412877447168");
  errorChannel.send("Error!\nError trace: " + error, {
    code: true
  });
}

process.on('uncaughtException', function(err) {
  //client.logger.error(err);
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
};

client.getRequestOptions = async function(guild, apiModule) {
  try {
    const thisConf = await client.guildConf.get(guild.id);
    const serverip = thisConf.serverip;
    const webPort = thisConf.webPort;
    const authName = thisConf.authName;
    const authToken = thisConf.authToken;
    const baseUrl = "http://" + serverip + ":" + webPort + "/api";
    let requestOptions = {
      uri: baseUrl + apiModule,
      json: true,
      timeout: 5000,
      qs: {
        adminuser: authName,
        admintoken: authToken
      },
      useQuerystring: true
    };
    return requestOptions
  } catch (error) {
    client.logger.error("Error! getRequestOptions for " + guild.name + error);
    return msg.channel.send("Error getting web request options. See the website for info on configuration");
  }
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
  var seconds = parseInt(this, 10);
  var days = Math.floor(seconds / 86400);
  var hours = Math.floor((seconds % 86400) / 3600);
  var minutes = Math.floor(((seconds % 86400) % 3600) / 60);
  var seconds = ((seconds % 86400) % 3600) % 60;
  if (days < 10) {
    days = "0" + days;
  }
  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  var time = {
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds
  };
  return time;
}

function initData() {
  let guildConf = client.guildConf
  let txtFiles = client.txtFiles
  const Guilds = client.guilds

  client.logger.info("Initializing data");

  function checkIfGuildConfigIsPopulated(value) {
    const guild = value
    if (!guildConf.get(guild.id)) {
      client.logger.error("Guild config not found for " + guild.name + ". Setting defaults");
      guildConf.set(guild.id, defaultSettings)
    }
  }

  function checkIfTxtConfigIsPopulated(value) {
    const guild = value
    if (!txtFiles.has(guild.id)) {
      client.logger.error("txtFiles not found for " + guild.name + ". Setting defaults");
      client.txtFiles.set(guild.id, client.defaultTxt);
    }
  }

  client.logger.info("Checking if all guild configs are initialized")
  Guilds.forEach(checkIfGuildConfigIsPopulated)
  client.logger.info("Checking if all txt configs are initialized")
  Guilds.forEach(checkIfTxtConfigIsPopulated)



  //client.botStats.set('cmdsRan', 0);
  client.logger.info("Loading botStats info");
  client.botStats.set('githubLink', "https://github.com/niekcandaele/Bill");
  client.botStats.set('website', "https://niekcandaele.github.io/Bill/");

}

client.logger = logger.createLogger('../logs/development.log');
client.logger.info('Bot has logged in');
client.logger.setLevel(loggerLevel);
client.logger.info("Loading persistent data");
client.guildConf = new persistentCollection({
  name: 'guildConf',
  dataDir: '../data'
});
client.txtFiles = new persistentCollection({
  name: 'txtFiles',
  dataDir: '../data'
});
client.botStats = new persistentCollection({
  name: 'botStats',
  dataDir: '../data'
});

var loggerLevel;
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
