# destinyshit

will do shit like rating drip and rolls that people post, and save people's overall drip rating with a leaderboard

requires docker & node 17+

1. clone
2. npm i
3. docker compose up
4. (TEMP) edit `node_modules/discord.js/src/structures/ChatInputCommandInteraction.js` and put `this.__destiny_resolved = data.data.resolved;` on line 14
5. npm run deploy
6. fill out `config.json` and `.env` files (examples given)
7. npm run start
