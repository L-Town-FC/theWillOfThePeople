module.exports = {
    name: 'council',
    description: 'gets response from the council',
    execute(message,master, tracker){
        const unlock = require('./Functions/Achievement_Functions')
        try{

            //I Serve the Realm Achievement
            unlock.tracker1(message.author.id, 18, 1, message, master, tracker)
            
            var test = Math.floor(Math.random()*100);
            if (parseInt(test) != 50){
                message.channel.send('Play one more game of melee and ask again');
            }else{
                message.channel.send('lol Alex gay');
            }
        }catch(err){
            console.log(err)
            message.channel.send("Error Occurred in council.js");
        }
    }

}