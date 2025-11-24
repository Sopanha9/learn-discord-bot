const loadedEnv = require('dotenv').config();
const token = loadedEnv.parsed.DISCORD_TOKEN;
const {Client, GatewayIntentBits} = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
})

// When the client is ready, run this code (only once)
client.once('ready',() => {
    console.log(`Bot is alive as -> ${client.user.tag}`)
})

client.on('messageCreate', async (message) => { 
    if(message.author.bot) return;

    // define prefix
    const prefix = '!';

    if(!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if(command === "ping"){
        await message.reply("Pong! ahnig")
    }

    if(command === "echo"){
        const txt = args.join(" ");
        if(!txt) return message.reply("You forgot to say what to echo!");
        await message.reply(txt);

    }
})

client.login(token);