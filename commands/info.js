module.exports = {
    name: 'info',
    description: 'Gives basic info about the bot',
    execute(message, args){
        const fs = require('fs')
        const Discord = require('discord.js')
        const embed = require('./Functions/embed_functions')
        const info = JSON.parse(fs.readFileSync('./JSON/info.json', 'utf-8'))
        var length = Object.keys(info).length
        try{
            if(!args[1]){
                var list = []
                for(i in info){
                    list.push(`${i}. ${info[i].name}`)
                }
                var info_embed = new Discord.RichEmbed()
                .setTitle('List of Commands')
                .setDescription(`Use "!info [number]" for more information about the selection`)
                .addField(`Topics:`, list)
                .setColor(embed.Color(message))
                message.channel.send(info_embed)
            }else if(parseInt(args[1]) == parseFloat(args[1]) && args[1] > 0 && args[1] <= length){
                var info_embed = new Discord.RichEmbed()
                .setTitle(`**${info[args[1]].name}**`)
                .setDescription(info[args[1]].description)
                .setColor(embed.Color(message))

                switch(args[1]){
                    //This will be where mutable information is added
                    case '1':
                        //Taxes
                    
                    break;
                    case '2':
                        //Interest

                    break;
                    case '3':
                        //Progressive GBP

                    break;
                }

                message.channel.send(info_embed)
            }else{
                message.channel.send('Use !nfo for a list of all commands. Use !info [topic number] for more information about the specified topic')
            }
        }catch(err){
            console.log(err)
            message.channel.send('Error occured in info.js')
        }
    }
}
