const prisma = require('./../../utils/prisma');
const functions = new (require('./../../utils/functions'))();
module.exports = {
  async handle (interaction, client) {
    const [type, action, postID] = interaction.customId.split('-');

    const postData = await prisma.post.findFirst({
      where: {
        id: Number(postID)
      },
      include: {
        comments: true,
        votes: {
          orderBy: {
            approve: 'desc'
          }
        }
      }
    });

    if (postData.userID !== interaction.user.id) {
      return interaction.reply(
        {
          embeds: [
            {
              title: 'Oooh!',
              description: 'This button is only for the post owner!'
            }
          ],
          ephemeral: true
        }
      );
    }

    if (action === 'comments') {
      if (!postData.comments.length) {
        return interaction.reply(
          {
            embeds: [
              {
                title: 'Oooh!',
                description: 'This post has no comments so far!'
              }
            ],
            ephemeral: true
          }
        );
      }
      const paginatedData = functions.paginate(postData.comments.map(x => `"${x.value}" -<@${x.userID}>\n`));
      const aa = await interaction.user.createDM(true);
      paginatedData.forEach(element => {
        aa.send(
          {
            embeds: [
              {
                title: `Post #${postData.id} Comments`,
                image: {
                  url: postData.image
                },
                description: element
              }
            ]
          }
        );
      });
    }

    if (action === 'voters') {
      if (!postData.votes.length) {
        return interaction.reply(
          {
            embeds: [
              {
                title: 'Oooh!',
                description: 'This post has no votes so far!'
              }
            ],
            ephemeral: true
          }
        );
      }
      const paginatedData = functions.paginate(postData.votes.map(x => `<@${x.userID}> voted **${x.approve === true ? ((postData.type === 'WEAPON') ? 'keep' : 'drip') : ((postData.type === 'WEAPON') ? 'shard' : 'drop')}**`));
      const aa = await interaction.user.createDM(true);
      paginatedData.forEach(element => {
        aa.send(
          {
            embeds: [
              {
                title: `Post #${postData.id} Votes`,
                image: {
                  url: postData.image
                },
                description: element
              }
            ]
          }
        );
      });
    }

    await interaction.deferUpdate();
  }
};
