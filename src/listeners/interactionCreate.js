const prisma = require('./../utils/prisma');
const commands = require('../commands');
exports.handle = async function (interaction, client) {
  if (!interaction.user) return; // Why wouldn't an interaction have a user object?
  await prisma.user.upsert({
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
  } else if (interaction.isAutocomplete()) { // Other types of interactions like forms and shit
    if (interaction.commandName !== 'post') return;
    const userData = await prisma.user.findUnique({
      where: { id: interaction.user.id },
      include: {
        posts: true
      }
    });

    const focusedValue = interaction.options.getFocused();

    const choices = userData.posts.map(x => `${x.type.toLowerCase()} post #${x.id}`);

    const filtered = choices.filter(choice => choice.includes(focusedValue)).slice(0, 10);

    await interaction.respond(
      filtered.map(choice => ({ name: choice, value: choice }))
    );
  } else { // Other types of interactions like forms and shit

  }
};

async function runCommand (command, interaction, client) {
  require(`./../commands/${command}.js`).run(interaction, client);
}
