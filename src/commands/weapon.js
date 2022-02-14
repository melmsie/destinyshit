module.exports = {
  async run (interaction) {
    const info = interaction.options.get('image');
    // console.log(interaction)
    // TODO: change below from a reply to a separate message sent in another channel. Requires client and shit
    await interaction.reply({
      embeds: [
        {
          image: { url: interaction.__destiny_resolved.attachments[info.value].url } // TODO: Fix this once d.js merges the fix
        }
      ],
      components: [{
        type: 1,
        components: [
          {
            type: 2,
            label: 'Keep it',
            style: 3,
            custom_id: 'keep'
          },
          {
            type: 2,
            label: 'Shard it',
            style: 2,
            custom_id: 'shard'
          }
        ]

      }]
    });
  }
};
