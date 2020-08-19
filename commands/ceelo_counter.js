module.exports = {
    name: 'ceelo_counter',
    description: 'counts messages of people playing ceelo',
    execute(message, master){
        const fs = require('fs')
        var ceelo = JSON.parse(fs.readFileSync('./JSON/ceelo.json', 'utf-8'))
        var counter = 0
        try{
            if(message.content.startsWith("!") == false){
                for(var i in ceelo.games){
                    for(var j in ceelo.games[i].participants){
                        if(ceelo.games[i].participants[j][1] == 1){
                            counter += 1
                        }
                        if(ceelo.games[i].participants[j][0] == message.author.id){
                            //console.log(1)
                            if(ceelo.games[i].participants[j][1] == 0){
                                //console.log(2)
                                if(counter == j){
                                    //console.log(3)
                                    var id = j
                                    ceelo.games[i].message_counter -= 1
                                    if(ceelo.games[i].message_counter == 0){
                                        message.channel.send(`You took to long in ceelo. You lose your turn`)
                                        ceelo.games[i].participants[id][3] += 100
                                        ceelo.games[i].message_counter = 10
                                        if(ceelo.games[i].participants[id][3] > 50){
                                            ceelo.games[i].participants[id][1] = 1
                                            ceelo.games[i].participants[id][2] = -2
                                            message.channel.send('You ran ran out of rolls')
                                            var counter2 = 0
                                            for(var k in ceelo.games[i].participants){
                                                if(ceelo.games[i].participants[k][1] !== 1 && counter2 == 0){
                                                    message.channel.send(`It is now <@${ceelo.games[i].participants[k][0]}>'s turn`)
                                                }
                                            }
                                            Round_Over(message, i, ceelo, master)
                                        }
                                    }
                                    fs.writeFileSync ("./JSON/ceelo.json", JSON.stringify(ceelo, null, 2), function(err) {
                                        if (err) throw err;
                                        console.log('complete');
                                        }
                                    );
                                }
                            }
                        }
                    }
                }
            }
        }catch(err){
            console.log(err)
            message.channel.send('Error occurred in ceelo_counter.js')
        }
    }
}

function Round_Over(message, player_game, ceelo, master){
    //checks if the round of hands is over and if there are any ties
    try{
        var counter = 0
        var isOverCounter = 0
        var hand_values = []
        for(var i = 0; i < ceelo.games[player_game].participants.length; i++){
            counter++
            if(ceelo.games[player_game].participants[i][1] == 1){
                isOverCounter++
                hand_values.push(ceelo.games[player_game].participants[i][2])
            }
        }
        if(counter == isOverCounter){
            //games is over
            //check for tie
            var best = Math.max.apply(Math, hand_values)
            var isTie = find_duplicate_in_array(hand_values)
            //console.log(`hand_values is: ${hand_values}`)
            //console.log(`isTie is: ${isTie}`)
            //console.log(`best is: ${best}`)
            if(isTie !== [] && Math.max.apply(Math, isTie) == best){
                //There is a tie and it is with the largest value
                //Find all users with returned value and reset them. Put everyone else at turn number = 1 and a score of -2
                //if they have -2, don't reset them. It means there have been multiple rounds of ties
                for(var i in hand_values){
                    if(hand_values[i] == best){
                        ceelo.games[player_game].participants[i][1] = 0
                        ceelo.games[player_game].participants[i][2] = 0
                        ceelo.games[player_game].participants[i][3] = 0
                        ceelo.games[player_game].participants[i][4] = 0
                    }else{
                        ceelo.games[player_game].participants[i][1] = 1
                        ceelo.games[player_game].participants[i][2] = -2
                        ceelo.games[player_game].participants[i][3] = 0
                        ceelo.games[player_game].participants[i][4] = 0
                    }
                }
                message.channel.send('There was a tie. Next round begins')
            }else{
                //There is a definite winner
                console.log(best)
                console.log(ceelo.games[player_game].participants[0][0])
                for(var i = 0; i < ceelo.games[player_game].participants.length; i++){
                    master[ceelo.games[player_game].participants[i][0]].gbp -= ceelo.games[player_game].bet
                    if(ceelo.games[player_game].participants[i][2] == best){
                        var winner = ceelo.games[player_game].participants[i][0]
                        var amount = parseFloat(ceelo.games[player_game].participants.length * ceelo.games[player_game].bet)
                        master[winner].gbp += amount
                        message.channel.send(`${master[winner].name} won. They win ${amount - ceelo.games[player_game].bet}`)
                    }
                }
                delete ceelo.games[player_game]
            }
            
        }else{
            //game is not over
            //return something that says that
        }
        function find_duplicate_in_array(arra1) {
            var object = {};
            var result = [];
        
            arra1.forEach(item => {
            if(!object[item])
                object[item] = 0;
                object[item] += 1;
            })
        
            for (const prop in object) {
            if(object[prop] >= 2) {
                result.push(prop);
            }
            }
            return result;
        }
    }catch(err){
        console.log(err)
        message.channel.send('Error occurred in ceelo_counter.js Round Over')
    }
}