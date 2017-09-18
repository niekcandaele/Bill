const Discord = require('discord.js');
const Commando = require('discord.js-commando');
const persistentCollection = require('djs-collection-persistent');

class billSettingProvider extends Commando.SettingProvider {
  constructor(client) {
    super(client);
    client.guildConf = new persistentCollection({
      name: 'guildConf',
      dataDir: '../data'
    });
    var guildConf = client.guildConf

    const defaultTxt = {
      default: 'Default message. See website for info on how to set up text messages!'
    };
    const defaultSettings = {
      prefix: "$",
      guildOwner: "id",
      serverip: "defaultIP",
      webPort: "defaultPort",
      authName: "defaultName",
      authToken: "defaultToken",
      txtFiles: defaultTxt
    };
    this.getGuildConf = function() {
      return guildConf;
    }
    this.setGuildConf = function(newGuildConfig) {
      guildConf = newGuildConfig;
    }
    this.getAdjustedGuildConfig = function(guild) {
      const defaultProperties = Object.getOwnPropertyNames(defaultSettings);
      let thisConf = guildConf.get(guild.id);

      for (var i = 0; i < defaultProperties.length; i++) {
        if (!thisConf.hasOwnProperty(defaultProperties[i])) {
          client.logger.error("Property " + defaultProperties[i] + " for " + guild.name + " was not defined");
          thisConf[defaultProperties[i]] = defaultSettings[defaultProperties[i]]
        }
      }
      return thisConf
    }

  }

  get(guild, key) {
    let guildConf = this.getGuildConf();
    return guildConf.get(guild.id, key);
  }

  set(guild, key, val) {
    let guildConf = this.getGuildConf();
    let thisConf = guildConf.get(guild.id);
    thisConf[key] = val;
    guildConf.set(guild.id, thisConf);
  }

  clear(guild) {
    let guildConf = this.getGuildConf();
    guildConf.delete(guild.id)
  }

  async remove(guild, key) {
    let guildConf = this.getGuildConf();
    let thisConf = guildConf.get(guild.id);
    delete thisConf[key]
    guildConf.set(guild.id, thisConf);
  }


  init(client) {
    let txtFiles = client.txtFiles
    const Guilds = new Discord.Collection(client.guilds);
    let defaultSettings = this.defaultSettings;
    let guildConf = this.getGuildConf();

    client.logger.info("Initializing data");
    client.logger.info("Checking if all guild configs are initialized properly")
    //Guilds.forEach(this.checkIfGuildConfigIsPopulated)


    for (var guild of Guilds.values()) {
      client.logger.debug("Checking config for " + guild.name);
      const thisConf = guildConf.get(guild.id);

      if (!guildConf.has(guild.id)) {
        client.logger.error("Guild config not found for " + guild.name + ". Setting defaults");
        guildConf.set(guild.id, client.defaultSettings)
      } else {
        let adjustedConfig = this.getAdjustedGuildConfig(guild);

        if (!Object.is(JSON.stringify(thisConf), JSON.stringify(adjustedConfig))) {
          client.logger.info("Guild config for " + guild.name + " was corrected!");
          guildConf.set(guild.id, adjustedConfig);
        }
        if (thisConf.prefix != guild.commandPrefix) {
          client.logger.info("Setting prefix for " + guild.name + " " + thisConf.prefix + " " + guild.commandPrefix);
          guild.commandPrefix = thisConf.prefix
        }

      }
    }



  }

}

module.exports = billSettingProvider

/*
    this.init = function(client) {
      let guildConf = client.guildConf
      let txtFiles = client.txtFiles
      const Guilds = client.guilds

      client.logger.info("Initializing data");

      function checkIfGuildConfigIsPopulated(value) {
        const guild = value,
          defaultProperties = Object.getOwnPropertyNames(defaultSettings);
        if (!guildConf.has(guild.id)) {
          client.logger.error("Guild config not found for " + guild.name + ". Setting defaults");
          this.set(guild.id, client.defaultSettings)
        }
        for (var i = 0; i < defaultProperties.length; i++) {
          let thisConf = guildConf.get(guild.id);
          if (!thisConf.hasOwnProperty(defaultProperties[i])) {
            client.logger.error("Property " + defaultProperties[i] + " for " + guild.name + " was not defined, setting default value");
            thisConf[defaultProperties[i]] = client.defaultSettings[defaultProperties[i]]
            set(guild.id, thisConf)
          }
        }
      }


      function setGuildPrefixes(value) {
        const guild = value;
        let thisConf = guildConf.get(guild.id);
        guild.commandPrefix = thisConf.prefix;
      }

      client.logger.info("Checking if all guild configs are initialized properly")
      Guilds.forEach(checkIfGuildConfigIsPopulated)
      client.logger.info("Loading and setting individual guild prefixes")
      Guilds.forEach(setGuildPrefixes)



          //client.botStats.set('cmdsRan', 0);
          client.logger.info("Loading botStats info");
          client.botStats.set('githubLink', "https://github.com/niekcandaele/Bill");
          client.botStats.set('website', "https://niekcandaele.github.io/Bill/");


    }*/
