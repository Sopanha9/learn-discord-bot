const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Shows a user\'s avatar')
    .addUserOption(option =>
      option.setName('user').setDescription('The user').setRequired(false)),
  async execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;
    await interaction.reply({
      embeds: [{
        color: 0x0099ff,
        title: `${user.username}'s Avatar`,
        image: { url: user.displayAvatarURL({ size: 4096, dynamic: true }) },
        footer: { text: `Requested by ${interaction.user.username}` }
      }]
    });
  },
};