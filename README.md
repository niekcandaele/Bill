Currently doing testing with the first public version of this bot. Let me know if there are any problems, bugs or feature requests! There is an active support section on [my dev server](https://discordapp.com/invite/kuDJG6e) if you have trouble setting up the bot on your server.

## Features

![feature_img](http://i.imgur.com/cq4ecd5.png "Feature image")

- **$day7**
  - Shows information about the currently configured guild.
- **$toptime**
  - Shows top 15 players by playtime on server
- **$seen**
  - When was a player last online?
- **$txt**
  - Allows you to set custom messages. Useful for rules, serverip, votelinks, ...


## How to add the bot to your server

1. [Add the bot to your server](https://discordapp.com/oauth2/authorize?client_id=340416036610244609&scope=bot&permissions=158720)
2. That's it! The bot should be running on your server and listening to commands.

## Configuring the bot

### Setting your IP and port

First of all you need to set the ip and port of your server. The ip is the same as the ip used by your players to join the game.

After that we're going to set the port for your server. This is **not** the same port used to join the game. First of all, make sure the [integrated webserver](https://7dtd.illy.bz/wiki/Integrated%20Webserver) is activated. Go into your server files and look at output_log.txt. There should be a line like "1.234 Started Webserver on 8082". There's your port.

![Example_setip](http://i.imgur.com/xWW3h0H.png "Example for set config")

### Setting up permissions for the web API

The bot will use information from the webAPI provided by your server. For this, we need permission!
Locate your webpermissions.xml file and change the permission level of the follow pages to 2000:
- getstats
- getplayerslocation
- viewallplayers

Note: Permission 2000 means public, 1000 means steam-authorized users and anything below is to be customized. Currently the bot does not support webtokens but this is in the works for later. Features that are more security sensitive can then also be added.

You can confirm this works by going to the relevant page, for example : yourip:webport/api/getstats

### Setting up custom messages with $txt

The txt command takes 2 config commands: set and delete.
- Set adds a new message. The usage is: $txt set textname text
  - textname is what you will type after txt to send a message
  - text is the message that will be displayed
  - You can also use [Discord markdown](https://support.discordapp.com/hc/en-us/articles/210298617-Markdown-Text-101-Chat-Formatting-Bold-Italic-Underline-)!
- Delete deletes a message. The usage is: $txt delete textname

Users can then call your message with $textname

Note: textname is case sensitive!

![example_txt](http://imgur.com/ntOXWoM.png "Example for txt config")


## Run your own version

Mighty brave of you! Currently I am developing with just me hosting in mind. There's no support for this but you can copy the code to your machine and try to run it.

## Contact and support

[Catalysm discord dev server](https://discordapp.com/invite/kuDJG6e)
