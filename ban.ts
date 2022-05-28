import { Interaction, GuildMember, MessageActionRow, MessageButton, MessageComponentInteraction, MessageEmbed } from "discord.js";
import { ICommand } from "wokcommands";

export default {
    category: 'Moderation',
    description: 'Bans a specified member',

    permissions: ['ADMINISTRATOR' || 'BAN_MEMBERS'],
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
            return 'Please tag somebody to ban.'
        }

        if(!target.kickable){
            return {
                custom: true,
                content: 'Cannot ban that user.',
                ephermeral: true
            }
        }

        if(message){
            return("Please use a slash command. Currently, the legacy commands have problems (Slash commands also get more features such as a confirmation message and etc). \nTarget was not banned.")
        }

        args.shift()
        const reason = args.join(' ')

        const row = new MessageActionRow()
         .addComponents(
             new MessageButton()
             .setCustomId('ban_yes')
             .setLabel('Ban')
             .setStyle('DANGER')
         )
         .addComponents(
            new MessageButton()
            .setCustomId('ban_no')
            .setLabel('Cancel')
            .setStyle('SECONDARY')
        )
        
            await msgInt.reply({
                content: 'Are you sure you want to ban this member? *Note: This command will automatically delete the messages of the banned member for 7 days. The option for this will be added soon.*',
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
        const banConfirmation = new MessageEmbed()
            .setDescription(`<@${target.user.id}> was banned`)
            .setTitle(`Member successfully banned.`)

        collector.on('end', (collection) => {
            if(collection.first()?.customId === 'ban_yes'){
                target.ban({
                    reason,
                    days: 7
                })
                interaction.followUp({embeds: [banConfirmation]})
            } else {
                interaction.followUp({
                    content: 'Member was not banned. If this is due to an error, please contact developers.',
                    ephemeral: true
                })
            }
        })
        
    }
} as ICommand