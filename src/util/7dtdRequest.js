const request = require('request-promise');

class sevendtdRequest {
  constructor(client) {
    client.logger.debug("Constructing a new sevendtdRequest");
    this.client = client;
    // Sets default request options
    function getRequestOptions (guild, apiModule) {
      try {
        client.logger.debug("getRequestOptions - Loading guild data for request");
        const thisConf = guild.settings;
        const serverip = thisConf.get("serverip");
        const webPort = thisConf.get("webPort");
        const authName = thisConf.get('authName');
        const authToken = thisConf.get("authToken");
        const baseUrl = "http://" + serverip + ":" + webPort + "/api/";
        let requestOptions = {
          uri: baseUrl + apiModule,
          json: true,
          timeout: 5000,
          headers: {
            'User-Agent': 'Bill discord bot'
          },
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

    this.doRequest = function (guild, apiModule) {
      request(getRequestOptions(guild, apiModule))
      .then(function (response) {
        client.logger.debug("Succesful request to " + apiModule);
      })
      .catch(function(error) {
        client.logger.error(error);
      })
    }

  }
}

module.exports = sevendtdRequest
