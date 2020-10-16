module.exports = {
    name: 'stonks',
    description: 'lets you check out the stonks market',
    execute(message){
        if(message.channel.id == '743269381768872087'){
        //stonks- 743269381768872087
        //test - 611276436145438769
            if(typeof(stocks_open) == 'undefined'){
                stocks_open = true
            }
            if(message.author.bot == true){
                //do nothing
            }else if(stocks_open == false){
                message.channel.bulkDelete(1)
                message.channel.send('The Stonks channel is currently closed. Please try again tomorrow at 9:30')
            }
        }
    }
}