const { Client } = require('discord.js');
const { GatewayIntentBits } = require('discord-api-types/gateway/v9')
const { join } = require('path');
const { token } = require('../config.json');
const interactionHandler = require('./listeners/interactionCreate');

const client = new Client({ intents: GatewayIntentBits.Guilds });

client.once('ready', () => {
	console.log('Ready!');
});

const listeners = require(join(__dirname, 'listeners'));
for (const listener of listeners) {
	try {
		listeners[listener] = require(join(__dirname, 'listeners', listener)).handle;
		client.on(listener, listeners[listener]);
	} catch (e) {}
}

client.login(token);