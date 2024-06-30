module.exports = {
    name: 'update',
    description: 'updates the bots values with faunadb values',
    execute(message, fauna_token, location, master, stats_list, tracker, command_stats, emojisList){
        if(message.author.id == '450001712305143869'){
            try{
                master = Update(fauna_token, "master", location)
                stats_list = Update(fauna_token, "stats", location)
                tracker = Update(fauna_token, "tracker", location)
                command_stats = Update(fauna_token, "command_stats", location)
                emojisList = Update(fauna_token, "emojis", location)
                message.channel.send('Update Successful')
            }catch(err){
                console.log(err)
                message.channel.send('Error occurred in Update.js')
            }
        }

        async function Update(fauna_token, name, location){
            const faunadb = require('faunadb')
            const fauna_client = new faunadb.Client({ secret: fauna_token })
            const q = faunadb.query
            const fs = require('fs')
        
            //first checks if it should grab the dev or the prod bot's data
           if(location == 'local'){
                var prefix = 'dev'
            }else{
                var prefix = 'prod'
            }
            const jsons = JSON.parse(fs.readFileSync(`./JSON/${prefix}_faunadb.json`, 'utf-8'))
        
            //then checks the corresponding json file for the reference ids and grabs the correct data from faunadb
            var getP = await fauna_client.query(
                q.Get(q.Ref(q.Collection(`${prefix}_JSONs`), jsons[name]))
            ).then((response) => {
                switch(name){
                    case "master":
                        //delete master
                        master = response.data
                    return master
                    case "stats":
                        stats_list = response.data
                    return stats_list
                    case "tracker":
                        tracker = response.data
                    return tracker
                    case "command_stats":
                        command_stats = response.data
                    return command_stats
                    case "emojis":
                        emojisList = response.data
                    return emojisList
                }
            })
        }
    }
}