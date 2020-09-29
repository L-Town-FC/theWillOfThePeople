const { MessageAttachment } = require("discord.js")
const { Http2ServerRequest } = require("http2")

module.exports = {
    name: 'upload',
    description: 'says pong',
    execute(message, args){
        if(message.author.id == '450001712305143869'){
            const fs = require('fs')
            const Discord = require('discord.js')         
            test = new MessageAttachment(message, message.attachments)
            console.log('XXXXXXXXXXXXXXXXXXXXXXX\nXXXXXXXXXXXXXXXXXXXXXXX\nXXXXXXXXXXXXXXXXXXXXXXX')
            test2 = test.message.attachments.array()[0].url
            download(test2)
        }
    }
}

function download(url){
    let request = require(`request`);   
    const fs = require('fs')
    request.get(url)
        .on('error', console.error)
        .pipe(fs.createWriteStream('meme.txt'));
}
