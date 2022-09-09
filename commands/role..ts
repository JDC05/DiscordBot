//doesn't work 15

import { ICommand } from "wokcommands"

const actions = ['give', 'remove', 'has']

export default {
    category: 'Configuration',
    description: 'Gives a role to a user',

    permissions: ['MANAGE_ROLES'],

    minArgs: 3,
    expectedArgs: `<"${actions.join('", "')}"> <user @> <role @>`,

    slash: 'both',
    testOnly: true,
    guildOnly: true,

    options: [
        {
            name: 'action',
            description: `The action to perform. One of: ${actions.join(', ')}`,
            type: 'STRING',
            required: true,
            choices: actions.map((action) => ({
                name: action,
                value: action,
            })),
        },
        {
            name: 'user',
            description: 'The user to perform the action on',
            type: 'USER',
            required: true,
        },
        {
            name: 'role',
            description: 'The role to perform the action on',
            type: 'ROLE',
            required: true,
        },

    ],

    callback: ({guild, args}) => {
        const action = args.shift()
        if(!action || actions.includes(action)){
            return `Unknown action! Please use one of the following: ${actions.join(
                ','
            )}`
        }

        const memberid = args.shift()!.replace(/[<@!&>]/g, '')
        const roleid = args.shift()!.replace(/[<@!&>]/g, '')

        const member = guild!.members.cache.get(memberid)
        const role = guild!.roles.cache.get(roleid)

        if(!member) {
            return `Could not find member with ID ${memberid}`
        }

        if(!role) {
            return `Could not find member with ID ${roleid}`
        }

        if(action === 'has') {
            return member.roles.cache.has(roleid)
            ? 'User has role'
            : 'User does not have a role'
        }

        if(action === 'give') {
            member.roles.add(role)
            return 'Role given'
        }

        if(action === 'remove') {
            member.roles.remove(role)
            return 'Role removed'
        }

        return 'Unknown action'

        

    }
} as ICommand