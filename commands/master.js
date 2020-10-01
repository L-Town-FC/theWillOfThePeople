module.exports = {
    name: 'master',
    description: 'sends all files that need to be manually updated',
    execute(message,args){
        const fs = require('fs')
        const {Discord, Attachment} = require('discord.js')
        
        var money = new Attachment('./JSON/master.json');
        var tracker = new Attachment('./JSON/achievements_tracker.json')
        var stats = new Attachment('./JSON/stats.json')
        var insults = new Attachment('./JSON/insults_suggestions.json')
        var command_stats = new Attachment('./JSON/command_stats.json')
        message.channel.send(money)
        message.channel.send(tracker)
        message.channel.send(stats)
        message.channel.send(insults)
        message.channel.send(command_stats)
    }

}