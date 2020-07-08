module.exports = {
    name: 'boo_trigger',
    description: 'says pong',
    execute(message){
        const fs = require('fs')
        const boo = fs.readFileSync("./text_files/boo.txt")
        var chance = 4
        try{
            if(message.author.id == boo){
                if(message.content.startsWith("!") == false){
                    var rand = Math.ceil(Math.random() * chance)
                    if(rand == 2){
                        message.react('591022023489355787')
                    }
                }
            }
        }catch(err){
            console.log(err)
            message.channel.send("Error occured in boo_trigger.js")
        }
    }

}