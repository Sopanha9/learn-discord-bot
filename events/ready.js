module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`Bot is alive as → ${client.user.tag}`);
  },
};