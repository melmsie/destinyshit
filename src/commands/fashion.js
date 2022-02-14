module.exports = {
  async run(interaction) {
    const info = interaction.options.get('image');
    // console.log(interaction)
    // TODO: change below from a reply to a separate message sent in another channel. Requires client and shit
    await interaction.reply({
      embeds: [
        {
          image: { url: interaction.__destiny_resolved.attachments[info.value].url }
        }
      ],
      components: [{
        'type': 1,
        'components': [
            {
                'type': 2,
                'label': 'Drip!',
                'style': 3,
                'custom_id': 'drip'
            },
            {
              'type': 2,
              'label': 'Drop!',
              'style': 2,
              'custom_id': 'drop'
          }
        ]

    }]
    });
  }
}