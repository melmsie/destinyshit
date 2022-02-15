module.exports = {
  async run (interaction, client, prisma) {
    const targetUser = interaction.options.resolved.users?.values()?.next()?.value || interaction.user;
    const userData = await prisma.user.findUnique({
      where: { id: targetUser.id },
      include: {
        posts: true,
        votes: true
      }
    });
    
    if (!userData) {
      return interaction.reply({ content: 'This user has no data yet!', ephemeral: true });
    }

    await interaction.reply({
      embeds: [
        {
          title: `${targetUser.username}'s data`,
          fields: [
            {
              name: 'Votes',
              value: userData.votes.length.toLocaleString()
            },
            {
              name: 'Posts',
              value: userData.posts.length.toLocaleString()
            }
          ]
        }
      ]
    });
  }
};
