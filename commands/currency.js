module.exports = {
    name: 'currency',
    description: 'sends currency.txt',
    execute(message,args){
        const fs = require('fs')
        const {Discord, Attachment} = require('discord.js')
        
        var money = new Attachment('./text_files/currency.txt');
        message.channel.send(money)
    }

}