module.exports = {
    name: 'bwg_counter',
    description: 'says pong',
    execute(message, master, tracker){
        const fs = require("fs")
        const banned = require('./Functions/bwg_functions')
        const unlock = require('./Functions/Achievement_Functions')
        //bwg = JSON.parse(fs.readFileSync("./JSON/banned_word_game.json", "utf-8"))
        var user = message.author.id
        var args = String(message.cleanContent).toLowerCase().split(" ")    
        var win = 0
        try{
            if(message.author.id !== '712114529458192495' && message.author.id !== '668996755211288595'){
                if(message.channel.type !== 'dm' && message.channel.id !== '590585423202484227' && message.channel.id !== '712755269863473252' && message.cleanContent.startsWith("!") == false){
                    for(i in master){
                        if(user == master[i].bwg.target){
                            //goes through every person on server and checks if they are a target.
                            //If they are it checks the message they send for a banned word
                            var word = master[i].bwg.current_word.toLowerCase()
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
                                message.channel.send(`${master[id].name} bet ${master[id].bwg.bet} gbp that you would say "${master[id].bwg.current_word}"`)
                                message.channel.send(`${master[id].bwg.bet} has been taken from you and given to ${master[id].name}`)
                                banned.purchase(-2 * master[id].bwg.bet, id, message, master)
                                banned.purchase(1 * master[id].bwg.bet, user, message, master)
                                master[master[id].bwg.target].bwg.used_words.push(master[id].bwg.current_word)
                                unlock.tracker1(id, 40, 1, message, master, tracker)
                                banned.Reset(id, master, message)
                                //purchase/reset/add word to used words
                                win = 0
                            }else{
                                master[id].bwg.remaining_msgs = master[id].bwg.remaining_msgs - 1
                                if(master[id].bwg.remaining_msgs <= 0){
                                    //congradulations you didnt say the word
                                    //reset
                                    message.channel.send(`Congratulations. ${master[id].name} bet ${master[id].bwg.bet} gbp that you would say "${master[id].bwg.current_word}" and you didn't`)
                                    message.channel.send(`You win ${master[id].bwg.bet} gbp`)
                                    unlock.tracker1(master[id].bwg.target, 40, 1, message, master, tracker)
                                    banned.purchase(-1 * master[id].bwg.bet, user, message, master)
                                    banned.Reset(id, master, message)
                                }
                            }
                        }
                    }
                }
            }
            /*
            fs.writeFileSync ("./JSON/banned_word_game.json", JSON.stringify(bwg, null, 2), function(err) {
                if (err) throw err;
                console.log('complete');
                }
            );
            */
        }catch(err){
            console.log(err)
            message.channel.send('Error occurred in banned_word_game_counter.js')
        }
    }
}
