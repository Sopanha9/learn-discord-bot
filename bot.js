// bot.js
require('dotenv').config();
const {
  Client,
  GatewayIntentBits,
  Collection,
} = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
  ],
});

client.commands = new Collection();

// ────── RECURSIVE COMMAND LOADER (works with subfolders like /utility/) ──────
const commandsPath = path.join(__dirname, 'commands');

function loadCommands(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      loadCommands(fullPath); // Dive into subfolders
    } else if (entry.name.endsWith('.js')) {
      try {
        const command = require(fullPath);
        if ('data' in command && 'execute' in command) {
          client.commands.set(command.data.name, command);
          console.log(`Loaded command: ${command.data.name}`);
        } else {
          console.log(`[WARNING] ${fullPath} is missing "data" or "execute"`);
        }
      } catch (error) {
        console.error(`Failed to load ${fullPath}:`, error);
      }
    }
  }
}

loadCommands(commandsPath);

// ────── EVENT LOADER (ready.js, interactionCreate.js, etc.) ──────
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

// Login
client.login(process.env.DISCORD_TOKEN);