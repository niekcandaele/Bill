require('../util/7dtdRequest')

class sevendtdServer {
  constructor(discordClient, discordGuild) {
    this.client = discordClient
    this.guild = discordGuild

    sevendtdRequest = new sevendtdRequest(discordClient);
    this.doRequest(apiModule, extraqs = false) => {
      sevendtdRequest.doRequest(this.guild, apiModule, extraqs)
    }

    //this.gameLogService = new gameLogService(discordClient, discordGuild)
  }


}
