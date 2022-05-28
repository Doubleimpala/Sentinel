import { Interaction, GuildMember, MessageActionRow, MessageButton, MessageComponentInteraction, MessageEmbed } from "discord.js";
import { ICommand } from "wokcommands";

export default {
    category: 'Information',
    description: 'Replies with bot information',

    slash: 'both',
    testOnly: true,

    callback: ({}) => {
        const pingEmbed = new MessageEmbed()
            .setTitle("Bot Server Information")
            .setDescription("Online")
            .addField("Bot Version", "Alpha v0.010")
            .addField("Server Number", "1")
            .addField("Reaction Time", "*Coming soon*")
            .addField("Status", "🟢")
            .setFooter(`Sentinel bot is still in alpha, please report any bugs if you find them.`)
        return pingEmbed
    }
} as ICommand