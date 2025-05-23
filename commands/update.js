module.exports = {
    name: 'update',
    description: 'updates the bots values with json files',
    execute(message, location, master, stats_list, tracker, command_stats, emojisList, containerPath){
        if(message.author.id == '450001712305143869'){
            try{
                Update("master", location, master, containerPath)
                Update("stats", location, stats_list, containerPath)
                Update("tracker", location, tracker, containerPath)
                Update("command_stats", location, command_stats, containerPath)
                Update("emojis", location, emojisList, containerPath)
                message.channel.send('Update Successful')
            }catch(err){
                console.log(err)
                message.channel.send('Error occurred in Update.js')
            }
        }

        async function Update(name, location, data = null, path){
            const fs = require('fs')
            // first checks if it should grab the dev or the prod bot's data
            let prefix = (location == 'local') ? 'dev' : 'prod'
            const filePath = path + `/${name}.${prefix}.json`

            if (data !== null) {
                // Write mode: save the provided data to the file
                fs.writeFileSync(filePath, JSON.stringify({ [name]: data }, null, 2), 'utf-8')
                return true
            } else {
                // Read mode: load and return the data
                const jsons = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
                return jsons[name]
            }
        }
    }
}