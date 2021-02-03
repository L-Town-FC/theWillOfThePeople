module.exports = {
    name: 'fish',
    description: 'lets you catch and track fish',
    execute(message, args, master, stats, tracker, profiles){
        const fs = require('fs')
        var command = String(args[1]).toLowerCase() || 'none'
        var user
        
        for(var i in profiles){
            if(i == message.author.id){
                user = message.author.id
            }
        }

        if(typeof(user) =='undefined'){
            profiles[message.author.id] = {
                items: [],
                inventory:[],
                location: "",
                rod: "",
                bait: "",
                tackle: "",
                fishes:"",
                biggest_fish:""
            }
        }

        switch(command){
            case 'move':
                //moves your character to different locations
            break;
            case 'cast':
                Cast(message, master, profiles, user, tracker, stats)
            break;
            case 'shop':

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

function Cast(message, master, profiles, user, tracker, stats){
    const random = require('random')

    var dist = random.normal(15,5)(0)
}

function Size_Selector(){
    //looks at your boat and chooses which size fish you can catch
}