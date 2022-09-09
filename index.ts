import DiscordJS, { Intents, Interaction } from 'Discord.js'
import WOKCommands from 'wokcommands'
import path from 'path'
import dotenv from 'dotenv'
dotenv.config()

const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_PRESENCES
    ]
})


client.on('ready', async () => {
    console.log('Bot is online!')

    new WOKCommands(client, {
        commandDir: path.join(__dirname, 'commands'),
        featureDir: path.join(__dirname, 'features'),
        typeScript: true,
        testServers: ['985901476876525628'],
        botOwners: ['399887900419817473'],
        mongoUri: process.env.MONGO_URI,
    })
})

client.login(process.env.TOKEN)


