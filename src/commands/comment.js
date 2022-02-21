const prisma = require('./../utils/prisma');
const { Embed } = require('@discordjs/builders');
module.exports = {
  async run (interaction, client) {
    const postSelection = interaction.options.data[0].value;
    const comment = interaction.options.data[1].value;
    let didExistAlready = false;
    const postData = await prisma.post.findUnique({
      where: { id: Number(postSelection.split('#')[1].slice(0, -1)) },
      include: {
        comments: true
      }
    });

    if (!postData) {
      return interaction.reply({ content: 'Does this post even exist?', ephemeral: true });
    }

    if (postData.userID === interaction.user.id) {
      return interaction.reply({ content: 'You\'re so lonely that you wanna comment on your own post LMAO! But no.', ephemeral: true });
    }

    if (postData.comments.filter(x => x.userID === interaction.user.id).length > 0) {
      didExistAlready = true;
    } // TODO: change this ^ to a prisma query, less hacky

    const userData = await prisma.user.findUnique({
      where: { id: postData.userID }
    });

    if (userData.settings.commentAlerts) {
      const DM = await client.users.createDM(userData.id, { force: true });
      DM.send({
        embeds: [
          {
            title: `${didExistAlready ? 'Updated' : 'New'} Comment on Post #${postData.id}`,
            thumbnail: { url: postData.image },
            description: `<@${interaction.user.id}> commented:\n\n"${comment}"`
          }
        ]
      });
    }

    await prisma.comment.upsert({
      create: {
        value: comment,
        userID: interaction.user.id,
        postID: postData.id,
        timestamp: new Date(Date.now())
      },
      where: {
        userID_postID: {
          userID: interaction.user.id,
          postID: postData.id
        }
      },
      update: {
        value: comment,
        timestamp: new Date(Date.now())
      }
    });

    const embed = new Embed();

    await interaction.reply({
      embeds: [
        embed
          .setTitle(`Comment ${didExistAlready ? 'Updated' : 'Posted'} on #${postData.id}`)
          .setDescription(`**\`Comment Text:\`**\n> ${comment}`)
      ],
      ephemeral: true
    });
  }
};
