const { Embed } = require('@discordjs/builders');
module.exports = {
  async run (interaction) {
    const embed = new Embed();
    await interaction.reply({
      embeds: [
        embed.setDescription('aaaa').setFooter({ text: 'huehue' })
      ],
      ephemeral: true
    });
  }
};
