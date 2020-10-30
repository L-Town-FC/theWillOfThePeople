module.exports = {
    name: 'poll',
    description: 'lets users run a poll',
    execute(message, args){
        const fs = require('fs')
        var commmand

        //!poll 1 5m Should Zaid stop using Discord?
        //output: Embedded Yes/No message with accompanying poll number
        //!poll [poll number] yes/no

        //poll 2 5m Tits Ass Thighs 
        //output: Embedded message with a list numbered list of options
        //if more than 2, ranked choice with run off
        //poll [poll number] Order of votes
        switch(commmand){
            case '1':

            break;
            case '2':

            break;
            case 'vote':

            break;
            default:
                message.channel.send('Use "!poll help" for a list of commands')
        }
    }
}