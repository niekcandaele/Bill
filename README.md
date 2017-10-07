# Features

- **day7**

  - Shows game information about the server.

- **seen**

  - When was a player last online?

 ![example_d7_seen](https://imgur.com/sFpWZcA.png)

- **toptime**

  - Shows top players by playtime on server.

- **serverinfo**

  - Shows detailed information about the server.

 ![example_toptime_serverinfo](https://imgur.com/I1Q9l47.png)

- **exec Console**

  - Allows admins to execute console commands from discord.
 ![example_ex](https://imgur.com/A5HCHgT.png)

- **restart**

  - Admins can schedule a server restart.

- **prefix**

  - Change the bot prefix

- **help**

  - help _command_ for detailed info

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

Go to your webpermissions.xml file and add in this part:

```xml
    <admintokens>
        <token name="*bill*" token="*supersecrettoken*" permission_level="0" />
    </admintokens>
```

_Note: This will give Bill permission to execute console commands. If you want to be more restrictive and disable certain functions refer to [webserver documentation](https://7dtd.illy.bz/wiki/Integrated%20Webserver#Permissions)_

So that your webpermissions.xml file looks like this. It's possible other services already have added permissions, make sure not to overwrite them.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<webpermissions>
    <admintokens>
        <token name="*bill*" token="*supersecrettoken*" permission_level="0" />
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

**Note: Change the values for name and token and keep these confidential!**

## 3\. Initializing your server

Time to run the command `$init *serverip* *port* *name* *token*`

The bot will test if it can connect to the server and report errors.

# Contact & support

Need help with the set up? Happy to help on [Bill discord developer server](https://discordapp.com/invite/kuDJG6e)
