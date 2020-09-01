module.exports = {
    name: 'info',
    description: 'Gives basic info about the bot',
    execute(message, args){
        const fs = require('fs')
        const Discord = require('discord.js')
        const embed = require('./Functions/embed_functions')
        const info = JSON.parse(fs.readFileSync('./JSON/info.json', 'utf-8'))
        const taxes = JSON.parse(fs.readFileSync('./JSON/taxes.json', 'utf-8'))
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
                        var tax_field = [
                            `20000-30000: ${taxes[1]}%`,
                            `30000-40000: ${taxes[2]}%`,
                            `40000-50000: ${taxes[3]}%`,
                            `50000-100000: ${taxes[4]}%`,
                            `>100000: ${taxes[5]}%`,
                        ]
                        info_embed.addField('**Tax Brackets**', tax_field)
                    break;
                    case '2':
                        //Interest
                        info_embed.addField('**Information**', `Everyday your banked gbp collects interest which is added to your account. If your collected gbp puts your over the bank limit it is discarded. The current interest rate is ${taxes.Interest}%`)
                    break;
                    case '3':
                        //Progressive GBP
                        var progressive_gbp = [
                            `<-10000: 50 gbp`,
                            `<-2500: 25 gbp`,
                            `<-1000: 10 gbp`,
                            `<0: 5 gbp`,
                            `<250: 3 gbp`,
                            `<750: 1 gbp`,
                            `<750: The chance of getting 1 gbp per message decreases until it reaches 25% at 1500 gbp`
                        ]
                        info_embed.addField('**Info**', progressive_gbp)
                    break;
                }

                message.channel.send(info_embed)
            }else{
                message.channel.send('Use !info for a list of all commands. Use !info [topic number] for more information about the specified topic')
            }
        }catch(err){
            console.log(err)
            message.channel.send('Error occured in info.js')
        }
    }
}
