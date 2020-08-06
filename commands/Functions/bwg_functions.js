function New_Game(player, target, bet, new_word, message, master){
    try{
        const fs = require('fs')
        var remaining_msgs = 100
        master[player].bwg.target = target
        master[player].bwg.bet = bet
        master[player].bwg.current_word = new_word
        master[player].bwg.remaining_msgs = remaining_msgs
        master[player].bwg.gamestatus = 1
        /*
        fs.writeFileSync ("./JSON/banned_word_game.json", JSON.stringify(bwg, null, 2), function(err) {
            if (err) throw err;
            console.log('complete');
            }
        );
        */
    }catch(err){
        console.log(err)
        message.channel.send('Error occurred in bwg_functions.js New_Game')
    }
}
module.exports.New_Game = New_Game

function Show_Status(player, master, message){
    try{
    const Discord = require('discord.js')
    const embed = require('./embed_functions')
    var target = master[master[player].bwg.target].name
    var bet = master[player].bwg.bet
    var word = master[player].bwg.current_word
    var msgs = master[player].bwg.remaining_msgs
    const status_embed = new Discord.RichEmbed()
    .setTitle(`${bwg[player].name} Game Status`)
    .setDescription(`Target: ${target} \nCurrent Word: ${word} \nBet: ${bet} \nRemaining Messages: ${msgs}`)
    .setColor(embed.Color(message))
    message.channel.send(status_embed)
    }catch(err){
        console.log(err)
        message.channel.send("Error occurred in bwg_function.js Show_Status")
    }
}

module.exports.Show_Status = Show_Status

function Target(name, master, message){
    try{
        for(i in master){
            if(master[i].name.toLowerCase() == name.toLowerCase()){
                return i
            }
        }
    }catch(err){
        console.log(err)
        message.channel.send('Error occurred in bwg_functions.js Target')
    }
}
module.exports.Target = Target

function Reset(player, master, message){
    try{
        const fs = require('fs')
        master[player].bwg.target = ""
        master[player].bwg.bet = 0
        master[player].bwg.current_word = ""
        master[player].bwg.remaining_msgs = ""
        master[player].bwg.gamestatus = 0
        /*
        fs.writeFileSync ("./JSON/banned_word_game.json", JSON.stringify(bwg, null, 2), function(err) {
            if (err) throw err;
            console.log('complete');
            }
        );
        */
    }catch(err){
        console.log(err)
        message.channel.send('Error occurred in bwg_functions.js Reset')
    }
}
module.exports.Reset = Reset

function purchase(bet_value, player, message, master) {
    try{
        const fs = require('fs');
        master[player].gbp = parseFloat(master[player].gbp) - parseFloat(bet_value)

    }catch(err){
        console.log(err)
        message.channel.send("Error occurred in bwg.js Purchase");
    }

}
module.exports.purchase = purchase