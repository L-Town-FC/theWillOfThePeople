module.exports = {
    name: 'insults',
    description: 'lets you insults people',
    execute(message,args, master, tracker){
        const fs = require('fs')
        const general = require('./Functions/GeneralFunctions')
        const embed = require('./Functions/embed_functions')
        const price = 1500
        var targetID = general.NameToUserID(args[2] || "none", master)
        var command

        //args[1] is where the command is specified. if no command is specified then the command is set to "list" and processed later
        if(!args[1]){
            command = 'list'
        }else{
            command = String(args[1]).toLowerCase()
        }

        switch(command){
            case 'list':
                //lists the people currently being insulted by the bot
                try{
                    var insulted = []
                    for(var i in master){
                        if(master[i].insulted == true){
                            insulted.push(master[i].name)
                        }
                    }
                    var title = "List of Peope being Insulted"
                    var description = insulted
                    var fields = embed.emptyValue
                    const embedMessage = embed.EmbedCreator(message, title, description, fields)
                    message.channel.send({embeds: [embedMessage]})
                }catch(err){
                    console.log(err)
                    message.channel.send('Error occurred in insults.js list')
                }
            break;
            case 'on':
                //command to start insulting a specified person
                try{    
                    //checks the basics if a command can be run
                    if(!general.CommandUsageValidator(message, master, price, price, master[message.author.id].gbp, targetID)){
                        return;
                    }
                    
                    //checks if the specified person is already being insulted
                    if(master[targetID].insulted){
                        message.channel.send("They are already being insulted")
                        return
                    }

                    //executes payment for command
                    general.CommandPurchase(message, master, price, general.defaultRecipient)
                    
                    //executes command and confirmation
                    message.channel.send(`${master[targetID].name} is now being insulted`)
                    master[targetID].insulted = true

                    //checks variety of achievements related to insulting people
                    AchievementChecker(message, master, tracker, targetID);
                }catch(err){
                    console.log(err)
                    message.channel.send('Error occurred in insults.js on')
                }
            break;
            case 'off':
                try{                
                   
                    //checks the basics if a command can be run
                    if(!general.CommandUsageValidator(message, master, price, price, master[message.author.id].gbp, targetID)){
                        return;
                    }
                    
                    //checks if the specified person is already not being insulted
                    if(!master[targetID].insulted){
                        message.channel.send("They are not being insulted")
                        return
                    }

                    //executes payment for command
                    general.CommandPurchase(message, master, price, general.defaultRecipient)

                    //executes command and confirmation
                    message.channel.send(`${master[targetID].name} is no longer being insulted`)
                    master[targetID].insulted = false

                }catch(err){
                    console.log(err)
                    message.channel.send('Error occurred in insults.js off')
                }
            break;
            case 'help':
                //creates embded message for instructions on how to use the command
                try{
                    var title = "List of Commands"
                    var description = fs.readFileSync('./text_files/insults/insults_commands.txt','utf-8')
                    var fields = embed.emptyValue
                    const embedMessage = embed.EmbedCreator(message, title, description, fields)
                    message.channel.send({ embeds: [embedMessage] });
                }catch(err){
                    console.log(err)
                    message.channel.send('Error occurred in insults.js help')
                }
            break;
            default:
                message.channel.send('Use "!insults help" for a list of commands')
        }
    }
}


//checks variety of achievements and updates trackers and unlocks them as needed
function AchievementChecker(message, master, tracker, recipient_id){

    const unlock = require('./Functions/Achievement_Functions')

    if(recipient_id == message.author.id){
        //Masochist Achievement
        unlock.unlock(recipient_id, 22, message, master)
    }
    if(recipient_id == '462798271195119626'){
        //As God Intended Achievement
        unlock.unlock(message.author.id, 19, message, master)
    }
    //Professional Asshole  Achievement
    unlock.tracker1(message.author.id, 13, 1,  message, master, tracker)

    //Toxic Achievement
    unlock.tracker2(recipient_id, 20, 1, message, master, tracker)
}