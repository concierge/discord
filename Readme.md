## Discord Integration
#### Installation
The easiest way to install this integration is to use KPM.
```sh
/kpm install discord
```

#### Configuration
To add a configuration, execute each of the following commands (replace each of the angle bracketed strings with the respective information and update your discord team configuration to match):
```sh
/kpm config discord commandPrefix "!"
/kpm config discord token "<token>"
/kpm config discord avatarUrl "<urlToImage>"
/kpm config discord name "<nameOfBot>"
```
Note that a commandPrefix of `/` is not possible in discord as it has been reserved. All other parameters are optional. The bot must be invited to channels which you want it to respond to commands in.

#### Running
To run Discord, either run `node main.js discord` when starting Concierge or run `/kpm start discord` when Concierge is running.
