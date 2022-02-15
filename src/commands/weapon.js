const config = require('./../../config.json');
const prisma = require('./../utils/prisma')
const { PostType } = require('@prisma/client');
module.exports = {
  async run (interaction, client, prisma) {
    const info = interaction.options.get('image');
    // console.log(client.rest)
    const url = interaction.__destiny_resolved.attachments[info.value].url; // TODO: Fix this once d.js merges the fix
    const postData = await prisma.post.create({
      data: {
        userID: interaction.user.id,
        type: PostType.WEAPON,
        image: url
      }
    });

    const postLink = await interaction.member.guild.channels.resolve(config.weaponChannel).send({
      embeds: [
        {
          title: `Post #${postData.id} by ${interaction.user.username}`,
          footer: { text: `Post #${postData.id} by ${interaction.user.username}` }, // Why doesn't this footer work wtf
          image: { url: url }
        }
      ],
      components: [{
        type: 1,
        components: [
          {
            type: 2,
            label: 'Keep it',
            style: 3,
            custom_id: `vote-positive-${postData.id}`
          },
          {
            type: 2,
            label: 'Shard it',
            style: 2,
            custom_id: `vote-negative-${postData.id}`
          }
        ]

      }]
    });
    await interaction.reply({
      embeds: [
        {
          description: `Your fashion post is now live [here](https://canary.discord.com/channels/${postLink.guildId}/${postLink.channelId}/${postLink.id})!`
        }
      ],
      ephemeral: true
    });
  }
};
