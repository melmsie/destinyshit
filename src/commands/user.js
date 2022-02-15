module.exports = { // TODO: set up optional user argument
  async run (interaction, client, prisma) {
    const voteData = await prisma.vote.findMany({
      where: {
        userID: interaction.user.id
      }
    });
    const postData = await prisma.post.findMany({
      where: {
        userID: interaction.user.id
      }
    });
    // const userData = await prisma.post.findFirst({
    //   where: {
    //     id: interaction.user.id
    //   }
    // })
    await interaction.reply({
      embeds: [
        {
          title: `${interaction.user.username} data`,
          fields: [
            {
              name: 'Votes',
              value: voteData.length.toLocaleString()
            },
            {
              name: 'Posts',
              value: postData.length.toLocaleString()
            }
          ]
        }
      ]
    });
  }
};
