# destinyshit

will do shit like rating drip and rolls that people post, and save people's overall drip rating with a leaderboard

requires docker & node 17+

### For Windows 11

~~Use [Docker 4.4.4](https://docs.docker.com/desktop/windows/release-notes/#docker-desktop-444)~~

Ignore Kable, use WSL like a real homie

## Steps to build env


1. clone
2. npm i
3. docker compose up
4. npm run deploy
5. fill out `config.json` and `.env` files (examples given)
6. npm run start


## Things to add

- [x] ~~Don't allow voting on your own post~~ ([cfb5d16](https://github.com/melmsie/destinyshit/commit/cfb5d168cec00792f26a2179bf36637375aa6df0))
- [x] Button to see results straight on the post
- [ ] Delete your posts with the post command via a button
- [x] Add comments
- [ ] Settings per user
- [ ] Leaderboards by average score
- [ ] Overhaul user command to show more data including an overall score
- [x] ~~Validate that an actual image was provided and not another file~~ ([036b2fb](https://github.com/melmsie/destinyshit/commit/036b2fbe9c3e0b2ad20e0730847871cad9106b50))
- [ ] Hook into Bungie Api
  - [ ] Allow people to choose rolls to show off from their inventory
  - [ ] Webhook or something when people earn seals or other hard to get achievements
  - [ ] Fireteam creator/planner
    - [ ] Schedule events and let Guardians sign up for slots
    - [ ] When signing up, choose your class and loadout for others to see