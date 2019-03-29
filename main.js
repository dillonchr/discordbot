const {Client} = require('discord.io');
const handlers = [];
const channelHandlers = [];
const bot = new Client({token: process.env.DISCORD_TOKEN, autorun: true});

bot.on('ready', () => {
    if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'prod') {
        console.log('Location confirmed. Sending supplies.');
    }
});

bot.on('message', (user, userId, channelId, msg, e) => {
    if (userId !== bot.id) {
        try {
            const matchedChannelHandlers = channelHandlers.filter(([id]) => channelId === id);
            if (matchedChannelHandlers.length) {
                matchedChannelHandlers.forEach(([id, callback]) => {
                    callback(reply => {
                        bot.sendMessage({to: channelId, message: reply});
                    }, e.d);
                });
            } else {
                const lowerCasedMsg = msg.toLowerCase();
                const [ignore, fn] = handlers.find(([triggers]) => {
                    return triggers.some(t => {
                        return lowerCasedMsg.includes(t);
                    });
                });
                fn(reply => {
                    return bot.sendMessage({to: channelId, message: reply});
                }, e.d);
            }
        } catch (ignore) {
        }
    }
});

module.exports = {
    hears: (triggers, callback) => {
        handlers.push([triggers.map(s => s.toLowerCase()), callback]);
    },
    hearsAnythingInChannel: (channelId, callback) => {
        channelHandlers.push([channelId, callback]);
    },
    sendMessage: (to, message) => {
        if (bot) {
            bot.sendMessage({to, message});
        }
    },
    get id() {
        return bot.id;
    }
};
