<div>
  <p align="center">
      <img src="https://i.imgur.com/GCLBxzF.png" width="130" />
      <h1 align="center" >Quartermaster Remastered </h1>
  </p>
  <p align="center">
    <b> Create medals t-shirts and more with ease!</b>
  </p>
</div>

# 📖 Introduction

I began the development of the IRF Medal Bot in hopes to replace Quartermaster, which is annoying to use...
I made a solid base for the bot and made sure it was very easy to use. Unfortunately, I'm leaving the "IRF"
so development has been frozen. However, anyone can continue development. The bot runs, but it's missing various key features. 

*not an official IRF project*

## Features

- Interaction with IRF's Trello to feed data to the bot. This way, it'd be much easier to handle new medals.
- Type safety, is a lot better to maintain than Quartermaster, probably.
- VERY user-friendly, I worked on grabbing the medals from any platform the user is on with ease. For PC, they can easily copy and paste the embed with a list of medals, including emojis. For mobile, they can take a picture of it, and the bot will use LOCAL, FREE, AND OPEN SOURCE image recognization to convert it into text, where the bot can understand it.
- Easily change any stage level of a medal. All medal images must be sourced from a human, by manually cutting it out from the Medal_database.png file which can be found on IRF's Trello.

![img](https://i.imgur.com/2CziAuv.png "Discord command")

## Watch the example on PC! (click the image, you can't embed videos in GitHub Readmes)

[![Watch the video](https://i.imgur.com/HIXy2SW.png)](https://youtu.be/J5Nfd72AE54)

## 🤔 What's missing?

- Followup embeds to tell the bot which medals should be hidden or only be shown as a ribbon.
- T-shirt creation.
- Veteran badges.
- Proper citation support

## 🏗 Development

```bash
pnpm install
pnpm dev
```

If you want to use [Nodemon](https://nodemon.io/) to auto-reload while in development:

```bash
pnpm watch
```

## 💻 Production

```bash
pnpm install --prod
pnpm build
pnpm start
```

## 💻 OR USE PM2 for easy hosting (Production only)

```bash
pnpm install --prod
pnpm build
pm2 start build/main.js --name IRFMedalBot
```

### 🐋 Docker

To start the bot:

```bash
docker-compose up -d
```

To shut down the bot:

```bash
docker-compose down
```

To view the bot's logs:

```bash
docker-compose logs
```

For the full command list please view the [Docker Documentation](https://docs.docker.com/engine/reference/commandline/cli/).

# 📜 Need help extending this bot?

- [discordx.js.org](https://discordx.js.org)
- [Tutorials (dev.to)](https://dev.to/oceanroleplay/series/14317)
- [Check examples](https://github.com/oceanroleplay/discord.ts/tree/main/packages/discordx/examples)
- [Noblox.js](https://noblox.js.org/)
- [Canvas image gen](https://www.npmjs.com/package/canvas)
