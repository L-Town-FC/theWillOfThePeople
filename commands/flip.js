module.exports = {
    name: 'flip',
    description: 'flips coin',
    execute(message,args){
        const unlock = require('./Functions/Achievement_Functions')
        const fs = require('fs')
        master = JSON.parse(fs.readFileSync("./JSON/master.json", "utf-8"))
        try{
            result = Math.floor(Math.random()*2);
            if (parseInt(result) == 1){
                message.channel.send('Tails')
            }else{
                message.channel.send('Heads');
            }
            unlock.tracker1(message.author.id, 44, 1, 10, message, master)
        }catch(err){
            console.log(err)
            message.channel.send("Error Occured in flip.js Standings");
        }
    }
}