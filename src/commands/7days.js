const request = require('request');
const Baby = require('babyparse');

// COMMANDS
// 7 DAYS COMMAND
exports.day7 = function(client, message) {
  var onlinePlayers;
  var date = new Date();
  var days, minutes, hours, players, hostiles, animals;
  var embed

  function getOnlinePlayers(callback) {
    var onlinePlayerList = "";
    request('http://193.70.81.12:28248/api/getplayerslocation', function(error, response, body) {
      var data = JSON.parse(body);
      for (var i = 0; i < data.length; i++) {
        var player = data[i];
        if (player.online == true) {
          onlinePlayerList += player.name + ", ";
        }
      }
      //console.log("Function online players: " + onlinePlayerList);
      return callback(onlinePlayerList);
    });
  }

  request('http://193.70.81.12:28248/api/getstats', function(error, response, body) {
    var body = JSON.parse(body);
    days = body.gametime.days;
    hours = body.gametime.hours;
    minutes = body.gametime.minutes;
    players = body.players;
    animals = body.animals;
    hostiles = body.hostiles;
    onlinePlayers = getOnlinePlayers(function(onlinePlayers) {
      embed = {
        "content": "7 Days",
        "embed": {
          "title": "7 Days",
          "url": "https://discordapp.com",
          "color": 15312430,
          "timestamp": date,
          "footer": {
            "icon_url": "https://cdn.discordapp.com/embed/avatars/0.png",
            "text": "Bill"
          },
          "thumbnail": {
            "url": client.displayAvatarURL
          },
          "author": {
            "name": client.username,
            "url": "https://discordapp.com",
            "icon_url": "https://cdn.discordapp.com/embed/avatars/0.png"
          },
          "fields": [{
              "name": "Gametime",
              "value": days + " days " + hours + " hours " + minutes + " minutes",
              "inline": true
            },
            {
              "name": "Players",
              "value": players,
              "inline": true
            },
            {
              "name": "Online players",
              "value": onlinePlayers
            },
            {
              "name": "Hostiles",
              "value": hostiles,
              "inline": true
            },
            {
              "name": "Animals",
              "value": animals,
              "inline": true
            },
          ]
        }
      }
      message.channel.send(embed);
    })
  });
}

exports.shop = function(client, message) {
  const data = require('../../data/shop_elnoobs.json');
  var args = message.content.slice(6, message.length);
  if (args == "") {
    return message.channel.send("Specify a category please! Misc, Rivet, Sandbag, Medical, Food, Energy, Defence, Deco, Chain")
  }
  //var categories = misc,
  //  rivet, Sandbag, medical, food, energy, defence, deco, chain
  message.author.createDM().then(function(value) {
    if (msgToSend == "") {
      return message.channel.send("ERROR: no results! Wrong arguments?")
    } else {
      return value.send(msgToSend);
    }
  });

  function shopLine(article) {
    var item = article.item;
    var quantity = article.quantity;
    var price = article.price;
    var category = article.category;
    //var id = article.'id number';
    shopString = quantity + " " + item + " ----- Price: " + article.price + " \n";
    return shopString
  }
  var msgToSend = "";
  for (var i = 0; i < data.length; i++) {
    if (data[i].category.toLocaleUpperCase() == args.toLocaleUpperCase()) {
      msgToSend += shopLine(data[i]);
    }
  }
  msgToSend = "```\n" + msgToSend + "\n```";

  //console.log(dmChannel);
}
