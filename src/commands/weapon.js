const config = require('./../../config.json');
const prisma = require('./../utils/prisma');
const functions = new (require('./../utils/functions'))();
const { PostType } = require('@prisma/client');
const { Embed } = require('@discordjs/builders');
module.exports = {
  async run (interaction, client) {
    const isImage = functions.validateImage(interaction.__destiny_resolved.attachments[info.value].filename);
    if (!isImage) {
      await interaction.reply({
        embeds: [
          {
            description: `The file \`${interaction.__destiny_resolved.attachments[info.value].filename}\` is not an image, you're a bit dull aren't you`
          }
        ],
        ephemeral: true
      });
      return;
    }
    const info = interaction.options.get('image');
    const url = interaction.__destiny_resolved.attachments[info.value].url; // TODO: Fix this once d.js merges the fix
    const postData = await prisma.post.create({
      data: {
        userID: interaction.user.id,
        type: PostType.WEAPON,
        image: url
      }
    });

    const embed = new Embed();

    const postLink = await interaction.member.guild.channels.resolve(config.weaponChannel).send({
      embeds: [
        embed
          .setImage(url)
          .setFooter({ text: `Post #${postData.id} by ${interaction.user.username}` })
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
          description: `Your weapon post is now live [here](https://canary.discord.com/channels/${postLink.guildId}/${postLink.channelId}/${postLink.id})!\nUse the \`/post\` command to view results at any time`
        }
      ],
      ephemeral: true
    });
  }
};
