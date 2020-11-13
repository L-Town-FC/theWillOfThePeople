module.exports = {
    name: 'ping',
    description: 'says pong',
    execute(message){
        //message.channel.send('pong');
        var temp_data = [[1,2,3], [2,3],[2,1],[3],[1,3],[2],[3],[2],[1,2,3]]
        var count = [[1,0],[2,0],[3,0]]
        var run_off = true
        var removed_choices = []
        var removed_index = 0
        var already_counted = false
        var to_be_removed = []
        while (run_off == true){
            for(var i = 0; i < temp_data.length; i++){
                for(var j = 0; j < temp_data[i].length;j++){
                    if(removed_choices.includes(temp_data[i][j]) == false && already_counted == false){
                        count[temp_data[i][0] - 1][1] += 1
                        already_counted = true
                    }
                    if(already_counted == false){
                        to_be_removed.push(i)
                    }
                }
                already_counted = false
            }
            for(var i in to_be_removed){
                temp_data.splice(i,1)
            }
            //console.log(count)
            //console.log(removed_choices)
            var winner = 0 //0 = none, 1 = winner>50%, 2 = winner = 50% (need to check for tie)
            var winning_choice = -1
            for(var i = 0; i < count.length; i++){
                console.log(count[i])
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
                //run_off = false
                message.channel.send('Run Off')
                var sorted_array = count.sort(function(a,b){return a[1] - b[1]})
                removed_choices.push(sorted_array[removed_index][0])
                removed_index++
                for(var i = 0;i < count.length; i++){
                    count[i] = [i + 1, 0]
                }
            }
        }
    }
}
