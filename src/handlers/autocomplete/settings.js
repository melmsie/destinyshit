const settings = [
  {
    name: 'commentAlerts',
    desc: 'Get a bot DM when you receive a comment on a posts'
  }
];
module.exports = {
  async handle (interaction, client) {
    const focusedValue = interaction.options.getFocused();

    const choices = settings.map(x => `${x.desc} - ${x.name}`);

    const filtered = choices.filter(choice => choice.includes(focusedValue)).slice(0, 10);

    await interaction.respond(
      filtered.map(choice => ({ name: choice, value: choice }))
    );
  }
};
