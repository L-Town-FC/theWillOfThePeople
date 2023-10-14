module.exports = {
    name: 'kumikosays',
    description: 'does stuff with images',
    execute(message, args){
        const jimp = require('jimp')
        const Discord = require('discord.js')
        try{
            Single_Image_Text(message, args)
        }catch(err){
            console.log(err)
            message.channel.send('Error Occurred in kumikosays.js')
        }
        
    }
}

async function Single_Image_Text(message, args){
    const jimp = require('jimp')
    const Discord = require('discord.js')
    const template = await jimp.read('kumiko_template.png');
    const font = await jimp.loadFont(jimp.FONT_SANS_32_BLACK);
    var text = [""]
    var counter = 0
    args.shift()

    for(var i = 0; i < args.length; i++){
        text[counter] += args[i] + ' '

        if(text[counter].length > 15){
          counter++
          text[counter] = ""
        }
    }
    if(text.length > 5){
        message.channel.send('You have too many characters. The max is 5 lines of text or about 75 character')
    }else{
        for(var j = 0; j < text.length; j++){
            await template.print(font, 35, 105 + (j * 32), text[j]);
        }

        await template.writeAsync('kumiko_says.png')
        const meme = await new Discord.MessageAttachment('kumiko_says.png')
        try{
            await message.channel.bulkDelete(1)
        }catch(err){
            console.log("Can't delete DMs")
        }
        await message.channel.send(meme)
    }
}

function test(text){
    return text
}