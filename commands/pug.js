module.exports = {
    name: 'pug',
    description: 'randomly generates pug pic',
    execute(message,args){
        const Discord = require('discord.js');
        const cheerio = require('cheerio');
        const request = require('request');
        const fs = require('fs');

        try{

            var options = {
                url: "http://results.dogpile.com/serp?qc=images&q=" + "pug",
                method: "GET",
                headers: {
                    "Accept": "text/html",
                    "User-Agent": "Chrome"
                }
            };
         
            request(options, function(error, response, responseBody) {
                if (error) {
                    return;
                }
         
         
                $ = cheerio.load(responseBody);
         
         
                var links = $(".image a.link");
         
                var urls = new Array(links.length).fill(0).map((v, i) => links.eq(i).attr("href"));
               
                console.log(urls);
         
                if (!urls.length) {
                   
                    return;
                }
         
                // Send result
                message.channel.send( urls[Math.floor(Math.random() * urls.length)]);
            });
            
            if(message.channel.name == `people’s-pugilism`){
                total_money(message.author.discriminator);
            }
        }catch(err){
            console.log(err)
            message.channel.send("Error Occured in Pug.js");
        }
    }
}

function total_money(person) {
    try{
        const fs = require('fs');
        var final_array = [];
        var user_money = [];
        var array = [];
        var holdings = fs.readFileSync('./text_files/currency.txt','utf8');
        var user_and_currency = holdings.split(",");
        
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
            if (array[i].discrim == person){
                array[i].money = parseFloat(array[i].money) + 5;
            }
        }

        for (j = 0; j < array.length; j++) {
            final_array[j] = array[j].discrim + " " + array[j].name + " " + array[j].money;
        }
        //converts object array back into normal array that can be easily written into a text file

        fs.writeFileSync('./text_files/currency.txt', final_array);
    }catch(err){
        console.log(err)
        message.channel.send("Error Occured in Pug.js Purchase");
    }
}