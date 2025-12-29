# Requirements

Node.js 18+

A Discord bot application

A Discord server with a role named Developers

A backend running the webhook (included)

#Downloaded needed dependencies

> npm install express
> npm install discord.js

#Clone the repository

> git clone https://github.com/CDsareprettyinsane/Whitelist-Bot.git
> cd Whitelist-Bot

# Configure the bot

Edit src/bot.ts and set your bot variables (token, clientid, requiredrole, etc)

# Build the project
>npm run build

# Running the backend webhook

Start the webhook server first
(rblx id's saved inside of whitelist.json)

> node dist/webhook.js

# Running the bot

In another terminal:

> node dist/bot.js

(Global slash commands may take up to 1 hour to appear the first time)
