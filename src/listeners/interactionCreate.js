const commands = require('../commands');
exports.handle = async function (interaction) {
  if (interaction.isCommand()) { // Slash commands
    const { commandName } = interaction;

    if (commands.includes(commandName)) {
      try {
        await runCommand(commandName, interaction);
      } catch (error) {
        interaction.reply(`There was an error: ${error}`);
      }
    } else {
      interaction.reply('This is not a command');
    }
  } else { // Other types of interactions like buttons and shit

  }
};

async function runCommand (command, interaction) {
  require(`./../commands/${command}.js`).run(interaction);
}
