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
        if(message.author.id !== '712114529458192495' && message.author.id !== '668996755211288595'){
            for(i in bwg){
                if(user == bwg[i].target){
                    //goes through every person on server and checks if they are a target.
                    //If they are it checks the message they send for a banned word
                    var word = bwg[i].current_word
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
                        message.channel.send("You said a banned word")
                        //purchase/reset/add word to used words
                        win = 0
                    }else{
                        bwg[id].remaining_msgs = bwg[id].remaining_msgs - 1
                        if(bwg[i].remaining_msgs <= 0){
                            //congradulations you didnt say the word
                            //reset
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
    }
}
