module.exports = {
    name: 'boo_trigger',
    description: 'says pong',
    execute(message, command_stats){
        const fs = require('fs')
        const boo = command_stats.boo
        var chance = 4
        try{
            if(message.author.id == boo){
                if(message.content.startsWith("!") == false){
                    var rand = Math.ceil(Math.random() * chance)
                    if(rand == 2){
                        Trigger(message)
                    }
                }
            }
        }catch(err){
            console.log(err)
            message.channel.send("Error occurred in boo_trigger.js")
        }
    }
}

async function Trigger(message){
    await message.react('591022023489355787').catch(message.react('👎'))
}