const loadedEnv = require('dotenv').config();
const token = loadedEnv.parsed.DISCORD_TOKEN;
const {Client, GatewayIntentBits} = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ]
})

// When the client is ready, run this code (only once)
client.once('ready',() => {
    console.log(`Bot is alive as => ${client.user.tag}`)
})
// using !
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

    if( command === "avatar") {
        // get target user
        const target = message.mentions.users.first() || message.author;

        await message.reply({
            embeds: [{
                color: 0x0099ff,
                author: {
                    name: target.username,
                    icon_url: target.displayAvatarURL({size:256})
                },
                title: "Avatar",
                image: {url: target.displayAvatarURL({size:4096, dynamic: true})},
                footer: {text: `Requested by ${message.author.username}`}
            }]
        });


    }

    if (command === "userinfo" || command === "ui") {
        // get target of mentioned
        const target = message.mentions.users.first() || message.author
        const member = message.guild.members.cache.get(target.id);

        if(!member) return message.reply("I couldn't find the member");

        // get timestamp format
        const created = `<t:${Math.floor(target.createdTimestamp / 1000)}:F>`
        // const joined = member.joinedTimestamp ? `<t:${Math.floor(member.createdTimestamp / 1000)}:F>` : "Unknown";
        const joined = member.joinedTimestamp 
  ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>` 
  : "Unknown";
        // get color || default color
        // const roleColor = member.displayHexColor === "#000000" ? "#99aab5" : member.displayHexColor;
        // const roleColor = member.displayHexColor === "#000000" ? 0x99aab5 : parseInt(member.displayHexColor.replace("#", ""), 16);
        const roleColor = member.displayHexColor === "#000000" 
  ? 0x99aab5 
  : parseInt(member.displayHexColor.slice(1), 16);

        // skip role? for now

        await message.reply({
            embeds: [{
                color: roleColor,
                author: {
                    name: `${target.tag}`,
                    icon_url: target.displayAvatarURL({dynamic: true})
                },
                thumbnail: { url: target.displayAvatarURL({size: 4096, dynamic : true})},
                fields: [
                    {name : "User ID:", value: target.id, inline:false},
                    {name : "Account Created:", value: created, inline: false},
                    {name : "Server Joined:", value: joined, inline: false},
                    {name : "Highest Role:", value: member.roles.highest.name, inline: false},
                    {name: "Status:", value: member.presence?.status || "Offline", inline: false},
                    {name: "Activity:", value: member.presence?.activities[0]?.name || "None", inline: false }
                ],
                footer: {text: `Requested by ${message.author.tag}`},
                timestamp: new Date()
            }]
        })

    }
    
})

// Slash command handling
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'ping') {
    const latency = Date.now() - interaction.createdTimestamp;
    const apiLatency = Math.round(client.ws.ping);
    await interaction.reply(`Pong! Latency is ${latency}ms. API Latency is ${apiLatency}ms.`);
  }

  if (commandName === 'avatar') {
    const user = interaction.options.getUser('user') || interaction.user;
    await interaction.reply({
      embeds: [{
        color: 0x0099ff,
        title: `${user.username}'s Avatar`,
        image: { url: user.displayAvatarURL({ size: 4096, dynamic: true }) },
        footer: { text: `Requested by ${interaction.user.username}` }
      }]
    });
  }

  if (commandName === 'userinfo') {
    const user = interaction.options.getUser('user') || interaction.user;
    const member = interaction.options.getMember('user') || interaction.member;

    const created = `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`;
    const joined = member.joinedTimestamp
      ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`
      : "Unknown";

    const roleColor = member.displayHexColor === "#000000"
      ? 0x99aab5
      : parseInt(member.displayHexColor.slice(1), 16);

    await interaction.reply({
      embeds: [{
        color: roleColor,
        author: { name: user.tag, icon_url: user.displayAvatarURL({ dynamic: true }) },
        thumbnail: { url: user.displayAvatarURL({ size: 4096, dynamic: true }) },
        fields: [
          { name: "User ID", value: user.id, inline: false },
          { name: "Account Created", value: created, inline: true },
          { name: "Server Joined", value: joined, inline: true },
          { name: "Highest Role", value: member.roles.highest.toString(), inline: true },
        ],
        footer: { text: `Requested by ${interaction.user.tag}` },
        timestamp: new Date()
      }]
    });
  }
});


client.login(token);