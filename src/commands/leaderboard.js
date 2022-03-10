const prisma = require('../utils/prisma');
const { Embed } = require('@discordjs/builders');
const functions = new (require('./../utils/functions'))();
const positionEmotes = ['🥇', '🥈', '🥉']; // Haha dank memer code
const leaderboards = {
  overall: {
    desc: 'The users with the highest ratings across all types of posts',
    title: 'Highest Post Ratings'
  },
  weapons: {
    desc: 'The users with the most positive ratings for weapons',
    title: 'Highest Weapon Post Ratings (Total)'
  },
  weaponsRelative: {
    desc: 'The users with the highest average ratings for weapons',
    title: 'Highest Weapon Post Ratings (Relative)'
  },
  fashion: {
    desc: 'The users with the most positive ratings for fashion',
    title: 'Highest Fashion Post Ratings (Total)'
  },
  fashionRelative: {
    desc: 'The users with the highest average ratings for fashion',
    title: 'Highest Fashion Post Ratings (Relative)'
  },
  positiveUsers: {
    desc: 'Users who are the most positive while voting on other posts',
    title: 'Most Positive Users'
  },
  negativeUsers: {
    desc: 'Users who are the most negative while voting on other posts',
    title: 'Most Negative Users'
  }
};
module.exports = {
  async run (interaction, client) {
    const leaderboardChosen = interaction.options.data[0].value;

    if (!leaderboards[leaderboardChosen]) {
      return interaction.reply('yeah that is not a leaderboard', {
        ephemeral: true
      });
    }

    const allUsers = await prisma.user.findMany({
      include: {
        comments: true,
        posts: {
          include: {
            votes: true
          }
        },
        votes: true
      }
    });

    // TODO: add thinking at the start and finish at the end
    const allPosts = [];
    const allVotes = [];
    const allComments = [];
    allUsers.forEach(user => {
      if (user.posts.length > 0) {
        allPosts.push(...user.posts);
      }
      if (user.votes.length > 0) {
        allVotes.push(...user.votes);
      }
      if (user.comments.length > 0) {
        allComments.push(...user.comments);
      }
    });
    const users = {};
    const usersPointless = {};
    if (leaderboardChosen === 'positiveUsers') {
      allUsers.filter(x => x.votes.length > 0).forEach(user => {
        users[user.id] = Math.round((user.votes.filter(x => x.approve).length / user.votes.length) * 100);
      });
      const leaderboardSorted = Object.entries(users)
        .map(([id, value]) => ({ id: id, value: value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10)
        .map((user, i) => `${positionEmotes[i] || '▫️'} ${user.value}% - <@${user.id}> (${functions.sentimentByNumber(user.value)})`)
        .join('\n');
      return resolveLeaderboard(interaction, client, leaderboardSorted, leaderboardChosen);
    } else if (leaderboardChosen === 'negativeUsers') {
      allUsers.filter(x => x.votes.length > 0).forEach(user => {
        users[user.id] = Math.round((user.votes.filter(x => x.approve).length / user.votes.length) * 100);
      });
      const leaderboardSorted = Object.entries(users)
        .map(([id, value]) => ({ id: id, value: value }))
        .sort((a, b) => a.value - b.value)
        .slice(0, 10)
        .map((user, i) => `${positionEmotes[i] || '▫️'} ${user.value}% - <@${user.id}> (${functions.sentimentByNumber(user.value)})`)
        .join('\n');
      return resolveLeaderboard(interaction, client, leaderboardSorted, leaderboardChosen);
    } else if (leaderboardChosen === 'weapons') {
      allPosts
      .filter(x => x.type === 'WEAPON')
      .filter(x => x.votes.length > 0)
      .forEach(post => {
        users[post.userID] ? users[post.userID].push(post.votes.filter(x => x.approve).length) : users[post.userID] = [Math.round(post.votes.filter(x => x.approve).length)];
      });
      const leaderboardSorted = Object.entries(users)
        .map(([id, value]) => ({ id: id, value: value.reduce((a, b) => a + b) }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10)
        .map((user, i) => `${positionEmotes[i] || '▫️'} **\`${user.value.toLocaleString()}\`** - <@${user.id}>`)
        .join('\n');
      return resolveLeaderboard(interaction, client, leaderboardSorted, leaderboardChosen);
    } else if (leaderboardChosen === 'weaponsRelative') {
      allPosts.filter(x => x.type === 'WEAPON').filter(x => x.votes.length > 0).forEach(post => {
        users[post.userID] ? users[post.userID].push(Math.round((post.votes.filter(x => x.approve).length / post.votes.length) * 100)) : users[post.userID] = [Math.round((post.votes.filter(x => x.approve).length / post.votes.length) * 100)];
      });
      const leaderboardSorted = Object.entries(users)
        .map(([id, value]) => ({ id: id, value: Math.round(value.reduce((a, b) => a + b) / value.length) }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10)
        .map((user, i) => `${positionEmotes[i] || '▫️'} **\`${functions.gradeByNumber(user.value)}\`** - <@${user.id}> (${user.value}%)`)
        .join('\n');
      return resolveLeaderboard(interaction, client, leaderboardSorted, leaderboardChosen);
    } else if (leaderboardChosen === 'fashion') {
      allPosts
      .filter(x => x.type === 'FASHION')
      .filter(x => x.votes.length > 0)
      .forEach(post => {
        users[post.userID] ? users[post.userID].push(post.votes.filter(x => x.approve).length) : users[post.userID] = [Math.round(post.votes.filter(x => x.approve).length)];
      });
      const leaderboardSorted = Object.entries(users)
        .map(([id, value]) => ({ id: id, value: value.reduce((a, b) => a + b) }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10)
        .map((user, i) => `${positionEmotes[i] || '▫️'} **\`${user.value.toLocaleString()}\`** - <@${user.id}>`)
        .join('\n');
      return resolveLeaderboard(interaction, client, leaderboardSorted, leaderboardChosen);
    } else if (leaderboardChosen === 'fashionRelative') {
      allPosts.filter(x => x.type === 'FASHION').filter(x => x.votes.length > 0).forEach(post => {
        users[post.userID] ? users[post.userID].push(Math.round((post.votes.filter(x => x.approve).length / post.votes.length) * 100)) : users[post.userID] = [Math.round((post.votes.filter(x => x.approve).length / post.votes.length) * 100)];
      });
      const leaderboardSorted = Object.entries(users)
        .map(([id, value]) => ({ id: id, value: Math.round(value.reduce((a, b) => a + b) / value.length) }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10)
        .map((user, i) => `${positionEmotes[i] || '▫️'} **\`${functions.gradeByNumber(user.value)}\`** - <@${user.id}> (${user.value}%)`)
        .join('\n');
      return resolveLeaderboard(interaction, client, leaderboardSorted, leaderboardChosen);
    } else if (leaderboardChosen === 'overall') {
      allPosts.filter(x => x.votes.length > 0).forEach(post => {
        users[post.userID] ? users[post.userID].push(Math.round((post.votes.filter(x => x.approve).length / post.votes.length) * 100)) : users[post.userID] = [Math.round((post.votes.filter(x => x.approve).length / post.votes.length) * 100)];
        usersPointless[post.userID] ? usersPointless[post.userID].push(post.votes.filter(x => x.approve).length) : usersPointless[post.userID] = [post.votes.filter(x => x.approve).length];
      });
      const leaderboardSortedOne = Object.entries(users)
        .map(([id, value]) => ({ id: id, value: Math.round(value.reduce((a, b) => a + b) / value.length) }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5)
        .map((user, i) => `${positionEmotes[i] || '▫️'} **\`${functions.gradeByNumber(user.value)}\`** - <@${user.id}> (${user.value}%)`)
        .join('\n');

        const leaderboardSortedTwo = Object.entries(usersPointless)
        .map(([id, value]) => ({ id: id, value: value.reduce((a, b) => a + b) }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5)
        .map((user, i) => `${positionEmotes[i] || '▫️'} **\`${user.value.toLocaleString()}\`** - <@${user.id}>`)
        .join('\n');

        const formatting = `**Top Users (Relative Scores)**\n${leaderboardSortedOne}\n\n**Top Users (Total Scores)**\n${leaderboardSortedTwo}`
      return resolveLeaderboard(interaction, client, formatting, leaderboardChosen);
    }
  }
};

async function resolveLeaderboard (interaction, client, data, lb) {
  const embed = new Embed();
  await interaction.reply({
    embeds: [
      embed
        .setTitle(leaderboards[lb].title)
        .setDescription(`> ${leaderboards[lb].desc}\n\n${data}`)
    ]
  });
}
