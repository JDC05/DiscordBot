import { GuildMember } from "discord.js";
import { ICommand } from "wokcommands";

export default {
    category: 'Moderation',
    description: 'kicks a user',
    permissions: ['ADMINISTRATOR'],
    slash: 'both',
    testOnly: true,
    guildOnly: true,
    minArgs: 2,
    expectedArgs: '<user> <reason>',
    expectedArgsTypes: ['USER', 'STRING'],

    callback: ({message, interaction, args}) => {
        const target = message ? message.mentions.members?.first() : interaction.options.getMember('user') as GuildMember
        if(!target) {
            return 'Please tag someone to kick.'
        }

        if(!target.kickable){
            return 'Cannot kick this user'
        }

        args.shift()
        const reason = args.join(' ')

        target.kick(reason)

        return `you kicked <@${target.id}>`
    }
} as ICommand