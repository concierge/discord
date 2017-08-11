## Discord Integration
#### Installation
The easiest way to install this integration is to use KPM.
```sh
/kpm install discord
```

#### Configuration
You need to obtain your token first from here: https://discordapp.com/developers/applications/me
To add a configuration, execute each of the following commands (replace each of the angle bracketed strings with the respective information and update your discord team configuration to match):
```sh
/kpm config discord commandPrefix "/"
/kpm config discord token "<token>"
```
Note that a commandPrefix of `/` is also used by Discord commands which are going to take priority over Concierge commands.
Here are optional paremeters you can set:
```sh
/kpm config discord avatarUrl "<urlToImage>"
/kpm config discord name "<nameOfBot>"
```
Parameters `avatarUrl` and `name` are __optional__, it is **strongly** recommended to set these in your Discord app's dashboard rather than here.

The bot must be invited to channels which you want it to respond to commands in. Use this URL to add your bot to a server which you can add bots to using this URL (changing `YOUR_CLIENT_ID` to your **client ID** _[not the token!]_): https://discordapp.com/oauth2/authorize?&client_id=YOUR_CLIENT_ID_HERE&scope=bot&permissions=0

#### Running
To run Discord, either run `node main.js discord` when starting Concierge or run `/kpm start discord` when Concierge is running.
