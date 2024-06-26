module.exports = {
    name: 'kumikosays',
    description: 'does stuff with images',
    execute(message, args, bot){
        try{
            Single_Image_Text(message, args, bot)
        }catch(err){
            console.log(err)
            message.channel.send('Error Occurred in kumikosays.js')
        }
        
    }
}

async function Single_Image_Text(message, args, bot){
    const jimp = require('jimp')
    const {AttachmentBuilder} = require('discord.js')
    const template = jimp.read('kumiko_template.png');
    const font = await jimp.loadFont(jimp.FONT_SANS_32_BLACK);
    var text = [""]
    var counter = 0
    args.shift()

    //converts args into sentences
    //if the sentence is over 15 characters long it needs to be broken up so it doesnt go off the image
    for(var i = 0; i < args.length; i++){
        text[counter] += args[i] + ' '

        if(text[counter].length > 15){
          counter++
          text[counter] = ""
        }
    }

    //if the sent text is too long it rejects the message
    if(text.length > 5){
        message.channel.send('You have too many characters. The max is 5 lines of text or about 75 character')
        return
    }

    for(var j = 0; j < text.length; j++){
        (await template).print(font, 35, 105 + (j * 32), text[j])
    }

    (await template).writeAsync('kumiko_says.png')
    var kumikoImage = `kumiko_says.png`
    const file = await new AttachmentBuilder(kumikoImage);

    //returns null when in dms
    if(message.guild != null){
        message.channel.send({files: [file] });
        return
    }

    var recipient = bot.users.cache.find(user => user.id == message.author.id)
    recipient.send({files: [file] })
    return
}
