const request = require('request-promise');

class sevendtdRequest {
  constructor(client) {
    client.logger.debug("Constructing a new sevendtdRequest");
    this.client = client;
    // Sets default request options
    async function getRequestOptions(guild, apiModule) {
      try {
        const thisConf = guild.settings;
        const serverip = await thisConf.get("serverip");
        const webPort = await thisConf.get("webPort");
        const authName = await thisConf.get('authName');
        const authToken = await thisConf.get("authToken");

        client.logger.debug(`getRequestOptions - Loading guild data for request IP: ${serverip} Port: ${webPort}`);
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

    this.doRequest = async function(guild, apiModule, extraqs = false) {
      let options = await getRequestOptions(guild, apiModule)
      if (extraqs) {
        options.qs = Object.assign(options.qs, extraqs)
      }
      return request(options)
        .then(function(response) {
          client.logger.debug("7dtdRequest - Succesful request to " + apiModule);
          return response
        })
        .catch(function(error) {
          client.logger.error("7dtdRequest - " + error);
          throw error
        })
    }

  }
}

module.exports = sevendtdRequest
