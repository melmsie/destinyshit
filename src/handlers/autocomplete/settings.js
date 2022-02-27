const settings = {
  'Comment Alerts': 'commentAlerts' // Alerts when you get a comment
};
module.exports = {
  async handle (interaction, client) {
    const focusedValue = interaction.options.getFocused();

    const choices = Object.keys(settings);

    const filtered = choices.filter(choice => choice.toLowerCase().includes(focusedValue.toLowerCase())).slice(0, 10);

    await interaction.respond(
      filtered.map(choice => ({ name: choice, value: settings[choice] }))
    );
  }
};
