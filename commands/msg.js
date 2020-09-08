module.exports = {
    name: 'msg',
    description: 'lets you anonymously dm people through the bot',
    execute(message, args, master){
        const unlock =require('./Functions/Achievement_Functions')
        try{
            var name = args[1] || 'none'
            if(message.content.length > 54){
                var cost = 100
            }else{
                var cost = 50
            }

            for(i in master){
                if(String(name).toLowerCase() == master[i].name.toLowerCase()){
                    var person = i
                }
            }
            if(master[message.author.id].gbp < cost){
                message.channel.send(`You need atleast ${cost} gbp to send this messages`)
            }else if(typeof(person) == 'undefined'){
                message.channel.send(`The recipient doesn't exist`)
            }else{
                var users = message.mentions._client.users.array()
                var cut_args = args.splice(2, args.length - 2)
                var new_msg = ""
                for(var i = 0; i < cut_args.length; i++){
                    new_msg += cut_args[i] + " "
                }
                if(new_msg !== "" && new_msg.startsWith("!") == false){
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
