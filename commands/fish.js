module.exports = {
    name: 'fish',
    description: 'lets you catch and track fish',
    execute(message, args, master, stats, tracker){
        const fs = require('fs')
        var command = String(args[1]).toLowerCase() || 'none'
        const random = require('random')

        switch(command){
            case 'start':
                //creates a profile
            break;
            case 'move':
                //moves your character to different locations
            break;
            case 'cast':
                var dist = random.normal(15,5)(0)
            break
            case 'upgrade':

            break;
            case 'stats':

            break;
            case 'help':

            break;
            default:
                message.channel.send('Use "!fish help" for a list of commands')
        }
    }
}

function Start(message, master){
    
}