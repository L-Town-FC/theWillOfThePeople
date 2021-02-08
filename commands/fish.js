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
    const fs = require('fs')
    
    //var dist = random.normal(15,5)(0)
    //rarity is determined by rod, bait, and tackle
    var junk = Junk_or_Fish(profiles, user)
    if(junk == true){
        Junk(message, profiles, user)
    }else{
        Fish(message, profiles, user)
    }
}

function Junk_or_Fish(profiles, user){
    //This function will look at the different bait/tackles and determine if you caught junk or a fish
    var default_chance = .30
    var chance = Math.random()
    if(chance > default_chance){
        return true
    }else{
        return false
    }
}

function Junk(message, profiles, user){
    message.channel.send('You caught junk')
}

function Fish(message, profiles, user){
    const random = require('random')
    const fs = require('fs')
    var sizes = Size_Selector(profiles[user].boat)
    //After a size is chosen, the corresponding json is read. Then it randomly selects a fish from the list or junk
    //Based on the rarity of the fish it decides if it should keep it or move on to the next fish
    //ex. Epic rarity fish is first selected. 5% chance it keeps it. 95% chance it generates another fish
    var fish_weight = random.normal(sizes[0], sizes[1])(0).toFixed(2)
    var range = JSON.parse(fs.readFileSync(`./JSON/fish/${sizes[2]}_fish.json`,'utf-8'))

    var caught = false
    while (caught == false){
        var index = Math.floor(Math.random()*Object.keys(range).length)
        var fish = Object.keys(range)[index]
        var fish_chance = Rarity(range[fish].rarity)
        console.log(fish)

        if(Math.random() <= fish_chance){
            message.channel.send(`You caught a ${fish} weighing ${fish_weight} lbs`)
            caught = true
        }
    }

    function Rarity(rarity){
        var chance
        switch(rarity){
            case 'C':
                chance = 0.5
            break;
            case 'U':
                chance = 0.25
            break;
            case 'R':
                chance = 0.13
            break;
            case 'E':
                chance = 0.06
            break;
            case 'L':
                chance = 0.03
            break;
            case 'X':
                chance = 0.02
            break;
            case 'G':
                chance = 0.01
            break;
        }
        return chance
    }
}

function Size_Selector(boat){
    //looks at your boat and chooses which size fish you can catch
    //size of fish is determined only by boat
    var sizes = []
    //[mean, std]
    var b = [2,0.5,'bait']
    var s = [5, 1.25,'small']
    var m = [10, 3,'medium']
    var l = [25, 5,'large']
    var xl = [100, 25,'xl']
    var g = [300, 75,'giant']
    var e = [700, 150,'enormous']

    //boat = 'dinghy'

    switch(boat){
        case 'inflatable tube':
            sizes = [b]
        break;
        case 'river canoe':
            sizes = [b,s]
        break;
        case 'ocean kayak':
            sizes = [b,s,m]
        break;
        case 'dinghy':
            sizes = [s,m,l]
        break;
        case 'boston whaler':
            sizes = [l, xl]
        break;
        case 'the orca ii':
            sizes = [xl, g]
        break;
        case 'queen anne`s revenge':
            sizes = [e]
        break;
    } 
    var size = sizes[Math.floor(Math.random()*sizes.length)]
    return size
}