const { MessageAttachment } = require("discord.js")


module.exports = {
    name: 'upload',
    description: 'says pong',
    execute(message, args){
        if(message.author.id == '450001712305143869'){
            const fs = require('fs')
            const Discord = require('discord.js')         
            test = new MessageAttachment(message, message.attachments)
            url = test.message.attachments.array()[0].url
            name = test.message.attachments.array()[0].filename
            try{
            download(url, args[1])
            }catch(err){
                console.log(err)
                message.channel.send('Error occurred in upload.js')
            }
        }
    }
}

function download(url, name){
    let request = require(`request`);   
    const fs = require('fs')
    var path
    console.log(name)
    switch(name){
        case 'master':
            console.log('master')
            path = 'JSON/master.json'
        break;
        case 'players':
            console.log('insults')
            path = 'JSON/RPG/players.json'
        break;
        case 'stats':
            console.log('stats')
            path = 'JSON/stats.json'
        break;
        case 'tracker':
            console.log('tracker')
            path = 'JSON/achievements_tracker.json'
        break;
        default:
            path = 'none'
    }
    if(path !== 'none'){
        request.get(url)
        .on('error', console.error)
        .pipe(fs.createWriteStream(path));

        setTimeout(function(){
            var_overwrite(path, name)
        },3000)
    }else{
        message.channel.send('No file uploaded')
    }
}

function var_overwrite(path, name){
    const fs = require('fs')
    switch(name){
        case 'master':
            master = JSON.parse(fs.readFileSync(`./${path}`, 'utf-8'))
        break;
        case 'players':
            players = JSON.parse(fs.readFileSync(`./${path}`, 'utf-8'))
        break;
        case 'tracker':
            tracker = JSON.parse(fs.readFileSync(`./${path}`, 'utf-8'))
        break;
        case 'stats':
            stats_list = JSON.parse(fs.readFileSync(`./${path}`, 'utf-8'))
        break;

    }
}