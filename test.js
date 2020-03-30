
var args = ['a','standings']
        var fs = require('fs');
        //const Discord = require('discord.js');
        scores = [];
        player_and_scores = [];
        array = [];
        sorted_standings_objects = [];
        sorted_standings_array = [];
        switch (String(args[1]).toLowerCase()){
            case 'standings':
                var standings = fs.readFileSync('standings.txt','utf8');
                console.log(standings);
                var player_and_scores = standings.split(",");
                for (i = 0; i < player_and_scores.length; i++) {
                    scores[i] = player_and_scores[i].split(" ");
                }

                for (i = 0; i < scores.length; i++) {
                    array[i] = {name: scores[i][0],
                                score: scores[i][1]}
                }

                
                sorted_standings_objects = array.sort((a, b) => b.score - a.score);
                console.log(sorted_standings_objects);

                for (j = 0; j < sorted_standings_objects.length; j++) {
                    sorted_standings_array[j] = sorted_standings_objects[j].name + " " + sorted_standings_objects[j].score;
                    //sorted_standings_array[j] = sorted_standings_objects[j].score;
                }
                console.log(sorted_standings_array);

                fs.writeFileSync('test.txt', sorted_standings_array);
                /*
                const embed = new Discord.RichEmbed()
                .addField('Standings', sorted_standings_array);
                message.channel.sendEmbed(embed);
                */
            break;
        }