const commands = require('../commands');
exports.handle = async function (interaction, client) {
  // console.log(this)
  if (interaction.isCommand()) { // Slash commands
    const { commandName } = interaction;
    if (!commands.includes(commandName)) {
      return interaction.reply('This is not a command');
    }

    try {
      await runCommand(commandName, interaction, this);
    } catch (error) {
      interaction.reply(`There was an error: ${error}`);
    }
  } else if (interaction.isButton()) {
    await interaction.reply(
      {
        embeds: [
          { description: `You clicked **${interaction.customId}**` }
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
