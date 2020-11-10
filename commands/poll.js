module.exports = {
    name: 'poll',
    description: 'lets users run a poll',
    execute(message, args){
        const fs = require('fs')
        var commmand

        //!poll 5m Should Zaid stop using Discord? "Yes" "No"
        //!poll [poll number] yes/no

        switch(commmand){
            case '1':

            break;
            case 'vote':

            break;
            default:
                message.channel.send('Use "!poll help" for a list of commands')
        }
    }
}