const prisma = require('./../../utils/prisma');
module.exports = {
  async handle (interaction, client) {
    const [type, outcome, postID] = interaction.customId.split('-');

    const voteData = await prisma.vote.findFirst({
      where: {
        userID: interaction.user.id,
        postID: Number(postID)
      }
    });

    const postData = await prisma.post.findFirst({
      where: {
        id: Number(postID)
      },
      include: {
        votes: true
      }
    });

    if (postData.userID === interaction.user.id) {
      interaction.reply({
        embeds: [
          { description: 'You cannot vote on your own post STUPID' }
        ],
        ephemeral: true
      });
      return;
    }

    const approve = outcome === 'positive';

    await prisma.vote.upsert({
      create: {
        approve: approve,
        userID: interaction.user.id,
        postID: Number(postID),
        timestamp: new Date(Date.now())
      },
      where: {
        userID_postID: {
          userID: interaction.user.id,
          postID: postData.id
        }
      },
      update: {
        approve: approve,
        timestamp: new Date(Date.now())
      }
    });

    if (voteData) {
      if (approve === voteData.approve) {
        return interaction.reply(
          {
            embeds: [
              { description: 'This was already your vote' }
            ],
            ephemeral: true
          }
        );
      } else {
        return interaction.reply(
          {
            embeds: [
              { description: `You changed your vote on Post #${postID}` }
            ],
            ephemeral: true
          }
        );
      }
    }

    await interaction.reply(
      {
        embeds: [
          { description: `You voted on Post #${postID} by <@${postData.userID}>` }
        ],
        ephemeral: true
      }
    );
  }
};
