import DiscordJS, { Intents } from "discord.js"
import WOKCommands from 'wokcommands'
import path from 'path'
import mongoose from 'mongoose'
import dotenv from "dotenv"
dotenv.config()
import testSchema from './test-schema'

const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MEMBERS,
    ]
})

client.on('ready', async () => {
    //await mongoose.connect(process.env.MONGO_URI || '', {
    //    keepAlive: true,
    //})
    
    console.log('The bot is ready.')

    new WOKCommands(client, {
        commandsDir: path.join(__dirname, 'commands'),
        featuresDir: path.join(__dirname, 'features'),
        typeScript: true,
        testServers: ['832319732669612082'],
        mongoUri: process.env.MONGO_URI,
        dbOptions: {
            keepAlive: true
        }

        
    })
    setTimeout(async() => {
        await new testSchema({
            message: 'Hello World',

        }).save() 
    }, 1000)
    
    
})

client.login(process.env.TOKEN)