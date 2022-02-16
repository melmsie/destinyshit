const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('../config.json');

const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with pong!'),
  new SlashCommandBuilder()
    .setName('post')
    .setDescription('See results of a post')
    .addStringOption(option => option.setName('post')
    .setDescription('The post you want to see')
    .setAutocomplete(true)),
  new SlashCommandBuilder()
    .setName('user')
    .setDescription('See user data')
    .addUserOption(option => option.setName('target')
    .setDescription('The user who you want to see data on')
    .setRequired(false)),
  new SlashCommandBuilder()
    .setName('fashion')
    .setDescription('Post a fashion pic to put up for opinions')
    .addAttachmentOption(option => option.setName('image')
    .setDescription('A screenshot of your fashion')
    .setRequired(true))
    /* Learn interaction endpoints in command building (spent about an hour to no avail on simply requesting a string)
    .addStringOption(option => option.setName('Name')
    .setDescription('A name to describe your fashion')
    .setRequired(false))
    */,
  new SlashCommandBuilder()
    .setName('weapon')
    .setDescription('Post a weapon roll pic to put up for opinions')
    .addAttachmentOption(option => option.setName('image')
    .setDescription('A screenshot of your weapon roll').setRequired(true))
]
  .map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);
