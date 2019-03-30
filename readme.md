# Discordbot

I started out with my bot using botkit. I loved it! But I was using slack and it was convenient since it's what we used at work. Buuuut, I don't want to pay for slack for personal use. So I decided to use Discord! And they have a sweet node module to connect to my server.



But I didn't want to change my bot's code so much so I just made this wrapper on the discord module to make it behave like (not perfectly) botkit.



## Install

`npm install @dillonchr/discordbot`



## Usage

You will have to supply your Discord API Token (or whatever it's called) in an environment variable called: `DISCORD_TOKEN`

Then you will be able to use one of 3 available methods:



### hears

This takes an array of possible substrings to find in a posted message and will then fire a callback when a match is found. This callback will have two arguments, the first is a callback to reply to the thread with the bot. And the second is the message object from discords module ([example structure](http://www.hornwitser.no/discord/analysis#MESSAGE_CREATE))



```js
const bot = require('@dillonchr/discordbot');
bot.hears(['hello', 'goodbye'], ({reply, content}) => {
    if (content.includes('hello')) {
        reply('Well hello there :sun_with_face:');
    } else {
        reply('Okay then. Happy trails!');
    }
});
```



### hearsAnythingInChannel

Very similar to `hears` but doesn't require a direct-message or direct-mention. This will listen to all messages posted in a specific channel. Getting channel IDs isn't fun though. I think the way I've done it in the past is just by going to the channel I care about, messaging in it and running `console.log(channel.id)` and using that output.



```js
const bot = require('@dillonchr/discordbot');
bot.hearsAnythingInChannel('12345678901234567890', ({reply, content}) => {
    if (content.includes('whoami')) {
        reply('You am I');
    } else {
        reply('Fancy seeing you around here.');
    }
});
```



And the final method is actually just a getter. I don't think I'm using it in anything but just in case, the bot's personal user ID is exposed for anyone interested.
