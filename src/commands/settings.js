const prisma = require('../utils/prisma');
const { Embed } = require('@discordjs/builders');
const settings = {
  commentAlerts: {
    name: 'Comment Alerts',
    true: '✅ You will now get DMs from the bot when someone comments on your posts',
    false: '❌ You will no longer get DMs from the bot when someone comments on your posts'

  }
};
module.exports = {
  async run (interaction, client) {
    const args = interaction.options.data[0].value.split(' ');
    const setting = args[args.length - 1];

    if (!settings[setting]) {
      return interaction.reply({ content: 'uhhh, what? this setting does not exist', ephemeral: true });
    }

    const userData = await prisma.user.findUnique({
      where: { id: interaction.user.id }
    });

    if (!userData) {
      return interaction.reply({ content: 'uhhh, what? you do not exist', ephemeral: true });
    }

    await prisma.user.update({
      where: { id: interaction.user.id },
      data: {
        settings: {
          [setting]: !userData.settings[setting]
        }
      }
    });

    const embed = new Embed();

    await interaction.reply({
      embeds: [
        embed
          .setTitle(`${settings[setting].name} Setting Toggled`)
          .setDescription(settings[setting][!userData.settings[setting]])
      ]
    });
  }
};
