const prisma = require('./../utils/prisma');
const { Embed } = require('@discordjs/builders');
module.exports = {
  async run (interaction, client) {
    const postData = await prisma.post.findUnique({
      where: { id: Number(interaction.options.data[0].value.split('#')[1]) },
      include: {
        votes: true
      }
    });

    if (!postData) {
      return interaction.reply({ content: 'This post has no data yet?', ephemeral: true });
    }

    const embed = new Embed();

    await interaction.reply({
      embeds: [
        embed
          .setTitle(`Results from post #${postData.id}`)
          .setThumbnail(postData.image)
          .addField({
            name: postData.type === 'WEAPON' ? 'Keep it' : 'Drip',
            value: `${postData.votes.filter(x => x.approve).length} votes`,
            inline: true
          })
          .addField({
            name: postData.type === 'WEAPON' ? 'Shard it' : 'Drop',
            value: `${postData.votes.filter(x => !x.approve).length} votes`,
            inline: true
          })
      ]
    });
  }
};
