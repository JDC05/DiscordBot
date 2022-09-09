import { ButtonInteraction, Interaction, MessageActionRow, MessageButton, MessageComponentInteraction } from "discord.js";
import { Collection } from "mongoose";
import { ICommand } from "wokcommands";

export default {
    category: 'testing',
    description: 'Testing',
    slash: true,
    testOnly: true,

    callback: async ({ interaction: msgInt, channel }) => {
        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId('ban_yes')
            .setEmoji('👍')
            .setLabel('Confirm')
            .setStyle('SUCCESS')
        )
        .addComponents(
            new MessageButton()
            .setCustomId('ban_no')
            .setEmoji('👎')
            .setLabel('Cancel')
            .setStyle('DANGER')
        )

        const linkRow = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setURL('https://www.youtube.com/')
            .setLabel('Vist Youtube')
            .setStyle('LINK')
        )


        await msgInt.reply({
            content: 'Are you sure?',
            components: [row, linkRow],
            ephemeral: true
        })

        const filter = (btnInt: Interaction) => {
            return msgInt.user.id === btnInt.user.id
        }

        const collector = channel.createMessageComponentCollector({
            filter,
            max: 1,
            time: 15000
        })

        collector.on('collect', (i: MessageComponentInteraction) => {
            i.reply({
                content: 'You clicked a button',
                ephemeral: true
            })
        })

        collector.on('end', async (collection) => {
            collection.forEach((click) => {
                console.log(click.user.id, click.customId)
            })

        if(collection.first()?.customId === 'ban_yes'){
            //ban target user
        }

        await msgInt.editReply({
            content: 'An action has already been taken',
            components: [],
        })

        })       
    },
} as ICommand