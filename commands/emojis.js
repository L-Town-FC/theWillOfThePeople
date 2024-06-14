module.exports = {
    name: 'emojis',
    description: 'gives server emoji statistics',
    execute(message, args, emojisList, bot){
        var discordEmojisStruct = Array.from(message.guild.emojis.cache)
        message.channel.send('Number of custom emojis is: ' + discordEmojisStruct.length);
        
        //TODO: ADD FUNCTIONALITY TO EMOJI ADD/REMOVE/UPDATED HOOK IN INDEX.JS TO CHECK LIST EVERYTIME AN EMOJI IS ADDED/REMOVED/UPDATED. ALSO SHOULD TRIGGER ON BOOTUP
        const emoji = bot.emojis.cache.get(discordEmojisStruct[0][0])


        EmojiListSort(emojisList)

        if(args.length < 2){
            //Gives top 5 and bottom 5 emojis
            EmojiUsageList()
            return
        }

        if(args[1].ToLowerCase() == "all"){
            AllEmojiUsageList()
            return
        }

        HelpEmbed()
        return
    }
}

function EmojiUsageList(){
    //Will list top 5 emojis sorted from most used to lease used in top field
    //will list bottom 5 emojis from least used to most used in bottom field
    const embed = require('./Functions/embed_functions')
}

function AllEmojiUsageList(){
    //list out all emojis from top ranked to bottom in one list

}

function EmojiListSort(emojisList){
    console.log(emojisList)
    var temp = Object.keys(emojisList)
    var array = []
    for (let i = 0; i < temp.length; i++) {
        array[i] = emojisList[temp[i]]
    }
    
    array.sort((a,b) => b.count - a.count)
    console.log(array)
}