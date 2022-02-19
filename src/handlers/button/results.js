const prisma = require('./../../utils/prisma');
const { Embed } = require('@discordjs/builders');
const functions = new (require('./../../utils/functions'))();
module.exports = {
  async handle (interaction, client) {
    const [type, postID] = interaction.customId.split('-');

    const postData = await prisma.post.findFirst({
      where: {
        id: Number(postID)
      },
      include: {
        votes: true,
        comments: true
      }
    });
    console.log(postData.votes);
    console.log(postData.comments);

    if (postData.votes.filter(x => x.userID === interaction.user.id).length < 1) {
      return interaction.reply(
        {
          embeds: [
            {
              title: 'Enough foolin\' around.',
              description: 'You actually have to vote before you can see the results. Don\'t want your opinion to be swayed now do we?'
            }
          ],
          ephemeral: true
        }
      );
    }

    const LetterGrade = functions.grade(postData.votes);
    const embed = new Embed();
    await interaction.reply(
      {
        embeds: [
          embed
            .setDescription(`${postData.votes.length}`)
        ],
        ephemeral: true
      }
    );
  }
};
