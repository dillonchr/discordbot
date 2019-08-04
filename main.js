const {Client} = require('discord.js');
const handlers = [];
const channelHandlers = [];
const bot = new Client();

bot.on('ready', () => {
    if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'prod') {
        console.log('Location confirmed. Sending supplies.');
    }
});

bot.on('message', (message) => {
    const {author, content, channel} = message;
    //  now that we have multiple bots
    //  let's just prevent one bot from talking to itself
    if (author.username !== bot.user.username) {
        try {
            const matchedChannelHandlers = channelHandlers.filter(([id]) => channel.id === id);
            if (matchedChannelHandlers.length) {
                matchedChannelHandlers.forEach(([id, callback]) => {
                    callback({
                        author,
                        channel,
                        content,
                        reply: reply => {
                            channel.send(reply);
                        }
                    });
                });
            } else {
                const lowerCasedMsg = content.toLowerCase();
                const [ignore, fn] = handlers.find(([triggers]) => {
                    return triggers.some(t => {
                        return lowerCasedMsg.includes(t);
                    });
                });
                fn({
                    author,
                    channel,
                    content,
                    reply: reply => {
                        return message.reply(reply);
                    }
                });
            }
        } catch (ignore) {
        }
    }
});

bot.login(process.env.DISCORD_TOKEN);

module.exports = {
    hears: (triggers, callback) => {
        handlers.push([triggers.map(s => s.toLowerCase()), callback]);
    },
    hearsAnythingInChannel: (channelId, callback) => {
        channelHandlers.push([channelId, callback]);
    },
    sendMessage: (userId, message) => {
        if (bot) {
            bot.fetchUser(userId)
                .then((user) => {
                    user.send(message);
                });
        }
    }
};
