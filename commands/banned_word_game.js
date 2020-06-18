module.exports = {
    name: 'bwg',
    description: 'bet on if a person will say a certain word',
    execute(message, args, money){
        const fs = require("fs")
        const Discord = require('discord.js')
        master = JSON.parse(fs.readFileSync("./JSON/master.json", "utf-8"))
        bwg = JSON.parse(fs.readFileSync("./JSON/banned_word_game.json", "utf-8"))
        var command = String(args[1]).toLowerCase()
        var name = args[2]
        var bet = parseFloat(args[3])
        var word = args[4]
        var user = message.author.id
        min_bet = 50
        max_bet = 500
        names = []
        counter = 0
        for(i in master){
            names[counter] = String(master[i].name).toLowerCase()
            counter++
        }

        switch(command){
            case 'bet':
                //starts game
                try{
                    if(bwg[user].gamestatus == 0){
                        if(typeof(name) !== 'undefined' && names.includes(name.toLowerCase()) == true){
                            var target = Target(name, master)
                            if(bet > money){
                                message.channel.send("You don't have enough gbp for that bet")
                            }else if(typeof(bet - 0) !== 'NaN' && bet >= min_bet && bet <= max_bet){
                                if(bwg[target].used_words.includes(word) == true){
                                    message.channel.send(`That word has already been successfully used on ${name}`)
                                }else if (!/[^a-zA-Z]/.test(word) && word.length >= 6){
                                    message.channel.send('Your bet is accepted')
                                    purchase(bet, user, message, master)
                                    New_Game(user, target, bet, word, message, bwg)
                                    Show_Status(user, bwg, master, message)
                                }else{
                                    message.channel.send('Please give a valid 6 letter word')
                                }
                            }else{
                                message.channel.send(`Please give a valid bet between ${min_bet} gbp and ${max_bet} gbp`)
                            }
                        }else{
                            message.channel.send('Please give a valid name')
                        }
                    }else{
                        message.channel.send(`You are already playing a game`)
                    }
                }catch(err){
                    console.log(err)
                    message.channel.send("Error Occured in bwg.js bet")
                }
            break;
            case 'status':
                //shows who is being targeted except in dms where it will show you your current game status
                try{
                    if(message.channel.type === 'dm'){
                        Show_Status(user, bwg, master, message)
                    }else{
                        var targets = []
                        var counter = 0
                        for(i in bwg){
                            if(bwg[i].target !== ""){
                                var id = bwg[i].target
                                targets[counter] = master[id].name
                                counter++
                            }
                        }
                        const target_list = new Discord.RichEmbed()
                        .setTitle("List of People being targeted")
                        .setDescription(targets)
                        message.channel.send(target_list)
                    }
                }catch(err){
                    console.log(err)
                    message.channel.send("Error occured in bwg.js status")
                }
            break;
            case 'reset':
                try{
                    //resets the game in case of a glitch or if you want to switch your target
                    Reset(user, bwg, message)
                }catch(err){
                    console.log(err)
                    message.channel.send("Error Occured in bwg.js reset")
                }
            break;
            case 'rules':
                //shows basic rules of banned word game
                try{
                var rules = fs.readFileSync('text_files/bwg_rules', 'utf-8')
                const rules_list = new Discord.RichEmbed()
                .setTitle("Banned Word Game (bwg) Rules")
                .setDescription(rules)
                message.channel.send(rules_list)
                }catch(err){
                    console.log(err)
                    message.channel.send("Error occured in bwg.js rules")
                }
            break;
            case 'help':
                //shows list of commands
                try{
                var help = fs.readFileSync('text_files/bwg_commands.txt', 'utf-8')
                const help_list = new Discord.RichEmbed()
                .setTitle("List of Commands")
                .setDescription(help)
                message.channel.send(help_list)
                }catch(err){
                    console.log(err)
                    message.channel.send("Error occured in bwg.js help")
                }
            break;
            default:
                message.channel.send('Use "!bwg help" for a list of commands')
        }
    }

}
function New_Game(player, target, bet, new_word, message, bwg){
    const fs = require('fs')
    var remaining_msgs = 100
    bwg[player].target = target
    bwg[player].bet = bet
    bwg[player].current_word = new_word
    bwg[player].remaining_msgs = remaining_msgs
    bwg[player].gamestatus = 1
    fs.writeFileSync ("./JSON/banned_word_game.json", JSON.stringify(bwg, null, 2), function(err) {
        if (err) throw err;
        console.log('complete');
        }
    );
}

function Show_Status(player, bwg, master, message){
    const Discord = require('discord.js')
    var target = master[bwg[player].target].name
    var bet = bwg[player].bet
    var word = bwg[player].current_word
    var msgs = bwg[player].remaining_msgs
    const status_embed = new Discord.RichEmbed()
    .setTitle(`${bwg[player].name} Game Status`)
    .setDescription(`Target: ${target} \nCurrent Word: ${word} \nBet: ${bet} \nRemaining Messages: ${msgs}`)
    message.channel.send(status_embed)
}

function Target(name, master){
    for(i in master){
        if(master[i].name.toLowerCase() == name.toLowerCase()){
            return i
        }
    }
}

function Reset(player, bwg, message){
    const fs = require('fs')
    bwg[player].target = ""
    bwg[player].current_word = ""
    bwg[player].bet = 0
    bwg[player].remaining_msgs = ""
    bwg[player].gamestatus = 0

    fs.writeFileSync ("./JSON/banned_word_game.json", JSON.stringify(bwg, null, 2), function(err) {
        if (err) throw err;
        console.log('complete');
        }
    );

    message.channel.send("Your game has been reset")
}

function purchase(bet_value, player, message, master) {
    try{
        const fs = require('fs');
        //var master = JSON.parse(fs.readFileSync("./JSON/master.json", "utf-8"))
        for(i in master){
            if(player == i){
                master[message.author.id].gbp = parseFloat(master[message.author.id].gbp) - parseFloat(bet_value)
            }
        }


        fs.writeFileSync ("./JSON/master.json", JSON.stringify(master), {spaces: 2}, function(err) {
            if (err) throw err;
            console.log('complete');
            }
        );
    }catch(err){
        console.log(err)
        message.channel.send("Error Occured in 21.js Purchase");
    }

}