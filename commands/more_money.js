module.exports = {
    name: 'more_money',
    description: 'gives 1 gbp every message',
    execute(message){

        const fs = require('fs');
        var final_array = [];
        var user_money = [];
        var array = [];
        var holdings = fs.readFileSync('./text_files/currency.txt','utf8');
        var user_and_currency = holdings.split(",");
        try{
            if(message.author.discriminator !== '9509'){
                if(message.content.startsWith("!") == false){
                    for (i = 0; i < user_and_currency.length; i++) {
                        user_money[i] = user_and_currency[i].split(" ");
                    }
                        //breaks .txt into individual person/money pairs
                    
                    for (i = 0; i < user_money.length; i++) {
                        array[i] = {discrim: user_money[i][0],
                                    name: user_money[i][1],
                                    money: user_money[i][2]}
                    }
                    
                    for (i = 0; i < array.length; i++){
                        if (array[i].discrim == message.author.discriminator){
                            array[i].money = Math.round((parseFloat(array[i].money) + 1)*100)/100;
                            //Rounds users money to nearest hundredth
                        }
                    }

                    for (j = 0; j < array.length; j++) {
                        final_array[j] = array[j].discrim + " " + array[j].name + " " + array[j].money;
                    }
                    //converts object array back into normal array that can be easily written into a text file
                
                    fs.writeFileSync('./text_files/currency.txt', final_array);
                }
            }
        }catch(err){
            console.log(err)
            message.channel.send("Error Occured in More_money.js");
        }
    }

}