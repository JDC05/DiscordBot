//Doesn't work with addrole.ts
import { TextChannel, TextChannelResolvable } from "discord.js";
import { ICommand } from "wokcommands";

export default {
    category: 'Moderation',
    description: 'bans a user',
    permissions: ['ADMINISTRATOR'],
    minArgs: 2,
    expectedArgs: '<channel> <text>',
    expectedArgsTypes: ['CHANNEL', 'STRING'],
    slash: 'both',
    testOnly: true,
    guildOnly: true,

    callback: ({message, interaction, args}) => {
        const channel = message ? message.mentions.channels.first() : interaction.options.getChannel('channel') as TextChannel
        if(!channel || channel.type !== 'GUILD_TEXT') {
            return 'Please tag a text channel.'
        }

        args.shift()
        const text = args.join(' ')

        channel.send(text)

        if(interaction) {
            interaction.reply({
                content: 'Send messages!',
                ephemeral: true,
            })
        }
    }

} as ICommand