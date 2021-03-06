const prisma = require('./../../utils/prisma');

module.exports = {
  async handle (interaction, client) {
    const postData = await prisma.post.findMany({
      include: {
        comments: true
      },
      orderBy: {
        id: 'desc'
      }
    });

    const focusedValue = interaction.options.getFocused();

    const choices = [];
    for (const x of postData) {
      const userInfo = await client.users.fetch(x.userID);
      choices.push(`${x.title ? ` ${x.title.substr(0, 20)}` : `${x.type.toLowerCase()}`} | ${userInfo.username} (Post #${x.id})`);
    }

    console.log(choices[0]);

    const filtered = choices.filter(choice => choice.toLowerCase().includes(focusedValue.toLowerCase())).slice(0, 5);

    await interaction.respond(
      filtered.map(choice => ({ name: choice, value: choice }))
    );
  }
};
