// Sets default request options
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
      timeout: 10000,
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
