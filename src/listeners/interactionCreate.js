const prisma = require('./../utils/prisma')
const commands = require('../commands');
exports.handle = async function (interaction, client) {
  if (!interaction.user) return; // Why wouldn't an interaction have a user object?
  const user = await prisma.user.upsert({
    create: { id: interaction.user.id },
    where: { id: interaction.user.id },
    update: {}
  });

  if (interaction.isCommand()) { // Slash commands
    const { commandName } = interaction;
    if (!commands.includes(commandName)) {
      return interaction.reply('This is not a command');
    }

    try {
      await runCommand(commandName, interaction, this);
    } catch (error) {
      interaction.reply(`There was an error: ${error}`);
      console.error(error.stack);
    }
  } else if (interaction.isButton()) {
    if (!interaction.customId.includes('vote')) return; // Only dealing with votes rn
    const [type, outcome, postID] = interaction.customId.split('-');

    const postData = await prisma.post.findFirst({
      where: {
        id: Number(postID)
      }
    });

    const voteData = await prisma.vote.findFirst({
      where: {
        userID: interaction.user.id,
        postID: Number(postID)
      }
    });

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
          { description: `You voted on Post #${postID}` }
        ],
        ephemeral: true
      }
    );
  } else { // Other types of interactions like forms and shit

  }
};

async function runCommand (command, interaction, client) {
  require(`./../commands/${command}.js`).run(interaction, client);
}
