//kinda works
import roleMessageSchema from '../models/role-message-schema'
import { 
    Client,
    EmojiIdentifierResolvable,
    GuildMember,
    Interaction,
    MessageActionRow,
    MessageButton,
    MessageButtonStyleResolvable,
    Role,
    TextChannel 
} from "discord.js";
import { ICommand } from "wokcommands";
import role from './role.';

const buttonStyles = ['primary', 'secondary', 'success', 'danger']
const prefix = 'button-roles-'

export default {
    category: 'Utility',
    description: 'Adds an auto role to a message via buttons',

    slash: 'both',
    testOnly: true,
    guildOnly: true,

    requiredPermissions: ['ADMINISTRATOR'],

    minArgs: 4,
    expectedArgs: '<role> <emoji> <button-style> <button-label>',
    expectedArgsTypes: ['ROLE', 'STRING', 'STRING', 'STRING'],   

    options: [
        {
            name: 'role',
            description: 'The role to add to the user',
            type: 'ROLE',
            required: true
        },
        {
            name: 'emoji',
            description: 'The emoji to use for the button',
            type: 'STRING',
            required: true
        },
        {
            name: 'button-style',
            description: 'The style of the button',
            type: 'STRING',
            required: true,
            choices: buttonStyles.map((style) => ({
                name: style,
                value: style.toUpperCase()
            }))
        },
        {
            name: 'button-label',
            description: 'The label of the button',
            type: 'STRING',
            required: true
        },
    ],

    init: (Client: Client) => {
        Client.on('interactionCreate', (interaction) => {
            if(!interaction.isButton()){
                return
            }

            const {guild, customId} = interaction
            if(!guild || !customId.startsWith(prefix)) {
                return
            }

            const roleId = customId.replace(prefix, '')
            const member = interaction.member as GuildMember

            if(member.roles.cache.has(roleId)) {
                member.roles.remove(roleId)

                interaction.reply({
                    ephemeral: true,
                    content: `You no longer have the <@&${roleId}> role.`, 
                })
            } else {
                member.roles.add(roleId)

                interaction.reply({
                    ephemeral: true,
                    content: `You now have the <@&${roleId}> role.`, 
                })
            }
        })
    },

    callback: async ({guild, message, interaction, args}) => {
        args.shift()

        let role: Role
        if(message) {
            role = message.mentions.roles.first() as Role
        } else {
            role = interaction.options.getRole('role') as Role
        }

        const emoji = args.shift()

        const buttonStyle = args.shift() || 'primary'
        if(!buttonStyles.includes(buttonStyle.toLowerCase())) {
            return `Unknown button style. Valid styles are: "${buttonStyles.join('", "')}"`
        }

        const buttonLabel = args.join(' ')

        const data = await roleMessageSchema.findById(guild!.id)
        if(!data) {
            return {
                custom: true,
                ephemeral: true,
                content: 'No role message found. Send one using `/btnmsg`',              
            } 
        }

        const {channelId, messageId} = data
        const channel = guild!.channels.cache.get(channelId) as TextChannel
        const roleMessage = await channel.messages.fetch(messageId)

        const rows = roleMessage.components
        const button = new MessageButton()
        .setLabel(buttonLabel)
        .setEmoji(emoji as EmojiIdentifierResolvable)
        .setStyle(buttonStyle as MessageButtonStyleResolvable)
        .setCustomId(`${prefix}${role.id}`)

        let added = false

        for (const row of rows) {
            if(row.components.length > 5) {
                row.addComponents(button)
                added = true
                break
            }
        }

        if(!added) {
            if(rows.length >= 5) {
                return {
                    custom: true,
                    ephemeral: true,
                    content: 'Cannot add more buttons to the message',              
                } 
            }

            rows.push(new MessageActionRow().addComponents(button))
        }

        roleMessage.edit({
            components: rows
        })

        return {
            custom: true,
            ephemeral: true,
            content: 'Added button to role message',              
        } 
    },

} as ICommand