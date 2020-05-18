module.exports = {
    name: 'assblast',
    description: 'assblasting and related commands',
    execute(message,args){
        var fs = require('fs');
        const Discord = require('discord.js');
        scores = [];
        names =[];
        player_and_scores = [];
        array = [];
        sorted_standings_objects = [];
        sorted_standings_array = [];
        just_names = [];

        switch (String(args[1]).toLowerCase()){
            case 'standings':
                try{
                    var standings = fs.readFileSync('./text_files/standings.txt','utf8');
                    var player_and_scores = standings.split(",");
                        //splits standings doc into player score pairs
                    for (i = 0; i < player_and_scores.length; i++) {
                        scores[i] = player_and_scores[i].split(" ");
                    }

                    for (i = 0; i < scores.length; i++) {
                        array[i] = {name: scores[i][0],
                                    score: scores[i][1]}
                    }
                        //turns player/score pairs into object array

                    sorted_standings_objects = array.sort((a, b) => b.score - a.score);
                    //sorts object array from largest to smallest

                    for (j = 0; j < sorted_standings_objects.length; j++) {
                        sorted_standings_array[j] = sorted_standings_objects[j].name + " " + sorted_standings_objects[j].score;
                    }

                    //converts array pieces into original text format
                    
                    const embed = new Discord.RichEmbed()
                    .addField('Standings', sorted_standings_array);
                    message.channel.send(embed);
                    //displays embed of standings

                    fs.writeFileSync('./text_files/standings.txt', sorted_standings_array);
                    //rewrites standings text file
                }catch(err){
                    console.log(err)
                    message.channel.send("Error Occured in assblast.js Standings");
                }

            break;

            case 'points':
                try{
                    var name = args[2];
                    var points = args[3];
                    var standings = fs.readFileSync('./text_files/standings.txt','utf8');
                    var player_and_scores = standings.split(",");
                    var final_array = [];

                    for (i = 0; i < player_and_scores.length; i++) {
                        scores[i] = player_and_scores[i].split(" ");
                    }

                    for (i = 0; i < scores.length; i++) {
                        just_names[i] = String(scores[i][0]).toLowerCase();
                    }
            
                    for (i = 0; i < scores.length; i++) {
                        array[i] = {name: scores[i][0],
                                    score: scores[i][1]}
                    }

                    if(just_names.includes(name.toLowerCase()) == true){
                        if(points == 0 || isNaN(points) == true){
                            message.channel.send("Please include a valid # of points")
                        }else{
                            for(i = 0; i < array.length; i++){
                                if(array[i].name.toLowerCase() == name.toLowerCase()){
                                    array[i].score = parseInt(array[i].score) + parseInt(points);
                                }
                            }
                            for (j = 0; j < array.length; j++) {
                                final_array[j] = array[j].name + " " + array[j].score;
                            }
                            fs.writeFileSync('./text_files/standings.txt', final_array);
                            message.channel.send("Standings have been updated");
                        }
                    }else{
                        message.channel.send("Please give a valid name");
                    }
                }catch(err){
                    console.log(err)
                    message.channel.send("Error Occured in assblast.js Points");
                }                
            break;

            case 'clear':
                try{
                    const clear = 'Colin 0,Ian 0,Wyatt 0,Carl 0,Jacob 0,Dylan 0'
                    fs.writeFileSync('./text_files/standings.txt', clear);
                    message.channel.send("The standings have been erased");
                    //resets the standings
                }catch(err){
                    console.log(err)
                    message.channel.send("Error Occured in assblast.js Clear");
                }
            break;

            case 'help':
                try{
                    var assblast_commands = fs.readFileSync('./text_files/assblast_commands.txt','utf8');
                    const help_embed = new Discord.RichEmbed()
                    .addField('List of Commands', assblast_commands);
                    message.channel.send(help_embed);
                    //creates embed from text file that contains all assblast commands
                }catch(err){
                    console.log(err)
                    message.channel.send("Error Occured in assblast.js Help");
                }
            break;

            default:
                message.channel.send('Use "!assblast help" for a list of commands');
        }

    }

}