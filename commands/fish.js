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
            user = message.author.id
            profiles[user] = {
                items: ['stick and bobber'],
                boats: ["inflatable tube"],
                boat: "inflatable tube",
                rod: "stick and bobber",
                bait: "",
                tackle: "",
                fishes:[],
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

    //var dist = random.normal(15,5)(0)
    //rarity is determined by rod, bait, and tackle
    var sizes = Size_Selector(profiles[user].boat.toLowerCase())
    console.log(sizes)
    //After a size is chosen, the corresponding json is read. Then it randomly selects a fish from the list or junk
    //Based on the rarity of the fish it decides if it should keep it or move on to the next fish
    //ex. Epic rarity fish is first selected. 5% chance it keeps it. 95% chance it generates another fish
}

function Size_Selector(boat){
    //looks at your boat and chooses which size fish you can catch
    //size of fish is determined only by boat
    var sizes = []
    switch(boat){
        case 'inflatable tube':
            sizes = ['b']
        break;
        case 'river canoe':
            sizes = ['b','s']
        break;
        case 'ocean kayak':
            sizes = ['b','s','m']
        break;
        case 'dinghy':
            sizes = ['s','m','l']
        break;
        case 'boston whaler':
            sizes = ['l', 'xl']
        break;
        case 'the orca ii':
            sizes = ['xl', 'g']
        break;
        case 'queen anne`s revenge':
            sizes = ['e']
        break;
    } 
    return sizes
}