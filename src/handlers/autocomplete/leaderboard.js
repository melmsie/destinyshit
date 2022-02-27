const leaderboards = {
  'Overall Score': 'overall',
  'Weapon Score': 'weapons',
  'Fashion Score': 'fashion',
  Negativity: 'negativeUsers', // Users with the lowest overall sentiment
  Positivity: 'positiveUsers' // Users with the highest overall sentiment
};
module.exports = {
  async handle (interaction, client) {
    const focusedValue = interaction.options.getFocused();

    const choices = Object.keys(leaderboards);

    const filtered = choices.filter(choice => choice.toLowerCase().includes(focusedValue.toLowerCase())).slice(0, 10);

    await interaction.respond(
      filtered.map(choice => ({ name: choice, value: leaderboards[choice] }))
    );
  }
};
