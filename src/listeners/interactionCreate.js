const commands = require('../commands');
exports.handle = async function (interaction) {
  if (interaction.isCommand()) { // Slash commands
    const { commandName } = interaction;
    if (!commands.includes(commandName)) {
      return interaction.reply('This is not a command');
    }

    try {
      await runCommand(commandName, interaction);
    } catch (error) {
      interaction.reply(`There was an error: ${error}`);
    }
  } else if (interaction.isButton()) {
    await interaction.reply(
      {
        embeds: [
          { description: `You clicked on **${interaction.customId}** on a **${interaction.message.interaction.commandName}** post by **${interaction.message.interaction.user.username}**` }
        ],
        ephemeral: true
      }
    );
  } else { // Other types of interactions like forms and shit

  }
};

async function runCommand (command, interaction) {
  require(`./../commands/${command}.js`).run(interaction);
}
