// Format for sending messages that look consistent
makeBillEmbed = function() {
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
