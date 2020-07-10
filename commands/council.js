module.exports = {
    name: 'council',
    description: 'gets response from the council',
    execute(message,master){
        const fs = require('fs')
        const unlock = require('./Functions/Achievement_Functions')
        try{
            unlock.tracker1(message.author.id, 18, 1, message, master)
            test = Math.floor(Math.random()*100);
            if (parseInt(test) != 50){
                message.channel.send('Play one more game of melee and ask again');
            }else{
                message.channel.send('lol Alex gay');
            }
        }catch(err){
            console.log(err)
            message.channel.send("Error Occured in council.js");
        }
    }

}