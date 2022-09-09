import { MessageEmbed } from "discord.js";
import { ICommand } from "wokcommands";

export default {
    category: 'Testing',
    description: 'sends an embed',
    permissions: ['ADMINISTRATOR'],

    callback: async ({ message, text}) => {
        const embed = new MessageEmbed()
        .setDescription('hello world')
        .setTitle('Title')
        .setColor('RED')
        .setAuthor({name: 'bob'})
        .setFooter({text: 'Footer'})
        .addFields([
        {
            name: 'name',
            value: 'value',
            inline: true
        },
        {
            name: 'name2',
            value: 'value2',
            inline: true
        }
    ])
      .addField('name3', 'value3')

      const newMessage = await message.reply({
          embeds: [embed]
      })

      await new Promise(resolve => setTimeout(resolve, 5000))

      const newEmbed = newMessage.embeds[0]
      newEmbed.setTitle('Edited title')

      newMessage.edit({
          embeds: [newEmbed]
      })
    },
} as ICommand