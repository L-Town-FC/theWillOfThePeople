module.exports = {
    name: 'master',
    description: 'sends all files that need to be manually updated',
    execute(message,args){
        const fs = require('fs')
        const {Discord, Attachment} = require('discord.js')
        
        var money = new Attachment('./JSON/master.json');
        var lottery = new Attachment('./text_files/lottery_stats.txt')
        var insults = new Attachment('./text_files/insult_counter.txt')
        var boo = new Attachment('./text_files/boo.txt')
        var tracker = new Attachment('./JSON/achievements_tracker.json')
        //var bwg = new Attachment('./JSON/banned_word_game.json')
        var stats = new Attachment('./JSON/stats.json')
        message.channel.send(money)
        message.channel.send(lottery)
        message.channel.send(insults)
        message.channel.send(boo)
        message.channel.send(tracker)
        //message.channel.send(bwg)
        message.channel.send(stats)
    }

}