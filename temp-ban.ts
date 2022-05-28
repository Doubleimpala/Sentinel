import { GuildAuditLogsEntry, MessageEmbed, User } from 'discord.js'
import { ICommand } from 'wokcommands'
import punishmentSchema from '../models/punishment-schema'

export default {
    category: 'Moderation',
    description: 'Bans a member for a specified amount of time.',

    requireRoles: true,

    minArgs: 3,
    expectedArgs: '<user> <duration> <reason>',
    expectedArgsTypes: ['USER', 'STRING', 'STRING'],

    slash: 'both',
    testOnly: true,

    callback: async ({
        args,
        member: staff,
        guild,
        client,
        message,
        interaction,
    }) => {
        if(!guild){
            return 'This command can only be used inside of a server.'
        }

        let userId = args.shift()!
        const duration = args.shift()!
        const reason = args.join(' ')
        let user: User | undefined

        if(message){
            user = message.mentions.users?.first()
        } else{
            user = interaction.options.getUser('user') as User
        }

        if(!user){
            userId = userId.replace(/[@!>]/g, '')
            user = await client.users.fetch(userId)

            if(!user){
                return `Could not find user with ID "${userId}"`
            }
        }
        userId = user.id

        let time
        let type
        try{
            const split = duration.match(/\d+|\D+/g)
            time = parseInt(split![0])
            type = split![1].toLowerCase()
        }catch(e){
            return "Invalid time format. Example format: \"1d\" for 1 day, \"3h\" for 3 hours, or \"2m\" for 2 minutes."
        }

        if(type === 'h'){
            time *= 60
        } else if (type === 'd'){
            time *= 60*24
        } else if (type !== 'm'){
            return "Please use 'd', 'h', or 'm' standing for days, hours, and minutes respectively."
        }

        const expires = new Date()
        expires.setMinutes(expires.getMinutes() + time)

        const result = await punishmentSchema.findOne({
            guildId: guild.id,
            userId,
            type: 'ban',
        })
        if(result){
            return `<@${userId}> is already banned.`
        }

        try{
            await guild.members.ban(userId, {days: 0, reason })

            await new punishmentSchema({
                userId,
                guildId: guild.id,
                staffId: staff.id,
                reason,
                expires,
                type: 'ban',
            }).save()
        } catch(ignored){
            return `Cannot ban @${userId}`
        }

        const tbanConfirmation = new MessageEmbed()
            .setDescription (`<@${userId}> has been banned.`)
            .setTitle("Member temporarily banned.")
            .addFields([{
                name: 'Duration',
                value: `${duration}`
            }, {
                name: 'Moderator',
                value: `${staff}`,
            }])
        return tbanConfirmation
    },
} as ICommand