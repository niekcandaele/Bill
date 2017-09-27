module.exports = function(app) {


  app.get('/api/getplayerinventory', function(req, res) {
    app.logger.debug(`API request to getplayerinventory for guild ${req.query.guild}`)
    const guildID = req.query.guild
    const playerID = req.query.player
    if (!guildID) {
      return res.send("Error - No guild specified")
    }
    const guild = app.discordClient.guilds.get(guildID)
    if (!guild) {
      return res.send("Error - Not a valid/known guild ID")
    }
    if (!playerID) {
      return res.send("Error - no player specified")
    }

    guild.sevendtdServer.getPlayerInventory(playerID).then(function(data) {
      data.guildName = guild.name
      data.guildID = guild.id
      return res.send(data)
    })
  })
}
