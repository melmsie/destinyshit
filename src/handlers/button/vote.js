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

    // if (postData.userID === interaction.user.id) {
    //   interaction.reply({
    //     embeds: [
    //       { description: 'You cannot vote on your own post STUPID' }
    //     ],
    //     ephemeral: true
    //   });
    //   return;
    // }

    if (voteData) {
      interaction.reply({
        embeds: [
          { description: `You ALREADY voted on Post #${postID}` }
        ],
        ephemeral: true
      });
      return;
    }

    await prisma.vote.create({
      data: {
        approve: outcome === 'positive',
        userID: interaction.user.id,
        postID: Number(postID)
      }
    });

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
