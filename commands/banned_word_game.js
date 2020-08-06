module.exports = {
    name: 'bwg',
    description: 'bet on if a person will say a certain word',
    execute(message, args, money, master){
        const fs = require("fs")
        const Discord = require('discord.js')
        const banned = require('./Functions/bwg_functions')
        const embed = require('./Functions/embed_functions')
        //bwg = JSON.parse(fs.readFileSync("./JSON/banned_word_game.json", "utf-8"))
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
                    if(master[user].bwg.gamestatus == 0){
                        if(typeof(name) !== 'undefined' && names.includes(name.toLowerCase()) == true){
                            if(master[user].name.toLowerCase() !== name.toLowerCase()){
                                var target = banned.Target(name, master, message)
                                if(bet > money){
                                    message.channel.send("You don't have enough gbp for that bet")
                                }else if(typeof(bet - 0) !== 'NaN' && bet >= min_bet && bet <= max_bet){
                                    console.log()
                                    if(master[target].bwg.used_words.includes(word.toLowerCase()) == true){
                                        message.channel.send(`That word has already been successfully used on ${name}`)
                                    }else if (!/[^a-zA-Z]/.test(word) && word.length >= 6){
                                        message.channel.send('Your bet is accepted')
                                        banned.purchase(bet, user, message, master)
                                        banned.New_Game(user, target, bet, word.toLowerCase(), message, master)
                                        banned.Show_Status(user, master, message)
                                    }else{
                                        message.channel.send('Please give a valid 6 letter word')
                                    }
                                }else{
                                    message.channel.send(`Please give a valid bet between ${min_bet} gbp and ${max_bet} gbp`)
                                }
                            }else{
                                message.channel.send(`You can't target yourself`)
                            }
                        }else{
                            message.channel.send('Please give a valid name')
                        }
                    }else{
                        message.channel.send(`You are already playing a game`)
                    }
                }catch(err){
                    console.log(err)
                    message.channel.send("Error occurred in bwg.js bet")
                }
            break;
            case 'status':
                //shows who is being targeted except in dms where it will show you your current game status
                try{
                    if(message.channel.type === 'dm'){
                        if(master[user].bwg.gamestatus == 1){
                            banned.Show_Status(user, master, message)
                        }else{
                            var targets = []
                            var counter = 0
                            for(i in master){
                                if(master[i].bwg.target !== ""){
                                    var id = master[i].bwg.target
                                    targets[counter] = master[id].name
                                    counter++
                                }
                            }
                            const target_list = new Discord.RichEmbed()
                            .setTitle("List of People being targeted")
                            .setDescription(targets)
                            .setColor(embed.Color(message))
                            message.channel.send(target_list)
                        }
                    }else{
                        //Checks all players for if they are targeting someone
                        //If they are, it adds the targets name to a list to be displayed
                        var targets = []
                        var counter = 0
                        for(i in master){
                            if(master[i].bwg.target !== ""){
                                var id = master[i].bwg.target
                                targets[counter] = master[id].name
                                counter++
                            }
                        }
                        const target_list = new Discord.RichEmbed()
                        .setTitle("List of People being targeted")
                        .setDescription(targets)
                        .setColor(embed.Color(message))
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
                    banned.Reset(user, master, message)
                    message.channel.send("Your game has been reset")
                }catch(err){
                    console.log(err)
                    message.channel.send("Error occurred in bwg.js reset")
                }
            break;

            case 'rules':
                //shows basic rules of banned word game
                try{
                var rules = fs.readFileSync('text_files/bwg/bwg_rules', 'utf-8')
                const rules_list = new Discord.RichEmbed()
                .setTitle("Banned Word Game (bwg) Rules")
                .setDescription(rules)
                .setColor(embed.Color(message))
                message.channel.send(rules_list)
                }catch(err){
                    console.log(err)
                    message.channel.send("Error occured in bwg.js rules")
                }
            break;
            case 'words':
                //shows the words that can no longer be used for a person
                if(typeof(name) == 'undefined'){
                    const word_list = new Discord.RichEmbed()
                    .setTitle(`Words that can't be used on ${master[user].name}`)
                    .setDescription(bwg[user].used_words)
                    .setColor(embed.Color(message))
                    message.channel.send(word_list)
                }else if(names.includes(name.toLowerCase()) == true){
                    for(i in bwg){
                        if(name.toLowerCase() == master[i].name.toLowerCase()){
                            const word_list = new Discord.RichEmbed()
                            .setTitle(`Words that can't be used on ${master[i].name}`)
                            .setDescription(master[i].bwg.used_words)
                            .setColor(embed.Color(message))
                            message.channel.send(word_list)
                        }
                    }
                }else{
                    message.channel.send("Give a valid name or leave the name spot empty")
                }
            break
            case 'help':
                //shows list of commands
                try{
                var help = fs.readFileSync('text_files/bwg/bwg_commands.txt', 'utf-8')
                const help_list = new Discord.RichEmbed()
                .setTitle("List of Commands")
                .setDescription(help)
                .setColor(embed.Color(message))
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