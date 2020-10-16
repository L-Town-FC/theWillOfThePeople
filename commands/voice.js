const { VoiceChannel } = require("discord.js")

module.exports = {
    name: 'voice',
    description: 'lets the bot talk in voice chat',
    execute(message, args){
        const Discord = require('discord.js')
        const tts = require('discord-tts')
        const voiceChannel = message.member.voiceChannel;
            voiceChannel.join().then(connection => {
                const stream = tts.getVoiceStream("Thats kinda gay not gonna lie");
                const dispatcher = connection.playArbitraryInput(stream)
                dispatcher.on("finish",()=>voiceChannel.leave())
            });  
    }
}