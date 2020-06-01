module.exports = {
    name: 'master',
    description: 'sends master.json',
    execute(message,args){
        const fs = require('fs')
        const {Discord, Attachment} = require('discord.js')
        
        var money = new Attachment('master.json');
        message.channel.send(money)
    }

}