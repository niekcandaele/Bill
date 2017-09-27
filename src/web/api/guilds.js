module.exports = function(app) {


  app.get('/guilds', function(req, res) {
    const discordGuilds = app.discordClient.guilds.values()
    let guilds = new Array()
    for (guild of discordGuilds) {
      guilds.push(guild.name)
    }
    let jsonData = JSON.stringify(guilds)
    res.send(jsonData)
  })
}
