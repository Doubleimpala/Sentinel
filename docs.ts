import { ICommand } from "wokcommands";
import { MessageEmbed } from 'discord.js';

export default {
    category: 'Information',
    description: 'Provides link to documentation website and embed pages with commands and description.',

    callback: ({}) => {
        const docsEmbed = new MessageEmbed()
            .setTitle("Sentinel Documentation")
            .setDescription("Below is the guide to using the Sentinel Discord Bot.\n*Note: This bot is still under development and documentation is not complete*")
            .addFields([{
                name:"Ping",
                value: "Replies with bot information. \nExample usage: !ping or /ping. \nCategory: Information"
            }, {
                name: "Kick",
                value: "Kicks a specified member. \nExample usage: !kick <target> <reason> or /kick <target> <reason>. \nCategory: Moderation"
            }])
            .setFooter("Please use the linked website documentation. It is more complete and has more features.")
    }
} as ICommand