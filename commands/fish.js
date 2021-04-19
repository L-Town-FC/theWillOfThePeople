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
                rods: ['stick and bobber'],
                rod: "stick and bobber",
                boats: ["boat1", "boat5"],
                location: "Pond",
                baits: [],
                bait: "",
                tackles: [],
                tackle: "",
                misc: [],
                extra_slot: "",
                fishes:[],
                biggest_fish:""
            }
        }

        switch(command){
            case 'locations':
                //lists locations
                //tells you about locations with more info
                //moves to location if requested an have correct boat
                Locations(message, args, master, profiles, user, tracker, stats)
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
    var sizes = Size_Selector(profiles[user].location)
    console.log(sizes)
    //After a size is chosen, the corresponding json is read. Then it randomly selects a fish from the list or junk
    var range = JSON.parse(fs.readFileSync(`./JSON/fish/${sizes}_fish.json`,'utf-8'))    

    //json is turned into an array so it can be filtered
    var fish_array = []
    for(var i in range){
        fish_array.push(range[i])
    }

    var filtered_fish = []
    var excluded_list = []

    while(filtered_fish.length == 0){
        //a rarity is generated. A list of fish with that rarity is then made
        //If no fish match that rarity, a new rarity is generated until a list can be made
        var rarity = String(Rarity(profiles,user, excluded_list))
        filtered_fish = fish_array.filter(function(fish){
            return fish.rarity == rarity
        })

        if(filtered_fish.length == 0){
            //makes sure failed rarites cant be seen again
            excluded_list.push(rarity)
        }
    }

    var fish = filtered_fish[Math.floor(Math.random()*Object.keys(filtered_fish).length)]
    var fish_weight = random.normal(fish.mean, fish.std)(0).toFixed(2)
    message.channel.send(`You caught a ${fish.name} weighing ${fish_weight} lbs`) 

    function Rarity(profiles, user, excluded){
        //generates rarity based on different weightings
        //users items can alter weightings

        //base values
        var C = 300
        var U = 150
        var R = 75
        var E = 30
        var L = 12
        var X = 7
        var G = 1

        //setting eliminated values to 0
        for(var i = 0; i < excluded.length; i++){
            switch(excluded[i]){
                case 'C':
                    C = 0
                break;
                case 'U':
                    U = 0
                break;
                case 'R':
                    R = 0
                break;
                case 'E':
                    E = 0
                break;
                case 'L':
                    L = 0
                break;
                case 'X':
                    X = 0
                break;
                case 'G':
                    G = 0
                break;
            }
        }

        var total = C + U + R + E + L + X + G
        var count = 0
        //for(var i = 0; i < 10000; i++){
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
        //}
        //console.log(count * 100/10000)
        return outcome
    }
}

function Size_Selector(location){
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

    //location = '1'

    switch(location){
        case 'Pond':
            sizes = [b]
        break;
        case 'Lake':
            sizes = [b,s]
        break;
        case 'River':
            sizes = [b,s,m]
        break;
        case 'Sea':
            sizes = [s,m,l]
        break;
        case 'Ocean':
            sizes = [l, xl]
        break;
        case '6':
            sizes = [xl, g]
        break;
        case '7':
            sizes = [e]
        break;
    } 
    var size = sizes[Math.floor(Math.random()*sizes.length)]
    return size
}

function Catch(profiles, user, rarity){
    const fs = require('fs')

}

function Locations(message, args, master, profiles, user, tracker, stats){
    const fs = require('fs')
    const Discord = require('discord.js')
    const embed = require('./Functions/embed_functions')
    var location_json = JSON.parse(fs.readFileSync('./JSON/fish/locations.json', 'utf-8'))
    var command = args[2] || 'none'
    var command2 = args[3] || 'none'

    if(command.toLowerCase() == 'move'){
        if(parseInt(command2) > 0 && parseInt(command2) <= Object.keys(location_json).length){
            if(profiles[user].boats.includes(location_json[command2].boat) == true){
                profiles[user].location = location_json[command2].name
                message.channel.send(`You went to the ${location_json[command2].name}`)
            }else{
                message.channel.send(`You don't have the required boat to go to the ${location_json[command2].name}`)
            }
        }else{
            message.channel.send(`You didn't choose an acceptable location`)
        }
    }else if(parseInt(command) > 0 && parseInt(command) <= Object.keys(location_json).length){
        var specific_location = new Discord.RichEmbed()
        .setTitle(location_json[command].name)
        .setDescription([
            `Fish Type: ${location_json[command].type}`,
            `Fish Sizes: ${location_json[command].sizes}`,
            `Boat Required: ${location_json[command].boat}`
        ])
        .setColor(embed.Color(message))
        message.channel.send(specific_location)
    }else{
        var list = []
        for(var i in location_json){
            list.push(`${i} ${location_json[i].name}`)
        }
        var locations_list = new Discord.RichEmbed()
        .setTitle('List of Locations')
        .setColor(embed.Color(message))
        .setDescription(list)
        .addField('Extra Info', 'Use "!fish locations [number]" to get info about the location \nUse "!fish locations move [number] tp move to that location')
        message.channel.send(locations_list)
    }
    console.log(profiles)
}