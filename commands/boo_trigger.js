module.exports = {
    name: 'boo_trigger',
    description: 'says pong',
    execute(message,args){
        const fs = require('fs')
        const boo = fs.readFileSync("./text_files/boo.txt")
        try{
            if(message.author.id == boo){
                if(message.content.startsWith("!") == false){
                    message.react('591022023489355787')
                }
            }
        }catch(err){
            console.log(err)
            message.channel.send("Error occured in boo_trigger.js")
        }
    }

}