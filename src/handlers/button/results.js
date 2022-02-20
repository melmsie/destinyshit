const prisma = require('./../../utils/prisma');
const { Embed } = require('@discordjs/builders');
const functions = new (require('./../../utils/functions'))();
module.exports = {
  async handle (interaction, client) {
    const [type, postID] = interaction.customId.split('-');

    const postData = await prisma.post.findFirst({
      where: {
        id: Number(postID)
      },
      include: {
        votes: true,
        comments: true
      }
    });

    if (!postData) {
      return interaction.reply(
        {
          embeds: [
            {
              title: 'Enough foolin\' around.',
              description: 'This post... doesn\'t exist somehow'
            }
          ],
          ephemeral: true
        }
      );
    }

    if (postData.votes.filter(x => x.userID === interaction.user.id).length < 1 && postData.userID !== interaction.user.id) {
      return interaction.reply(
        {
          embeds: [
            {
              title: 'Enough foolin\' around.',
              description: 'You actually have to vote before you can see the results. Don\'t want your opinion to be swayed now do we?'
            }
          ],
          ephemeral: true
        }
      );
    }

    const letterGrade = functions.grade(postData.votes);
    const embed = new Embed();
    await interaction.reply(
      {
        embeds: [
          embed
            .setTitle(`Post #${postID} Results`)
            .setDescription(`**\`Author:\`** <@${postData.userID}>\n**\`Posted On:\`** <t:${Math.round(new Date(postData.timestamp).getTime() / 1000)}:D>\n**\`Recent Comment:\`**\n> "${postData.comments.length > 0 ? `${postData.comments[postData.comments.length - 1].value}"` : 'No comments yet'}`)
            .setThumbnail(postData.image)
            .addField({ name: postData.type === 'WEAPON' ? 'Keep Votes' : 'Drip Votes', value: `${postData.votes.filter(x => x.approve).length}`, inline: true })
            .addField({ name: postData.type === 'WEAPON' ? 'Shard Votes' : 'Drop Votes', value: `${postData.votes.filter(x => !x.approve).length}`, inline: true })
            .addField({ name: 'Comments', value: `${postData.comments.length}`, inline: true })
            .addField({ name: 'Grade', value: `**${letterGrade}** (${Math.round(((postData.votes.filter(x => x.approve).length / postData.votes.length) || 0) * 100)}%)` })
        ],
        ephemeral: true
      }
    );
  }
};
