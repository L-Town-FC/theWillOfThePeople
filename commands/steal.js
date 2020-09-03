module.exports = {
    name: 'steal',
    description: 'lets you steal and protect from being stolen from',
    execute(message, args, master, tracker){
        const fs = require('fs')
        const Discord = require('discord.js')
        var command = args[1] || 'none'
        for(var i in master){
            if(master[i].name.toLowerCase() == String(args[1]).toLowerCase()){
                var target = i
                command = 'person'
            }
        }

        switch(command){
            case 'person':
                try{
                    Steal(message, args, target, master, tracker)
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

function Steal(message, args, target, master, tracker){
    const unlock = require('./Functions/Achievement_Functions')
    const min_amount = 25
    const max_amount = 2500
    if(master[message.author.id].steal.caught == false){
        if(master[message.author.id].gbp > 0){
            if(isNaN(args[2]) == false && parseFloat(args[2]) >= min_amount && parseFloat(args[2]) <= max_amount){
                var chance = Chance(message, master, args[2], target)
                var success = Math.ceil(Math.random() * 100)
                //console.log(`Chance: ${chance}, Success: ${success}`)
                if(chance < success){
                    //steal successful
                    //Achievement stuff
                    unlock.unlock(message.author.id, 12, message, master)
                    unlock.unlock(target, 11, message, master)
                    unlock.tracker1(message.author.id, 36, 1, message, master, tracker)
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
                        unlock.unlock(message.author.id, 35, message, master)
                    }else if(poorest_id == target){
                        unlock.unlock(message.author.id, 30, message, master)
                    }

                    master[message.author.id].gbp += parseFloat(args[2])
                    master[target].gbp -= parseFloat(args[2])
                    message.channel.send(`You successfully stole ${parseFloat(args[2])} gbp from ${master[target].name}`)
                    master[message.author.id].steal.attempts += 1
                    var users = message.mentions._client.users.array()
                    for(var k in users){
                        if(users[k].id == target){
                            users[k].send(`${args[2]} gbp was stolen from you`)
                        }
                    }
                }else{
                    //steal failure
                    master[message.author.id].gbp -= parseFloat(args[2])
                    master[target].gbp += parseFloat(args[2])
                    message.channel.send(`You were caught stealing from ${master[target].name}. You paid ${parseFloat(args[2])} gbp in damages`)
                    master[message.author.id].steal.caught = true
                    var users = message.mentions._client.users.array()
                    for(var k in users){
                        //console.log(users[k])
                        if(users[k].id == target){
                            users[k].send(`${master[message.author.id].name} tried to steal from you but failed. They paid ${args[2]} in damages`)
                        }
                    }
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
    const price = 500
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

function Help(message){
    const fs = require('fs')
    const Discord = require('discord.js')
    const embed = require('./Functions/embed_functions')
    var commands = fs.readFileSync('./text_files/steal/steal_help.txt','utf-8')
    var help_embed = new Discord.RichEmbed()
    .setTitle('List of Commands')
    .setColor(embed.Color(message))
    .setDescription(commands)
    message.channel.send(help_embed)
}

function Basics(message){
    const fs = require('fs')
    const Discord = require('discord.js')
    const embed = require('./Functions/embed_functions')
    var basics = fs.readFileSync('./text_files/steal/steal_basics.txt','utf-8')
    var basics_embed = new Discord.RichEmbed()
    .setTitle('Steal Basics')
    .setColor(embed.Color(message))
    .setDescription(basics)
    message.channel.send(basics_embed)
}

function Chance(message, master, amount, target){
    const base_chance = 10
    const max_chance = 99
    const percent_multiplier = 15
    var chance = base_chance

    var targeted_gbp = parseFloat(master[target].gbp) + parseFloat(master[target].account)
    chance += (parseFloat(amount)/targeted_gbp) * 100 *  percent_multiplier
    //console.log(chance)
    if(chance > 75){
        chance = 75
    }

    chance += master[message.author.id].steal.attempts * 5
    //console.log(chance)
    
    var amount_checker = (amount - 100)
    if(amount_checker < 0){
        amount_checker = 0
    }

    chance += (amount_checker/250) * 15
    //console.log(chance)

    if(master[target].steal.insurance > 0){
        chance = max_chance
    }

    if(chance > max_chance){
        chance = max_chance
    }
    //console.log(chance)

    return chance
}