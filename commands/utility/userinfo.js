const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Shows detailed info about a member')
    .addUserOption(option =>
      option.setName('user').setDescription('The member').setRequired(false)),
  async execute(interaction) {
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
  },
};