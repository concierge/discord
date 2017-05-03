const discord = require('discord.js'),
    request = require('request');

class DiscordIntegrationApi extends shim {
    constructor (commandPrefix, bot) {
        super(commandPrefix);
        this._bot = bot;
    }

    _toggleMentions (message, add) {
        const users = this.getUsers(),
            property = add ? 'name' : 'tag';
        
        for (let value in users) {
            const index = message.indexOf(users[value][property]),
                replace = add ? `<@${users[value].id}>` : users[value].name;
            if (index > 0) {
                message = message.substr(0, index) + replace + message.substr(index + users[value][property].length);
            }
        }
        return message;    
    }

    _stopTyping (threadId) {
        this._bot.channels.get(threadId).stopTyping();
    }

    _sendSingleMessage (message, threadId, channel, callback) {
        this._stopTyping(threadId);
        channel.sendMessage(message).then(message => callback).catch(console.error);
    }

    _sendMultipleMessages (messageList, threadId, channel) {
        if (messageList.length === 0) {
            return;
        }
        const message = messageList.splice(0, 1);
        this._sendSingleMessage(message, threadId, channel, this._sendMultipleMessages.bind(this, messageList, threadId, channel));
    }
    
    _destroy () {
        if (this._bot) {
            this._bot.destroy();
            this._bot = null;
        }
    }

    getUsers () {
        const users = {};
        for (let key of this._bot.users.keys()) {
            if (!(key && key.trim().length > 0 && !isNaN(key))) {
                continue;
            }
            const user = this._bot.users.get(key);
            users[user.id] = {
                name: user.username,
                tag: `@${user.username}#${user.discriminator}`,
                id: user.id,
                _base: user
            };
        }
        return users;
    }
    
    sendTyping (threadId) {
        this._bot.channels.get(threadId).startTyping();
    }

    sendMessage (message, threadId) {
        const channel = this._bot.channels.get(threadId);
        message = this._toggleMentions(message, true);
        const messages = shim._chunkMessage(message, 2000);
        this._sendMultipleMessages(messages, threadId, channel);
    }

    sendFile (type, file, description, threadId) {
        const channel = this._bot.channels.get(threadId);
        this._stopTyping(threadId);
        this._bot.sendFile(channel, file, description);
    }

    setTitle (title, threadId) {
        const channel = this._bot.channels.get(threadId);
        this._bot.setChannelName(channel, title);
    }
};

class DiscordIntegration {
    constructor () {
        this._localAvatarBuffer = null;
        this._callback = null;
        this._api = null;
    }

    _getAvatar (complete) {
        request(this.config.avatarUrl, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                this._localAvatarBuffer = new Buffer(body);
            }
            complete();
        });
    }

    _initialiseBot (token) {
        const bot = new discord.Client({
            autoReconnect: true,
            forceFetchUsers: true
        });

        bot.on('ready', () => {
            if (this._avatarUrl !== this.config.avatarUrl) {
                this._getAvatar(() => {
                    console.debug($$`Changing avatar...`);
                    this._avatarUrl = this.config.avatarUrl;
                });
            }

            if (this.config.name && bot.user.username !== this.config.name) {
                console.debug($$`Changing username...`);
                bot.user.setUsername(this.config.name);
            }
            console.debug($$`Discord is ready`);
        });

        bot.on('message', message => {
            if (bot.user.id !== message.author.id) {
                const event = shim.createEvent(message.channel.id, message.author.id, message.author.username, this._api._toggleMentions(message.cleanContent, false));
                if (this._callback) {
                    this._callback(this._api, event);
                }
            }
        });
        
        bot.login(token);
        return bot;
    }

    start (callback) {
        if (!this.config.token) {
            return console.error($$`A token must be provided`);
        }

        if (!this.config.commandPrefix) {
            this.config.commandPrefix = '!';
        }

        this._callback = callback;
        this._api = new DiscordIntegrationApi(this.config.commandPrefix, this._initialiseBot(this.config.token));
    }

    stop () {
        this._api._destroy();
        this._api = null;
        this._callback = null;
    }

    getApi () {
        return this._api;
    }
};

module.exports = new DiscordIntegration();
