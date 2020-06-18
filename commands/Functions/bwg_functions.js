function New_Game(player, target, bet, new_word, message, bwg){
    try{
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
    }catch(err){
        console.log(err)
        message.channel.send('Error Occured in bwg_functions.js New_Game')
    }
}
module.exports.New_Game = New_Game

function Show_Status(player, bwg, master, message){
    try{
    const Discord = require('discord.js')
    var target = master[bwg[player].target].name
    var bet = bwg[player].bet
    var word = bwg[player].current_word
    var msgs = bwg[player].remaining_msgs
    const status_embed = new Discord.RichEmbed()
    .setTitle(`${bwg[player].name} Game Status`)
    .setDescription(`Target: ${target} \nCurrent Word: ${word} \nBet: ${bet} \nRemaining Messages: ${msgs}`)
    message.channel.send(status_embed)
    }catch(err){
        console.log(err)
        message.channel.send("Error Occured in bwg_function.js Show_Status")
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
        message.channel.send('Error Occured in bwg_functions.js Target')
    }
}
module.exports.Target = Target

function Reset(player, bwg, message){
    try{
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
    }catch(err){
        console.log(err)
        message.channel.send('Error Occured in bwg_functions.js Reset')
    }
}
module.exports.Reset = Reset

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
module.exports.purchase = purchase