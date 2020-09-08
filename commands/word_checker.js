module.exports = {
    name: 'word_checker',
    description: 'checks messages for different words',
    execute(message, master, tracker){
        const unlock = require('./Functions/Achievement_Functions')
        try{
            if(message.author.bot == true){
                return
            }else{
                var args = String(message.content).toLowerCase().split(" ")
                if(args.includes('glizzy') == true){
                    unlock.tracker1(message.author.id, 54, 1, message, master, tracker)
                }
                if(message.channel.type === 'dm'){
                    unlock.tracker1(message.author.id, 55, 1, message, master, tracker)
                }
            }
        }catch(err){
            console.log(err)
            message.channel.send('Error occurred in word_checker.js')
        }

    }
}