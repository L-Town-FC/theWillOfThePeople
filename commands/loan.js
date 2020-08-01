module.exports = {
    name: 'loan',
    description: 'lets you take out loans with people',
    execute(message, args, master, loans){
        const fs = require('fs')
        const Discord = require('discord.js')
        var command = args[1]
        var names = []
        var user = ''
        for(i in master){
            names.push(master[i].name.toLowerCase())
        }
        if(!args[1]){
            command = 'person'
            user = message.author.id
        }else if(names.includes(args[1].toLowerCase()) == true){
            command = 'person'
            for(i in master){
                if(master[i].name.toLowerCase() == args[1].toLowerCase()){
                    user = i
                }
            }
        }

        switch(command){
            case 'person':
                console.log(master[user])
            break;
            case 'offer':

            break;
            case 'accept':

            break;
            case 'collect':

            break;
            case 'cancel':

            break;
            default:
                message.channel.send('Use "!loan help" for a list of commands')
        }
    }
}