Currently doing testing with the first public version of this bot. Let me know if there are any problems, bugs or feature requests! There is an active support section on [my dev server](https://discordapp.com/invite/kuDJG6e) if you have trouble setting up the bot on your server.

# Features

[![Greenkeeper badge](https://badges.greenkeeper.io/niekcandaele/Bill.svg)](https://greenkeeper.io/)

![feature_img](http://i.imgur.com/cq4ecd5.png "Feature image")

- **Day7**
  - Shows game information about the server.
- **Toptime**
  - Shows top players by playtime on server.
- **Seen**
  - When was a player last online?
- **Txt**
  - Allows you to set custom messages. Useful for rules, serverip, votelinks, ...
- **Serverinfo**
  - Shows detailed information about the server.
- **Exec Console**
  - Allows admins to execute console commands from discord.
- **Restart**
  - Admins can schedule a server restart.

# Installation instructions

1. [Add the bot to your server](https://discordapp.com/oauth2/authorize?client_id=340416036610244609&scope=bot&permissions=117760)
2. That's it! The bot should be running on your server and listening to commands.

## Configuring the bot

Make sure you have [Allocs Server Fixes](https://7dtd.illy.bz/wiki) installed on your server.

### Setting your IP and port

First of all you need to set the IP and port of your server. The IP is the same as the IP used by your players to join the game.

After that we're going to set the port for your server. This is **not** the same port used to join the game.

*Quick note: If you have a dynamic map for your server, the port we're looking for is probably the same as the port for the map.*

Make sure the [integrated webserver](https://7dtd.illy.bz/wiki/Integrated%20Webserver) is activated. Go into your server files and look at output_log.txt. Search for a line like "1.234 Started Webserver on 8082". There's your port.

![Example_setip](http://i.imgur.com/xWW3h0H.png "Example for set config")

### Setting up permissions for the web API

The bot will use information from the web API provided by your server. For this, we need permission! Locate your webpermission.xml file and open it. Set up a admintoken, and set the permissions of the modules accordingly. Refer to the example xml below to know how to do this. It's possible other applications (like server managers) also need permission so make sure those applications still have the necessary access.

Note: Permission 2000 means public, 1000 means steam-authorized users

You can confirm this works by going to the relevant page
`yourip:webport/api/getstats?adminuser=tokenName&admintoken=supersecrettoken`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<webpermissions>

    <admintokens>
        <token name="tokenname" token="supersecrettoken" permission_level="1" />
    </admintokens>

    <permissions>
      <permission module="webapi.executeconsolecommand" permission_level="1" />
      <permission module="webapi.getlog" permission_level="1" />
      <permission module="webapi.getstats" permission_level="1" />
      <permission module="webapi.getplayersonline" permission_level="1" />
      <permission module="webapi.getplayerslocation" permission_level="1" />
      <permission module="webapi.getserverinfo" permission_level="2000" />
      <permission module="webapi.getallowedcommands" permission_level="2000" />
    </permissions>

</webpermissions>
```

After you've set the permissions, you can add the name and token to the config. Enter these commands in Discord
`$set authname tokenname` `$set authtoken supersecrettoken`

### Setting up custom messages with $txt

Arguments for the txt command:
- Set adds a new message. The usage is: $txt set textname text
  - textname is what you will type to send a message
  - text is the message that will be displayed
  - You can also use [Discord markdown](https://support.discordapp.com/hc/en-us/articles/210298617-Markdown-Text-101-Chat-Formatting-Bold-Italic-Underline-)!
  - List lists all currently configured txt files
- Reset resets back to the default message
- Delete deletes a message. The usage is: $txt delete textname

Users can then call your message with $textname

Note: textname is case sensitive!

![example_txt](http://imgur.com/ntOXWoM.png "Example for txt config")

# Run your own version

Mighty brave of you! Currently I am developing with just me hosting in mind. There's no support for this but you can copy the code to your machine and try to run it.

# Contact and support

[Catalysm discord dev server](https://discordapp.com/invite/kuDJG6e)
