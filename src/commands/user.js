const prisma = require('./../utils/prisma');
const functions = new (require('./../utils/functions'))();
const { Embed } = require('@discordjs/builders');
module.exports = {
  async run (interaction, client) {
    const targetUser = interaction.options.resolved.users?.values()?.next()?.value || interaction.user;
    const userData = await prisma.user.findUnique({
      where: { id: targetUser.id },
      include: {
        posts: {
          include: {
            votes: true,
            comments: true
          }
        },
        votes: true,
        comments: true
      }
    });

    if (!userData) {
      return interaction.reply({ content: 'This user has no data yet!', ephemeral: true });
    }

    // * Calculate all votes and comments for this user, and the average grades
    const dataReceived = {
      fashion: [],
      weapon: [],
      allVotes: [],
      comments: []
    };
    userData.posts.forEach(post => {
      if (post.votes.length > 0) {
        dataReceived[post.type.toLowerCase()].push(...post.votes);
        dataReceived.allVotes.push(...post.votes);
      }
      if (post.comments.length > 0) {
        dataReceived.comments.push(...post.comments);
      }
    });
    const fashionGrade = functions.grade(dataReceived.fashion);
    const weaponGrade = functions.grade(dataReceived.weapon);
    const totalGrade = functions.grade(dataReceived.allVotes);
    const sentiment = functions.sentiment(userData.votes);

    const embed = new Embed();

    await interaction.reply({
      embeds: [
        embed
          .setTitle(`${targetUser.username}'s User Information`)
          .setDescription(`This user's general vote sentiment towards others is **${sentiment}**.`)
          .setThumbnail(targetUser.avatarURL())
          .addField({
            name: 'Fashion Posts',
            value: `**\`Posted:\`** ${userData.posts.filter(x => x.type === 'FASHION').length.toLocaleString()}\n**\`Grade:\`** ${fashionGrade}`,
            inline: true
          })
          .addField({
            name: 'Weapon Posts',
            value: `**\`Posted:\`** ${userData.posts.filter(x => x.type === 'WEAPON').length.toLocaleString()}\n**\`Grade:\`** ${weaponGrade}`,
            inline: true
          })
          .addField({
            name: 'Overall Posts',
            value: `**\`Posted:\`** ${userData.posts.length.toLocaleString()}\n**\`Grade:\`** ${totalGrade}`,
            inline: true
          })
          .addField({
            name: 'Votes:',
            value: `**\`Given:\`** ${userData.votes.length.toLocaleString()}\n**\`Received:\`** ${dataReceived.allVotes.length.toLocaleString()}`,
            inline: true
          })
          .addField({
            name: 'Comments:',
            value: `**\`Given:\`** ${userData.comments.length.toLocaleString()}\n**\`Received:\`** ${dataReceived.comments.length.toLocaleString()}`,
            inline: true
          })
          .setFooter({ text: 'Grades are purely based on votes received' })
      ]
    });
  }
};
