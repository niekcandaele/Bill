const sevendtdLogs = require('../service/sevendtdLogs')
const request = require('request-promise')

class sevendtdServer {
  constructor(discordGuild) {
    this.guild = discordGuild
    //this.client = discordGuild.client
    const client = discordGuild.client
    const thisConf = this.guild.settings;
    const serverip = thisConf.get("serverip");
    const webPort = thisConf.get("webPort");
    const authName = thisConf.get('authName');
    const authToken = thisConf.get("authToken");

    this.getStats = function () {
      return doRequest("getstats")
    }

    this.getPlayerList = function () {
      return doRequest("getplayerlist")
    }
    this.getPlayersOnline = function () {
      return doRequest("getplayersonline")
    }

    this.getPlayersLocation = function () {
      return doRequest("getplayerslocation")
    }

    this.executeConsoleCommand = function (command) {
      return doRequest("executeconsolecommand", { command })
    }

    this.getAllowedCommands = function () {
      return doRequest("getallowedcommands")
    }

    this.getAnimalsLocation = function () {
      return doRequest("getanimalslocations")
    }

    this.getHostileLocation = function () {
      return doRequest("gethostilelocation")
    }

    this.getLandClaims = function () {
      return doRequest("getlandclaims")
    }

    this.getPlayerInventory = function (steamid) {
      return doRequest("getplayerinventory", { steamid })
    }

    this.getWebUIUpdates = function () {
      return doRequest("getwebuiupdates")
    }

    this.getServerInfo = function () {
      return doRequest("getserverinfo")
    }

    this.getLogs = function (firstLine) {
      return doRequest("getlogs", { firstLine })
    }

    this.sayIngame = function (message) {
      return doRequest("executeconsolecommand")
    }

    this.checkIfOnline = function () {
      client.logger.debug(`Checking is server is online for ${this.guild.name}`)
      return doRequest("getstats").then(result => true
      ).catch(e => false)
    }

    this.logService = new sevendtdLogs(client, this.guild, this)

    async function doRequest(apiModule, extraqs = false) {
      let options = await getRequestOptions(apiModule)
      if (extraqs) {
        options.qs = Object.assign(options.qs, extraqs)
      }
      return request(options)
        .then(function (response) {
          client.logger.debug("7dtdRequest - Succesful request to " + apiModule);
          return response
        })
        .catch(function (error) {
          client.logger.error("7dtdRequest - " + error);
          throw error
        })
    }
    async function getRequestOptions(apiModule) {
      try {
        client.logger.debug(`getRequestOptions - Loading guild data for request IP: ${serverip} Port: ${webPort} Module: ${apiModule}`);
        const baseUrl = "http://" + serverip + ":" + webPort + "/api/";
        let requestOptions = {
          url: baseUrl + apiModule,
          json: true,
          timeout: 5000,
          headers: {
            'User-Agent': 'Bill discord bot'
          },
          useQuerystring: true,
          qs: {
            adminuser: authName,
            admintoken: authToken
          }
        };
        return requestOptions

      } catch (error) {
        client.logger.error("Error! getRequestOptions for " + guild.name + error);
        throw error
      }
    }
  }




}

module.exports = sevendtdServer
