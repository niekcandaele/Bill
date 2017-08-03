Currently doing testing with the first public version of this bot. Let me know if there is any problems, bugs or feature requests!

## Features

![feature_img](http://i.imgur.com/cq4ecd5.png "Feature image")

- __**day7**__
 - Shows information about the currently configured guild.
- __**toptime**__
 - Shows top 15 players by playtime on server
- __**seen**__
 - When was a player last online?
- __**txt**__
 - Allows you to set custom messages. Useful for rules, serverip, votelinks, ...


## How to add the bot to your server

1. [Add the bot to your server](https://discordapp.com/oauth2/authorize?client_id=340416036610244609&scope=bot&permissions=35840)
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
textname is what you will type after txt to send a message
text is the message that will be displayed
- Delete deletes a message. The usage is: $txt delete textname

Note: textname is case sensitive!

![example_txt](http://imgur.com/ntOXWoM.png "Example for txt config")


## Run your own version

Mighty brave of you! Currently I am developing with just me hosting in mind. This is a feature for advanced users and should only be attempted if you have some experience with running discord bots.

## Contact and support

[Catalysm discord dev server](https://discordapp.com/invite/kuDJG6e)
