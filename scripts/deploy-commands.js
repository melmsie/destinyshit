const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('../config.json');

const commands = [
  new SlashCommandBuilder().setName('post').setDescription('See results of a specific post')
    .addStringOption(option => option.setName('post').setDescription('The post you want to see results from').setAutocomplete(true).setRequired(true)),

  new SlashCommandBuilder().setName('settings').setDescription('Change settings for yourself')
    .addStringOption(option => option.setName('setting').setDescription('The setting you want to toggle').setAutocomplete(true).setRequired(true)),

  new SlashCommandBuilder().setName('user').setDescription('See user data')
    .addUserOption(option => option.setName('user').setDescription('The user who you want to see data on').setRequired(false)),

  new SlashCommandBuilder().setName('comment').setDescription('Comment on a post')
    .addStringOption(option => option.setName('post').setDescription('The post you want to make a comment on').setAutocomplete(true).setRequired(true))
    .addStringOption(option => option.setName('comment').setDescription('The comment you want to leave').setRequired(true)),

  new SlashCommandBuilder().setName('fashion').setDescription('Post a fashion pic to put up for opinions')
    .addAttachmentOption(option => option.setName('image').setDescription('A screenshot of your fashion').setRequired(true))
    .addStringOption(option => option.setName('title').setDescription('A title to describe your drip').setRequired(false))
    .addStringOption(option => option.setName('description').setDescription('Additional description for your drip').setRequired(false)),

  new SlashCommandBuilder().setName('weapon').setDescription('Post a weapon roll pic to put up for opinions')
    .addAttachmentOption(option => option.setName('image').setDescription('A screenshot of your weapon roll').setRequired(true))
    .addStringOption(option => option.setName('title').setDescription('A title to describe your weapon').setRequired(false))
    .addStringOption(option => option.setName('description').setDescription('Additional description for your weapon').setRequired(false))
]
  .map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
  .then(() => console.log(`Successfully registered ${commands.length} application commands.`))
  .catch(console.error);
