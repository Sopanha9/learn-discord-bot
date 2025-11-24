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

client.once('ready',() => {
    console.log(`Bot is alive as -> ${client.user.tag}`)
})


client.on('messageCreate', (message) => {
    if(message.author.bot) return;

    if(message.content === "!phou"){
        if(message.author.id = "1017067150571225168"){
            message.reply(`kdmh! ${client.ws.ping}ms`)
        }
    }
   
})

client.login(token);
