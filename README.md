# Features

- **Game info displayed on discord**
  - Online players, game time, ...
- **Execute console commands from discord**
- **Chat Bridge**
  - Talk ingame via discord

Run help to see a list of all possible commands

# Installation instructions

Make sure you have [Allocs Server Fixes](https://7dtd.illy.bz/wiki) installed on your server.

Note: replace all values encased in `* *` in the examples with the values for your server.

## 1\. [Add the bot to your server](https://discordapp.com/oauth2/authorize?client_id=340416036610244609&scope=bot&permissions=27648)

## 2\. Init command

The entire setup is done via a single command. `$init *serverip* *port* *name* *token*`

So we need 4 values:

- [IP adress](#21-ip)
- [Webserver port](#22-port)
- [Authorization name and token](#23-name-and-token)

### 2.1 IP

The IP is the same as the IP used by your players to join the game. Easy enough.

### 2.2 Port

This is **not** the same port used to join the game. _Quick note: If you have a dynamic map for your server, the port we're looking for is the same as the port for the map._

Make sure the [integrated webserver](https://7dtd.illy.bz/wiki/Integrated%20Webserver) is activated. Go into your server files and look at output_log.txt. Search for a line like `"1.234 Started Webserver on *8082*"`. In this example 8082 is the port.

### 2.3 Name and token

Login to your telnet/control panel and execute the command `webtokens add *authName* *authToken* 0`

**Note: Change the values for name and token and keep these confidential!**

_Note: This will give Bill permission to execute console commands. If you want to be more restrictive and disable certain functions refer to [webserver documentation](https://7dtd.illy.bz/wiki/Integrated%20Webserver#Permissions)_


## 3\. Initializing your server

Time to run the command `$init *serverip* *port* *name* *token*`

The bot will test if it can connect to the server and report errors.

# Chat bridge

![chatbridge_discord](https://i.imgur.com/ddgHeAy.png)
![chatbridge_ingame](https://i.imgur.com/5dYtcnW.png)

To set up a chat bridge, create a new discord text channel and run `$igc init` in that channel. You can see your configuration with `igc config`. Example: `$igc serverMessages`

# Contact & support

Need help with the set up? Happy to help on [Bill discord developer server](https://discordapp.com/invite/kuDJG6e)
