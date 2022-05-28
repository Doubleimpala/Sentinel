import { Interaction, GuildMember, MessageActionRow, MessageButton, MessageComponentInteraction, MessageEmbed } from "discord.js";
import { ICommand } from "wokcommands";

export default {
    category: 'Moderation',
    description: 'Kicks a specified member',

    permissions: ['ADMINISTRATOR' || 'KICK_MEMBERS'],
    requireRoles: true,

    slash: 'both',
    testOnly: true,

    guildOnly: true,
    
    minArgs: 2,
    expectedArgs: '<user> <reason>',
    expectedArgsTypes: ['USER', 'STRING'],

    callback: async ({ message, interaction, interaction: msgInt, channel, args }) => {
        const target = message ? message.mentions.members?.first() : interaction.options.getMember('user') as GuildMember
        if(!target){
            return 'Please tag somebody to kick.'
        }

        if(!target.kickable){
            return {
                custom: true,
                content: 'Cannot kick that user.',
                ephermeral: true
            }
        }

        if(message){
            return("Please use a slash command. Currently, the legacy commands have problems (Slash commands also get more features such as a confirmation message and etc). \nTarget was not kicked.")
        }

        args.shift()
        const reason = args.join(' ')

        const row = new MessageActionRow()
         .addComponents(
             new MessageButton()
             .setCustomId('kick_yes')
             .setLabel('Kick')
             .setStyle('DANGER')
         )
         .addComponents(
            new MessageButton()
            .setCustomId('kick_no')
            .setLabel('Cancel')
            .setStyle('SECONDARY')
        )
        
            await msgInt.reply({
                content: 'Are you sure you want to kick this member?',
                components: [row],
                ephemeral: true
            })

        function filter(btnInt: Interaction) {
            return msgInt.user.id === btnInt.user.id;
        }

        const collector = channel.createMessageComponentCollector({
            filter,
            max:1,
            time: 5000
        })
        const kickConfirmation = new MessageEmbed()
            .setDescription(`<@${target.user.id}> was kicked`)
            .setTitle(`Member successfully kicked.`)

        collector.on('end', (collection) => {
            if(collection.first()?.customId === 'kick_yes'){
                target.kick(reason)
                interaction.followUp({embeds: [kickConfirmation]})
            } else {
                interaction.followUp({
                    content: 'Member was not kicked. If this is due to an error, please contact developers.',
                    ephemeral: true
                })
            }
        })
        
    }
} as ICommand