module.exports = {
    name: 'simmerdown',
    description: 'sends number of simmer downs',
    execute(message,args){
        const fs = require('fs');
        var main = fs.readFileSync('./text_files/simmer_down.txt','utf8');
        var name_count = main.split(",");
        var discrim_name_simmer = [];
        var just_names = [];
        var array = [];
        var person = args[1];

        try{
            for (i = 0; i < name_count.length; i++) {
                discrim_name_simmer[i] = name_count[i].split(" ");
            }
            //breaks .txt into individual discriminator/name/count groups
        
            for (i = 0; i < discrim_name_simmer.length; i++) {
                just_names[i] = String(discrim_name_simmer[i][1]);
            }    
        
            for (i = 0; i < discrim_name_simmer.length; i++) {
                array[i] = {discrim: discrim_name_simmer[i][0],
                            name: discrim_name_simmer[i][1],
                            count: discrim_name_simmer[i][2]}
            }
            //turns each group into an object array
        
            if (String(just_names).toLowerCase().includes(String(person).toLowerCase()) === true){
                for (i = 0; i < array.length; i++) {
                    if (String(array[i].name).toLowerCase() === person.toLowerCase()){
                        message.channel.send(`${array[i].name} has said "simmer down" ${array[i].count} time(s)`);
                    }
                }
                //Checks if given name is someone in the server and responds with number of times they have said simmer down if they exist
            }else{
                message.channel.send('Please specify a valid name after !simmerdown');
            }
        }catch(err){
            console.log(err)
            message.channel.send("Error Occured in simmerdown.js Buy");
        }
    }
}