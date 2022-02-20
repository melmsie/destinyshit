const prisma = require('./../../utils/prisma');
module.exports = {
  async handle (interaction, client) {
    const userData = await prisma.user.findUnique({
      where: { id: interaction.user.id },
      include: {
        posts: {
          orderBy: {
            id: 'desc'
          }
        }
      }
    });

    const focusedValue = interaction.options.getFocused();

    const choices = userData.posts.map(x => `${x.title ? ` ${x.title.substr(0, 20)}` : `${x.type.toLowerCase()} post`} - #${x.id}`);

    const filtered = choices.filter(choice => choice.includes(focusedValue)).slice(0, 10);

    await interaction.respond(
      filtered.map(choice => ({ name: choice, value: choice }))
    );
  }
};