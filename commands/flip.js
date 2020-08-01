module.exports = {
    name: 'flip',
    description: 'flips coin',
    execute(message,master, tracker){
        const unlock = require('./Functions/Achievement_Functions')
        try{
            result = Math.floor(Math.random()*2);
            if (parseInt(result) == 1){
                message.channel.send('Tails')
            }else{
                message.channel.send('Heads');
            }
            unlock.tracker1(message.author.id, 44, 1, message, master, tracker)
        }catch(err){
            console.log(err)
            message.channel.send("Error Occurred in flip.js Standings");
        }
    }
}