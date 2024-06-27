module.exports = {
    name: 'emojis',
    description: 'gives server emoji statistics',
    execute(message, args, emojisList, bot){
        var discordEmojisStruct = Array.from(message.guild.emojis.cache)
        var emojisListArray = []
        
        //const emoji = bot.emojis.cache.get(discordEmojisStruct[0][0])
        emojisListArray = EmojiListSort(emojisList)

        if(args.length < 2){
            //Gives top 5 and bottom 5 emojis
            EmojiUsageList(message, emojisListArray, bot)
            return
        }
        
        //need to turn args[1] into its own variable to use ToLowerCase()
        var command = args[1];
        if(command.toString().toLowerCase() == "all"){
            AllEmojiUsageList(message, emojisListArray, bot)
            return
        }

        HelpEmbed(message)
        return
    }
}

function EmojiUsageList(message, emojiListArray, bot){
    //Will list top 5 emojis sorted from most used to lease used in top field
    //will list bottom 5 emojis from least used to most used in bottom field
    const embed = require('./Functions/embed_functions')
    
    //grabs the first 5 emojis of the sorted emoji array and lists them and their counts in order
    var topFive = {name: "Top Five Emoji Reactions",value: []}
    for (var i = 0; i < 10; i++) {
        //bot.emoji.. converts emoji id into actual emoji
        topFive.value[i] =  `${i}. ${bot.emojis.cache.get(emojiListArray[i][0])} - ${emojiListArray[i][1].count}`
    }
    var bottomFive = {name: "Bottom Five Emoji Reactions", value: []}

    //having it be "value of" is absolute necessity for this. Kept counting updward from 6 instead of downward
    //this loops over the sorted list and then adds the emoji plus the number of times its been used to a field object to be sent later
    counter = 0
    for (var i = emojiListArray.length - 1; i > emojiListArray.length - 11; i--) {
        //bot.emoji.. converts emoji id into actual emoji
       bottomFive.value[counter] =  `${(i + 1).valueOf()} . ${bot.emojis.cache.get(emojiListArray[i][0])} - ${emojiListArray[i][1].count}`
       counter++
    }

    var title = "Top and Bottom 5 emoji reactions"
    var description = embed.emptyValue
    var fields = [topFive, bottomFive]
    const embedMessage = embed.EmbedCreator(message, title, description, fields)
    message.channel.send({embeds: [embedMessage]})
}

function AllEmojiUsageList(message, emojiListArray, bot){
    //list out all emojis from top ranked to bottom in one list
    const embed = require('./Functions/embed_functions')

    var index = 0;
    var emojiIDAndCountArray = []
    for (var i = 0; i < emojiListArray.length; i++) {
        //bot.emoji.. converts emoji id into actual emoji
        //adds emojis and how many times its been reacted with to array to become embed message description later
        emojiIDAndCountArray[index] = `${index}. ${bot.emojis.cache.get(emojiListArray[i][0])} - ${emojiListArray[i][1].count}`
        counter++
    }

    var title = "All Emoji Reactions Usage Ranked"
    var description = emojiIDAndCountArray
    var fields = embed.emptyValue
    const embedMessage = embed.EmbedCreator(message, title, description, fields)
    message.channel.send({embeds: [embedMessage]})


}

function HelpEmbed(message){
    const embed = require('./Functions/embed_functions')

    var title = "List of Emoji Commands"
    var description = [
        "!emojis: Lists the top 5 and bottom 5 emojis based on their reaction usage",
        "!emojis all: Lists all emojis are their reaction usage in one list"
    ]
    var fields = embed.emptyValue

    const embedMessage = embed.EmbedCreator(message, title, description, fields)
    message.channel.send({embeds: [embedMessage]})
}

function EmojiListSort(emojisList){
    var temp = Object.keys(emojisList)
    var array = []
    for (let i = 0; i < temp.length; i++) {
        array[i] = [temp[i], emojisList[temp[i]]]
    }
    
    return array.sort((a,b) => b[1].count - a[1].count)
}