const { reset } = require("nodemon")

module.exports = {
    name: 'bwg_counter',
    description: 'says pong',
    execute(message){
        const fs = require("fs")
        const banned = require('./Functions/bwg_functions')
        master = JSON.parse(fs.readFileSync("./JSON/master.json", "utf-8"))
        bwg = JSON.parse(fs.readFileSync("./JSON/banned_word_game.json", "utf-8"))
        var user = message.author.id
        var args = String(message.cleanContent).toLowerCase().split(" ")    
        var win = 0
        try{
            if(message.author.id !== '712114529458192495' && message.author.id !== '668996755211288595'){
                if(message.channel.type !== 'dm' && message.channel.id !== '590585423202484227' && message.channel.id !== '712755269863473252' && message.cleanContent.startsWith("!") == false){
                    for(i in bwg){
                        if(user == bwg[i].target){
                            //goes through every person on server and checks if they are a target.
                            //If they are it checks the message they send for a banned word
                            var word = bwg[i].current_word.toLowerCase()
                            var id = i
                            for(j = 0; j < args.length; j++){
                                if (['[', '{', '(', '*', '#'].includes(args[j][0]) == true){
                                    args[j] = args[j].substr(1)
                                    //Deletes common unique charaters from beginning of word
                                }
                                if(args[j].includes(word) == true){
                                    //checks if word matches banned word
                                    if(args[j].length == word.length){
                                        win++
                                    }else if (/[^a-zA-Z]/.test(args[j][word.length])){
                                        win++
                                    }
                                }
                            }
                            if(win > 0){
                                message.channel.send(`${bwg[id].name} bet ${bwg[id].bet} gbp that you would say "${bwg[id].current_word}"`)
                                message.channel.send(`${bwg[id].bet} has been taken from you and given to ${bwg[id].name}`)
                                banned.purchase(-2 * bwg[id].bet, id, message, master)
                                banned.purchase(1 * bwg[id].bet, user, message, master)
                                bwg[bwg[id].target].used_words.push(bwg[id].current_word)
                                banned.Reset(id, bwg, message)
                                //purchase/reset/add word to used words
                                win = 0
                            }else{
                                bwg[id].remaining_msgs = bwg[id].remaining_msgs - 1
                                if(bwg[id].remaining_msgs <= 0){
                                    //congradulations you didnt say the word
                                    //reset
                                    message.channel.send(`Congratulations. ${bwg[id].name} bet ${bwg[id].bet} gbp that you would say "${bwg[id].current_word}" and you didn't`)
                                    message.channel.send(`You win ${bwg[id].bet} gbp`)
                                    banned.purchase(-1 * bwg[id].bet, user, message, master)
                                    banned.Reset(id, bwg, message)
                                }
                            }
                        }
                    }
                }
            }
            fs.writeFileSync ("./JSON/banned_word_game.json", JSON.stringify(bwg, null, 2), function(err) {
                if (err) throw err;
                console.log('complete');
                }
            );
        }catch(err){
            console.log(err)
            message.channel.send('Error Occured in banned_word_game_counter.js')
        }
    }
}
