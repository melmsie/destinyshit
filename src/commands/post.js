const prisma = require('./../utils/prisma');
const { Embed } = require('@discordjs/builders');
const functions = new (require('./../utils/functions'))();
module.exports = {
  async run (interaction, client) {
    const postData = await prisma.post.findUnique({
      where: { id: Number(interaction.options.data[0].value.split('#')[1]) },
      include: {
        votes: true,
        comments: true
      }
    });

    if (!postData) {
      return interaction.reply({ content: 'This post has no data yet?', ephemeral: true });
    }

    if (postData.userID !== interaction.user.id) {
      return interaction.reply({ content: 'You can only view the posts you created', ephemeral: true });
    }

    const letterGrade = functions.grade(postData.votes);
    const embed = new Embed();

    await interaction.reply({
      embeds: [
        embed
          .setTitle(`Post #${postData.id} Results`)
          .setDescription(`**\`Author:\`** <@${postData.userID}>\n**\`Posted On:\`** <t:${Math.round(new Date(postData.timestamp).getTime() / 1000)}:D>\n**\`Recent Comment:\`**\n> "${postData.comments.length > 0 ? `${postData.comments[postData.comments.length - 1].value}"` : 'No comments yet'}`)
          .setThumbnail(postData.image)
          .addField({ name: postData.type === 'WEAPON' ? 'Keep Votes' : 'Drip Votes', value: `${postData.votes.filter(x => x.approve).length}`, inline: true })
          .addField({ name: postData.type === 'WEAPON' ? 'Shard Votes' : 'Drop Votes', value: `${postData.votes.filter(x => !x.approve).length}`, inline: true })
          .addField({ name: 'Comments', value: `${postData.comments.length}`, inline: true })
          .addField({ name: 'Grade', value: `**${letterGrade}** (${Math.round(((postData.votes.filter(x => x.approve).length / postData.votes.length) || 0) * 100)}%)` })
      ],
      components: [{
        type: 1,
        components: [
          {
            type: 2,
            label: 'Comments',
            style: 2,
            custom_id: `post-comments-${postData.id}`
          },
          {
            type: 2,
            label: 'Voters',
            style: 2,
            custom_id: `post-voters-${postData.id}`
          }
        ]

      }]
    });
  }
};
