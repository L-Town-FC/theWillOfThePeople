function create(message, args, master, players){
    const fs = require('fs')
    const Discord = require('discord.js')

    for(var i in players){
        if(i == message.author.id){
            message.channel.send('You have already created a character')
        }
    }

}

module.exports.create = create