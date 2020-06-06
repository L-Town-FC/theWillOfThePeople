module.exports = {
    name: 'master',
    description: 'sends all files that need to be manually updated',
    execute(message,args){
        const fs = require('fs')
        const {Discord, Attachment} = require('discord.js')
        
        var money = new Attachment('master.json');
        var lottery = new Attachment('./text_files/lottery_stats.txt')
        var insults = new Attachment('./text_files/insult_counter.txt')
        var boo = new Attachment('./text_files/boo.txt')
        message.channel.send(money)
        message.channel.send(lottery)
        message.channel.send(insults)
        message.channel.send(boo)
    }

}