module.exports = {
    name: 'steal',
    description: 'lets you steal and protect from being stolen from',
    execute(message, args, master, tracker, bot){
        var command = args[1] || 'none';

        for(var i in master){
            if(master[i].name.toLowerCase() == command.toLowerCase()){
                var target = i
                command = 'person'
            }
        }

        switch(command){
            case 'person':
                try{
                    Steal(message, args, target, master, tracker, bot)
                }catch(err){
                    console.log(err)
                    message.channel.send('Error occurred in steal.js person')
                }
            break;
            case 'insurance':
                try{
                    Insurance(message, args, master)
                }catch(err){
                    console.log(err)
                    message.channel.send('Error occurred in steal.js insurance')
                }
            break;
            case 'odds':
                try{
                    Steal_Odds(message, args, master)
                }catch(err){
                    console.log(err)
                    message.channel.send('Error occurred in steal.js odds')
                }
            break;
            case 'help':
                try{
                    Help(message)
                }catch(err){
                    console.log(err)
                    message.channel.send('Error occurred in steal.js help')
                }
            break;
            case 'basics':
                try{
                    Basics(message)
                }catch(err){
                    console.log(err)
                    message.channel.send('Error occurred in steal.js basics')
                }
            break;
            default:
                message.channel.send(`Use "!steal help" for a list of commands`)
        }
    }
}

function Steal(message, args, target, master, tracker, bot){
    const unlock = require('./Functions/Achievement_Functions')
    const min_amount = 25
    const max_amount = 2500
    if(master[message.author.id].steal.caught == false){
        if(master[message.author.id].gbp > 0){
            if(isNaN(args[2]) == false && parseFloat(args[2]) >= min_amount && parseFloat(args[2]) <= max_amount){
                var chance = Chance(message, master, args[2], target)
                var success = Math.random() * 100
                //console.log(`Chance: ${chance}, Success: ${success}`)
                if(chance < success){
                    //steal successful

                    //Better to Ask for Forgiveness than Permission
                    unlock.unlock(message.author.id, 12, message, master)

                    //Trust Nobody Achievement
                    unlock.unlock(target, 11, message, master)

                    //Kleptomaniac Achievement
                    unlock.tracker1(message.author.id, 36, 1, message, master, tracker)
                    
                    //Master Thief Achievement
                    unlock.tracker1(message.author.id, 37, parseFloat(args[2]), message, master, tracker)
                    
                    var poorest = 250
                    var richest = 0 
                    var poorest_id = ""
                    var richest_id = ""
                    for(var i in master){
                        if(master[i].gbp < poorest){
                            poorest = master[i].gbp
                            poorest_id = i
                        }
                        if(master[i].gbp > richest){
                            richest = master[i].gbp
                            richest_id = i
                        }
                    }

                    if(richest_id == target){
                        //Robinhood Achievement
                        unlock.unlock(message.author.id, 35, message, master)
                    }else if(poorest_id == target){
                        //Trick Down Economics Achievement
                        unlock.unlock(message.author.id, 30, message, master)
                    }

                    master[message.author.id].gbp += parseFloat(args[2])
                    master[target].gbp -= parseFloat(args[2])
                    message.channel.send(`You successfully stole ${parseFloat(args[2])} gbp from ${master[target].name}`)
                    
                    //message.channel.send(`Chance of getting caught ${chance}%`)
                    
                    master[message.author.id].steal.attempts += 1
                    
                    var user = bot.users.cache.find(user => user.id == target); //use something like this instead of the code above
                    user.send(`${args[2]} gbp was stolen from you`);
                    
                }else{
                    //steal failure
                    var amount = Math.round(args[2] *125)/100
                    master[message.author.id].gbp -= amount
                    master[target].gbp += amount
                    message.channel.send(`You were caught stealing from ${master[target].name}. You paid ${amount} gbp in damages`)
                    //message.channel.send(`Chance of getting caught ${chance}%`)
                    master[message.author.id].steal.caught = true
                    
                    user = bot.users.cache.find(user => user.id == target); //use something like this instead of the code above
                    user.send(`${master[message.author.id].name} tried to steal from you but failed. They paid ${amount} gbp in damages`);
                    
                }
            }else{
                message.channel.send(`You must choose an amount between ${min_amount} and ${max_amount}`)
            }
        }else{
            message.channel.send(`You can't steal from someone when you have 0 or less gbp`)
        }

    }else{
        message.channel.send('You have been caught today and cannot steal anymore')
    }
}

function Insurance(message, args, master){
    var command = args[2] || 'none'
    const price = 400
    if(isNaN(args[2]) == false && parseFloat(args[2]) == parseInt(args[2]) && parseInt(args[2]) > 0){
        var amount = parseInt(args[2])
        if(amount * price <= master[message.author.id].gbp){
            master[message.author.id].steal.insurance += amount
            master[message.author.id].gbp -= price * amount
            message.channel.send(`You successfully bought ${amount} day(s) of insurance`)
        }else{
            message.channel.send(`You need atleast ${price * amount} gbp to buy ${amount} day(s) of insurance`)
        }
    }else if(command == 'none'){
        message.channel.send(`You have ${master[message.author.id].steal.insurance} day(s) of insurance left`)
    }else{
        message.channel.send('Use "!steal help" for a list of commands')
    }
}

function Steal_Odds(message, args, master){
    var amount = args[3] || 'none'
    var target = "undefined"
    for(var i in master){
        if(master[i].name.toLowerCase() == args[2].toLowerCase()){
            target = i
        }
    }

    if(typeof(target) !== 'undefined'){
        if(isNaN(amount) == false && parseFloat(amount) >= 25 && parseFloat(amount) <= 2500){
            Odds(message, args, master, target, parseFloat(amount))
        }else{
            message.channel.send('You must choose a valid amount between 25 and 2500')
        }
    }else{
        message.channel.send(`The user you chose doesn't exist`)
    }
}

function Odds(message, args, master, target, amount){
    const embed = require('./Functions/embed_functions')
    /*
    Basic Layout:

    Base Chance -25%
    Chance from Percentage of Targets Total GBP
    Chance from previous attempts
    Chance from Amount Being Stolen
    ---------------------------------
    Total Chance of Failure

    */
    const base_chance = 25
    const max_chance = 99
    const percent_multiplier = 10
    var chance_list = []
    var chance = base_chance

    var targeted_gbp = parseFloat(master[target].gbp) + parseFloat(master[target].account)
    chance += (parseFloat(amount)/targeted_gbp) * 100 *  percent_multiplier
    if(chance > 75){
        chance = 75
    }else if(chance <= 0){
        chance = 75
    }
    chance_list[0] = Math.round((chance - base_chance) * 100)/100

    chance += master[message.author.id].steal.attempts * 7.5
    chance_list[1] = Math.round((chance - (chance_list[0] + base_chance))*100)/100
    
    var amount_checker = (amount - 100)
    if(amount_checker < 0){
        amount_checker = 0
    }
    chance += (amount_checker/250) * 10
    chance_list[2] = Math.round((chance - chance_list[1] - chance_list[0] - base_chance)*100)/100

    if(chance > max_chance){
        chance = max_chance
    }

    chance_list[3] = Math.round(chance * 100)/100

    var title = `Failure Chance of Stealing from ${master[target].name}`
    var description = 
        [`Base Chance: ${base_chance}%`,
        `Chance from Target's Total GBP: ${chance_list[0]}% (capped at 50%)`,
        `Chance from Previous Attempts: ${chance_list[1]}%`,
        `Chance from Amount being Stolen: ${chance_list[2]}%`,
        `=========================================`,
        `Total: ${chance_list[3]}% (capped at 99%)`]
    var fields = {name:'DISCLAIMER:', value: "Does not account for if target has insurance or not"}
    const embedMessage = embed.EmbedCreator(message, title, description, fields)
    message.channel.send({embeds: [embedMessage]})
}

function Help(message){
    const fs = require('fs')
    const embed = require('./Functions/embed_functions')

    var title = `List of Commands`
    var description = fs.readFileSync('./text_files/steal/steal_help.txt','utf-8')
    var fields = embed.emptyValue
    const embedMessage = embed.EmbedCreator(message, title, description, fields)
    message.channel.send({embeds: [embedMessage]})
}

function Basics(message){
    const fs = require('fs')
    const embed = require('./Functions/embed_functions')

    var title = `Steal Basics`
    var description = fs.readFileSync('./text_files/steal/steal_basics.txt','utf-8')
    var fields = embed.emptyValue
    const embedMessage = embed.EmbedCreator(message, title, description, fields)
    message.channel.send({embeds: [embedMessage]})
}

function Chance(message, master, amount, target){
    const base_chance = 25
    const max_chance = 99
    const percent_multiplier = 10
    var chance = base_chance

    var targeted_gbp = parseFloat(master[target].gbp) + parseFloat(master[target].account)
    chance += (parseFloat(amount)/targeted_gbp) * 100 *  percent_multiplier
    if(chance > 75){
        chance = 75
    }

    chance += master[message.author.id].steal.attempts * 7.5
    //console.log(chance)
    
    var amount_checker = (amount - 100)
    if(amount_checker < 0){
        amount_checker = 0
    }

    chance += (amount_checker/250) * 10
    //console.log(chance)

    if(chance > max_chance){
        chance = max_chance
    }
    //console.log(chance)

    if(master[target].steal.insurance > 0){
        chance = max_chance
    }
    return chance
}