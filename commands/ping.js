module.exports = {
    name: 'ping',
    description: 'says pong',
    execute(message){
        //message.channel.send('pong');
        
        var temp_data = [[1,2,3,4],[2,3,4],[4,2],[2,3,1],[4,2,1],[3,2,4],[1,2,4],[4,2,3],[1,2],[4,2],[4,1],[2,1],[3,2,1],[4,3,1],[2,4,1],[1,4,3]]
        var count = [[1,0],[2,0],[3,0],[4,0]]
        var run_off = true
        var removed_choice
        var removed_index = 0
        var already_voted = false
        
        while (run_off == true){
            for(var i = 0; i < temp_data.length; i++){
                for(var j = 0; j < temp_data[i].length;j++){
                    if(already_voted == false){
                        count[temp_data[i][0] - 1][1] += 1  
                        already_voted = true
                    }  
                }
                already_voted = false
            }

            console.log(count)
            var winner = 0 //0 = none, 1 = winner>50%, 2 = winner = 50% (need to check for tie)
            var winning_choice = -1
            for(var i = 0; i < count.length; i++){
                if(count[i][1]/temp_data.length > 0.5){
                    var winner = 1
                    winning_choice = i
                }else if(count[i][1]/temp_data.length == 0.5){
                    var winner = 2
                    if(winning_choice !== -1){
                        winning_choice = 99
                    }else{
                        winning_choice = i
                    }
                }
            }
            if(winner == 1){
                message.channel.send(`${count[winning_choice][0]} was the winner`)
                run_off = false
            }else if(winner == 2){
                if(winning_choice == 99){
                    message.channel.send(`There is a tie`)
                    run_off = false
                }else{
                    message.channel.send(`${count[winning_choice][0]} was the winner`)
                    run_off = false
                }
            }else{
                //run off
                message.channel.send('Run Off')
                var sorted_array = count.sort(function(a,b){return a[1] - b[1]})
                removed_choice = sorted_array[removed_index][0]
                removed_index++
                for(var i = temp_data.length - 1; i > -1; i--){
                    for(var j = temp_data[i].length - 1; j > -1; j--){
                        if(temp_data[i][j] == removed_choice){
                            temp_data[i].splice(j,1)
                        }
                    }
                    if(temp_data[i] == '[]'){
                        temp_data.splice(i,1)
                    }
                }
                for(var i = 0; i < count.length; i++){
                    count[i] = [i + 1,0]
                }
            }
        }
    }
}
