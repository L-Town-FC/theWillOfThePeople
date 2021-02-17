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
    var default_chance = .90
    var chance = Math.random()
    if(chance > default_chance){
        //junk
        return true
    }else{
        //fish
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
    var range = JSON.parse(fs.readFileSync(`./JSON/fish/${sizes}_fish.json`,'utf-8'))    

    var fish_array = []
    for(var i in range){
        fish_array.push(range[i])
    }

    fish_array.filter(function(fish){
        return fish.rarity == Rarity(profiles, user)
    })

    var fish = fish_array[Math.floor(Math.random()*Object.keys(fish_array).length)]
    var fish_weight = random.normal(fish.mean, fish.std)(0).toFixed(2)
    message.channel.send(`You caught a ${fish.name} weighing ${fish_weight} lbs`) 
    console.log(fish)

    function Rarity(profiles, user){

        //always return common right now
        var C = 300
        var U = 150
        var R = 75
        var E = 30
        var L = 12
        var X = 7
        var G = 1

        var total = C + U + R + E + L + X + G
        var count = 0
        for(var i = 0; i < 10000; i++){
            var outcome = ""
            var chance = Math.random() * total
            if(chance <= G){
                outcome = "G"
            }else if(chance <= G + X){
                outcome = "X"
            }else if(chance <= G + X + L){
                outcome = "L"
            }else if(chance <= G + X + L + E){
                outcome = "E"
            }else if(chance <= G + X + L + E + R){
                outcome = "R"
            }else if(chance <= G + X + L + E + R + U){
                outcome = "U"
            }else{
                outcome = "C"
            } 

            /*
            if(outcome == 'G'){
                count++
            }
            */
        }
        //console.log(count * 100/10000)
        return outcome
    }
}

function Size_Selector(boat){
    //looks at your boat and chooses which size fish you can catch
    //size of fish is determined only by boat
    var sizes = []
    //[mean, std]
    var b = 'bait'
    var s = 'small'
    var m = 'medium'
    var l = 'large'
    var xl = 'xl'
    var g = 'giant'
    var e = 'enormous'

    boat = 'the orca ii'

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