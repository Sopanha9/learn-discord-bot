require('dotenv').config();

const { REST } = require('@discordjs/rest');  // ← HTTP client for API calls
const { Routes } = require('discord-api-types/v10');  // ← API paths like applicationCommands
const {SlashCommandBuilder} = require('discord.js');

const token = process.env.DISCORD_TOKEN;
const clientId = "1442033227429711984";

const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),   // ← comma

  new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Replies with your avatar or the avatar of the mentioned user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to get the avatar of')
        .setRequired(false)),                  // ← comma here!

  new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Shows detailed info about a member')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The member to show info for')
        .setRequired(false))
    // ← no comma needed after the last one
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(token);


(async () => {
  try {
    console.log('Started refreshing slash commands...');

    await rest.put(
      Routes.applicationCommands(clientId),
      { body: commands}
    );

    console.log('Successfully registered /ping globally!');
    console.log('It may take up to 1 hour to appear in servers.');
    console.log('(In your test server it usually appears in < 2 minutes)');
  } catch (error) {
    console.error(error);
  }
})();


