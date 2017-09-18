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
    this.getDefaultSettings = function() {
      return defaultSettings
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
    const Guilds = new Discord.Collection(client.guilds);
    const defaultSettings = this.getDefaultSettings();
    let guildConf = this.getGuildConf();


    client.logger.info("Initializing data");

    client.logger.info("Checking if all guild configs are initialized properly")
    for (var guild of Guilds.values()) {
      client.logger.debug("Checking config for " + guild.name);
      let thisConf = guildConf.get(guild.id);
      if (!guildConf.has(guild.id) || thisConf == "") {
        client.logger.error("Guild config not found for " + guild.name + ". Setting defaults");
        guildConf.set(guild.id, defaultSettings)
      }
      client.logger.debug("Checking if all config properties are defined for " + guild.name);
      for (var property in defaultSettings) {
        if (!thisConf.hasOwnProperty(property)) {
          client.logger.error("Property " + property + " for " + guild.name + " was not defined, setting default");
          thisConf[property] = defaultSettings[property];
          guildConf.set(guild.id, thisConf)
        }
      }
      if (thisConf.prefix != guild.commandPrefix) {
        client.logger.info("Setting prefix for " + guild.name + " " + thisConf.prefix + " " + guild.commandPrefix);
        guild.commandPrefix = thisConf.prefix
      }
    }
  }

}

module.exports = billSettingProvider
