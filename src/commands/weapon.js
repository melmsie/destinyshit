const config = require('./../../config.json');
module.exports = {
  async run (interaction, client) {
    const info = interaction.options.get('image');
    // console.log(client.rest)
    const postLink = await interaction.member.guild.channels.resolve(config.weaponChannel).send({ // TODO: Put this channel in config somewhere
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
            label: 'Keep',
            style: 3,
            custom_id: 'keep'
          },
          {
            type: 2,
            label: 'Shard',
            style: 2,
            custom_id: 'shard'
          }
        ]

      }]
    });
    console.log(postLink);
    await interaction.reply({
      embeds: [
        {
          description: `Your weapon post is now live [here](https://canary.discord.com/channels/${postLink.guildId}/${postLink.channelId}/${postLink.id})!`
        }
      ],
      ephemeral: true
    });
  }
};
