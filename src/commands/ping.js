module.exports = {
  async run (interaction) {
    await interaction.reply({
      embeds: [
        {
          description: 'aaaa'
        }
      ],
      ephemeral: true
    });
  }
};
