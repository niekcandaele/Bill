const request = require('request');
const Baby = require('babyparse');
const Discord = require('discord.js')

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
      console.log(message.author.username + " has used command !day7");
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

exports.playtime = function(client, message) {
  var players = new Array();
  var date = new Date();

  function getPlayers(callback) {
    request('http://193.70.81.12:28248/api/getplayerslocation', function(error, response, body) {
      var data = JSON.parse(body);
      //console.log(data);
      for (var i = 0; i < data.length; i++) {
        players[i] = new Array(data[i].name, data[i].totalplaytime);
        //console.log(players);
      }
      return callback(players);
    });
  }

  function bubbleSort(arr) {
    var len = arr.length;
    for (var i = len - 1; i >= 0; i--) {
      for (var j = 1; j <= i; j++) {
        if (arr[j - 1][1] < arr[j][1]) {
          var temp = arr[j - 1];
          arr[j - 1] = arr[j];
          arr[j] = temp;
        }
      }
    }
    return arr;
  }

  function secondsToDhms(time) {
    t = Number(time);

    var d = Math.floor(t / 86400);
    t -= (d*86400);
    var h = Math.floor(t / 3600);
    t-= (h*24);
    var m = Math.floor(t / 60);
    t-= (m*60);
    var s = Math.floor(t);

    return "D: " + d + " H: " + h + " M: " + m + " S: " + s;
  }

  function isEven(n) {
   return n % 2 == 0;
}

  function buildMsg(arr) {
    var msg = new Discord.RichEmbed();
    msg.setTitle("Top players by playtime")
      .setColor(0x00AE86)
      .setTimestamp()
    for (var i = 0; i < 10; i++) {
      //console.log("Adding to embed: " + arr[i]);
      msg.addField(i+1 + ". " + arr[i][0], secondsToDhms(arr[i][1]), true);
      if (!isEven(i)) {
        msg.addBlankField();
      }
    }
    //console.log(msg);
    return msg
  }

  function callbackF(arr) {
    var embed = buildMsg(bubbleSort(arr));
    message.channel.send({
      embed
    });
  }

  getPlayers(callbackF);
  console.log(message.author.username + " has used command !top");
}
