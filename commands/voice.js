module.exports = {
    name: 'voice',
    description: 'lets the bot talk in voice chat',
    execute(message, args, master){
        const Discord = require('discord.js')
        const tts = require('discord-tts')
        const cost = 75
        const fs = require('fs')
        if(typeof(talking) == 'undefined'){
            talking = false
        }
        
        if(talking == false){
            if(master[message.author.id].gbp >= cost){
                talking = true
                master[message.author.id].gbp -= 75
                var insult_list = JSON.parse(fs.readFileSync('./JSON/insults.json', 'utf-8')).list
                var insult = insult_list[Math.floor(Math.random() * insult_list.length)]
                setTimeout(function(){
                    const voiceChannel = message.member.voiceChannel;
                    voiceChannel.join().then(connection => {
                        const stream = tts.getVoiceStream(insult);
                        const dispatcher = connection.playArbitraryInput(stream)
                        //dispatcher.on("finish",()=>voiceChannel.leave())
                        dispatcher.on("finish", setTimeout(function(){
                            connection.disconnect()
                            talking = false
                            }, 7000)
                        )
                    }); 
                },200)
                
                //console.log(bot.voice.connections)
            }
        }
    }
}
