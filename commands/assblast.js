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
                console.log(sorted_standings_array);
                
                const embed = new Discord.RichEmbed()
                .addField('Standings', sorted_standings_array);
                message.channel.send(embed);
                //displays embed of standings

                fs.writeFileSync('./text_files/standings.txt', sorted_standings_array);
                //rewrites standings text file

            break;

            case 'place':
                var standings = fs.readFileSync('./text_files/standings.txt','utf8');
                var player_and_scores = standings.split(",");


                for (i = 0; i < player_and_scores.length; i++) {
                    scores[i] = player_and_scores[i].split(" ");
                }

                for (i = 0; i < scores.length; i++) {
                    just_names[i] = String(scores[i][0]).toLowerCase();
                }

                for (i = 2; i < args.length; i++) {
                    names[i-2] = String(args[i]).toLowerCase();
                }
            
                console.log(just_names);
                console.log(names);

                for (i = 0; i < scores.length; i++) {
                    array[i] = {name: scores[i][0],
                                score: scores[i][1]}
                }

                if(just_names.includes(names[0]) === true && just_names.includes(names[1]) === true && just_names.includes(names[2]) === true){
                    for (i = 0; i < array.length; i++) {
                        if(array[i].name.toLowerCase() === names[0]){
                            array[i].score = String(parseInt(array[i].score) + 4);
                        }
                        else if(array[i].name.toLowerCase() === names[1]){
                            array[i].score = String(parseInt(array[i].score) + 2);
                        }
                        else if(array[i].name.toLowerCase() === names[2]){
                            array[i].score = String(parseInt(array[i].score) + 1);
                        }
                        //checks if each given name location in the message to assign points to the standings

                    }
                    message.channel.send("Standings have been updated"); 
                }else{
                    message.channel.send('Please Give 3 Valid Names');
                }
                for (j = 0; j < array.length; j++) {
                    sorted_standings_array[j] = array[j].name + " " + array[j].score;
                    //joins info together to make it possible to rewrite text file
                }

                fs.writeFileSync('./text_files/standings.txt', sorted_standings_array);

            break;

            case 'clear':
                const clear = 'Colin 0,Ian 0,Wyatt 0,Carl 0,Jacob 0,Dylan 0'
                fs.writeFileSync('./text_files/standings.txt', clear);
                message.channel.send("The standings have been erased");
                //resets the standings
            break;

            case 'help':
                var assblast_commands = fs.readFileSync('./text_files/assblast_commands.txt','utf8');
                const help_embed = new Discord.RichEmbed()
                .addField('List of Commands', assblast_commands);
                message.channel.send(help_embed);
                //creates embed from text file that contains all assblast commands
            break;

            default:
                message.channel.send('Use "!assblast help" for a list of commands');
        }

    }

}