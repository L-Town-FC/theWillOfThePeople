module.exports = {
    name: 'update',
    description: 'updates the bots values with json files',
    execute(message, location, master, stats_list, tracker, command_stats, emojisList){
        if(message.author.id == '450001712305143869'){
            try{
                master = Update("master", location)
                stats_list = Update("stats", location)
                tracker = Update("tracker", location)
                command_stats = Update("command_stats", location)
                emojisList = Update("emojis", location)
                message.channel.send('Update Successful')
            }catch(err){
                console.log(err)
                message.channel.send('Error occurred in Update.js')
            }
        }

        async function Update(name, location){
            const fs = require('fs')
        
            //first checks if it should grab the dev or the prod bot's data
           if(location == 'local'){
                var prefix = 'dev'
            }else{
                prefix = 'prod'
            }
            const jsons = JSON.parse(fs.readFileSync(`./JSON/${prefix}.${name}.json`, 'utf-8'))
        
            return jsons[name]
        }
    }
}