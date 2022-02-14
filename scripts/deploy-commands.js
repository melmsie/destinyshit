const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('../config.json');

const commands = [
	new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
	new SlashCommandBuilder().setName('fashion').setDescription('Post a fashion pic to put up for opinions').addAttachmentOption(option => option.setName('image').setDescription('A screenshot of your fashion').setRequired(true)),
	new SlashCommandBuilder().setName('gun').setDescription('Post a gun roll pic to put up for opinions').addAttachmentOption(option => option.setName('image').setDescription('A screenshot of your gun roll').setRequired(true)),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);
