const request = require('request');
const Discord = require('discord.js');
const Commando = require('discord.js-commando');

class Shop extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'shop',
      group: '7dtd',
      memberName: 'shop',
      description: 'Gives information about the zcoin shop \n not multi guild supported yet!',
      details: "Specify a category",
      examples: ['shop misc']
    });
  }

  async run(msg, args) {
    const client = msg.client;
    const data = require('../../../data/shop_elnoobs.json');
    if (args == "") {
      client.logger.info("SHOP COMMAND: " + msg.author.username + " has used shop command without args, WHATANOOB!");
      return msg.channel.send("Specify a category please! Misc, Rivet, Sandbag, Medical, Food, Energy, Defence, Deco, Chain \n Example: !shop misc")
    }

    function shopLine(article) {
      var item = article.item;
      var quantity = article.quantity;
      var price = article.price;
      var category = article.category;
      var id = article['id number'].slice(18);
      //var id = article.'id number';
      shopString = quantity + " " + item + " ----- Price: " + article.price + " ----- ID:" + id + " \n";
      return shopString
    }

    function buildMsg(data) {
      var msg = new Discord.RichEmbed();
      msg.setTitle("In-game Type: /buy <ID>")
        .setColor(0x00AE86)
        .setTimestamp()
      for (var i = 0; i < data.length; i++) {
        if (data[i].category.toLocaleUpperCase() == args.toLocaleUpperCase()) {
          var id = data[i]['id number'].slice(18);
          msg.addField(id + " " + data[i].item, data[i].price);
        }
      }
      return msg
    }

    var embed = buildMsg(data)
    msg.channel.send({
      embed
    });

    //console.log(dmChannel);
  }
}

module.exports = Shop;
