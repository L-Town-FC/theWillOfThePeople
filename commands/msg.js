const { POINT_CONVERSION_COMPRESSED } = require('constants')

module.exports = {
    name: 'msg',
    description: 'lets you anonymously dm people through the bot',
    execute(message, args, master){
        const unlock =require('./Functions/Achievement_Functions')
        const Discord = require('discord.js')
        try{
            var name = args[1] || 'none'
            var cost
            if(message.content.length > 54){
                cost = 50
            }else{
                cost = 25
            }

            if(message.attachments.size == 1){
                cost = 75
            }

            for(i in master){
                if(String(name).toLowerCase() == master[i].name.toLowerCase()){
                    var person = i
                }
            }
            if(String(name).toLowerCase() == 'prices'){
                Prices(message)
            }else if(master[message.author.id].gbp < cost){
                message.channel.send(`You need atleast ${cost} gbp to send this messages. Use "!msg prices" for a list of prices`)
            }else if(typeof(person) == 'undefined'){
                message.channel.send(`The recipient doesn't exist`)
            }else{
                var users = message.mentions._client.users.array()
                var cut_args = args.splice(2, args.length - 2)
                var new_msg = ""
                for(var i = 0; i < cut_args.length; i++){
                    new_msg += cut_args[i] + " "
                }
                if(new_msg !== "" && new_msg.startsWith("!") == false && message.attachments.size == 0){
                    for(var k in users){
                        //console.log(users[k])
                        if(users[k].id == person){
                            message.channel.send('Your message was sent')
                            users[k].send(new_msg)
                            master[message.author.id].gbp -= cost
                        }
                        if(person == message.author.id){
                            unlock.unlock(person, 50, message, master)
                        }
                    }
                }else if(new_msg.startsWith("!") == true){
                    message.channel.send(`You can't message someone a command`)
                }else if(message.attachments.size == 1){
                    var file_extension = message.attachments.array()[0].filename.split(".")[1]
                    var test = new Discord.MessageAttachment(message, message.attachments)
                    var url = test.message.attachments.array()[0].url
                    master[message.author.id].gbp -= cost
                    for(var k in users){
                        if(users[k].id == person){
                            var recipient = users[k]
                        }
                    }
                    download(url, file_extension, recipient, new_msg)
                }else if(message.attachments.size > 1){
                    message.channel.send(`You can't send more than 1 attachment in a message`)
                }else{
                    message.channel.send(`You can't send an empty message`)
                }
            }
        }catch(err){
            console.log(err)
            message.channel.send('Error occurred in msg.js')
        }
    }
}

async function download(url, name, recipient, new_msg){
    let request = require(`request`);   
    const Discord = require('discord.js')
    const fs = require('fs')
    var path
    if(path !== 'none'){
        var file = request.get(url)
        .on('error', console.error)
        .pipe(fs.createWriteStream(`msg_formats/msg.${name}`));
        setTimeout(function(){
            var attach = new Discord.Attachment(`msg_formats/msg.${name}`)
            recipient.send(`${new_msg}`,attach)
        },3000)
        
    }else{
        message.channel.send('No file uploaded')
    }
}

function Prices(message){
    const Discord = require('discord.js')
    const embed = require('./Functions/embed_functions')

    var price_embed = new Discord.RichEmbed()
    .setTitle('!msg Prices')
    .setColor(embed.Color(message))
    .setDescription([
        'Messages under 50 characters: 25 gbp',
        'Messages over 50 characters: 50 gbp',
        'Messages with an attachment: 75 gbp'
    ])
    message.channel.send(price_embed)
}