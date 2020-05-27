module.exports = {
    name: 'new21',
    description: 'A better blackjack',
    execute(message,args,total_money){
        const fs = require('fs');
        const Discord = require('discord.js');
        const suit = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11];
        //list of possible cards. Have multiple tens to account for J, Q, and K. 11 is for A
        const tens = ['10','J','Q','K']
        //used to convert 10s into other cards
        var new_bet = args[2];
        var min_bet = 25;
        var command = args[1];
        /*
        Game Status: 0 - No game ongoing
                    1 - Game ongoing
                    2 - Dealer has blackjack
                    3 - Player has blackjack
                    4 - Both have blackjack
                    5 - Player Busts
                    6 - Dealer Busts
                    7 - Player pushes
                    8 - Player Surrenders
                    9 - Player Split Options

        */

        if(typeof(master_list) == 'undefined'){
            var list = fs.readFileSync("./text_files/currency.txt",'utf8').split(",")
            var full_list = []
            for(i = 0; i < list.length; i++){
                full_list[i] = list[i].split(" ")
            }
            master_list = [];
            for (i = 0; i < list.length; i++){
                master_list[i] = {
                    name: full_list[i][1],
                    discriminator: full_list[i][0],
                    player_hand1: [],
                    player_dummy_hand1: [],
                    player_hand2: [],
                    player_dummy_hand2: [],
                    dealer_hand: [],
                    dealer_dummy_hand: [],
                    bet: "",
                    gameStatus: 0,
                    isStay: [false, true],
                    blackjack: false,
                    isSplit: false
                }
            }
        }
        for(i = 0; i < master_list.length; i++){
            if(master_list[i].discriminator == message.author.discriminator){
                player = i;
            }
        }
        
        switch (String(command).toLowerCase()){
            case 'deal':
                try{
                    if (typeof(new_bet) == 'undefined'){
                        message.channel.send("Please specify the amount of gbp you want to bet")
                    }else if(parseFloat(new_bet) > parseFloat(total_money)){
                        message.channel.send("You don't have enough gbp for that bet");
                    }else if(parseFloat(new_bet) < parseFloat(min_bet)){
                        message.channel.send(`You must bet at least ${min_bet} gbp`)
                    }else if(isNaN(parseFloat(new_bet)-1) == true){   
                        message.channel.send("Please use a number for your bet")
                    }else if(master_list[player].gameStatus !== 0){
                        message.channel.send("You are already playing a game")
                    }else{
                        master_list[player].bet = parseFloat(new_bet)
                        master_list[player].gameStatus = 1;
                        var card = [];
                        var dummycard = [];
                        for (i = 0; i < 4; i++) {
                            card[i] = suit[Math.floor(Math.random()*suit.length)];
                            //generates cards for dealer and player
                        }

                        // Test Cards
                        card[0] = 11;
                        card[1] = 11;
                        card[2] = 10;
                        card[3] = 10;
                        //

                        master_list[player].player_hand1 = [card[0], card[1]];
                        master_list[player].dealer_hand = [card[2], card[3]];

                        for (i = 0; i < card.length; i++) {
                            if (card[i] == 10){
                                dummycard[i] = tens[Math.floor(Math.random()*tens.length)];
                            }else if (card[i] == 11){
                                dummycard[i] = 'A';
                            }else{
                                dummycard[i] = card[i];
                            }
                        }

                        //Test Cards
                        //dummycard[0] = 'J'
                        //dummycard[1] = 'J'
                        //

                        master_list[player].player_dummy_hand1 = [dummycard[0], dummycard[1]]
                        master_list[player].dealer_dummy_hand = [dummycard[2], dummycard[3]]

                        Display_Status(master_list[player],message)
                        purchase(new_bet, message.author.discriminator) //uncomment this eventually

                        if(master_list[player].dealer_dummy_hand[0] == 'A'){
                            if(master_list[player].dealer_hand[1] == 10){
                                master_list[player].gameStatus = 2
                                var blackjack = true
                            }else{
                                message.channel.send("Dealer doesn't have blackjack")
                            }
                        }else if(sum(master_list[player].dealer_hand) == 21){
                            master_list[player].gameStatus = 2
                            var blackjack = true
                        }else{
                            var blackjack = false
                        }
                        if(sum(master_list[player].player_hand1) == 21){
                            if(blackjack == true){
                                master_list[player].gameStatus = 4
                            }else{
                                master_list[player].gameStatus = 3
                            }
                        }
                    }
                    /*Checks the various cases where a bet may be invalid such as when no bet is specified, you bet more gbp than you have
                    you bet less than the minimum bet, you use a non-number as a bet, and when you have already made a bet */
                }catch(err){
                    console.log(err)
                    message.channel.send("Error occured in new21.js Deal")
                }
            break;
            case 'hit':
                console.log(master_list[player])
                if(master_list[player].gameStatus == 1){
                    var cards = New_Card(suit,tens)
                    if(master_list[player].isStay[0] == true){
                        master_list[player].player_hand2.push(cards[0]);
                        master_list[player].player_dummy_hand2.push(cards[1]);
                        if(sum(master_list[player].player_hand2) > 21){
                            if (master_list[player].player_hand1.indexOf(11) !== -1){
                                master_list[player].player_hand1[master_list[player].player_hand1.indexOf(11)] = 1;
                            }else{
                                master_list[player].isStay[1] = true
                                master_list[player].gameStatus = 9
                            }
                        }
                    }else{
                        master_list[player].player_hand1.push(cards[0]);
                        master_list[player].player_dummy_hand1.push(cards[1]);
                        if(sum(master_list[player].player_hand1) > 21){
                            if (master_list[player].player_hand1.indexOf(11) !== -1){
                                master_list[player].player_hand1[master_list[player].player_hand1.indexOf(11)] = 1;
                                if(sum(master_list[player].player_hand1) > 21){
                                    master_list[player].player_hand1[master_list[player].player_hand1.indexOf(11)] = 1;
                                }
                            }else{
                                master_list[player].isStay[0] = true
                                if(master_list[player].isSplit == false){
                                    master_list[player].gameStatus = 5;
                                }
                            }
                        }
                    }
                    Display_Status(master_list[player], message);
                }else{
                    message.channel.send("There currently isn't a game being played");
                }
                console.log(master_list[player])
            break;
            case 'split':
                try{
                    if(parseFloat(total_money) >= parseFloat(master_list[player].bet)){
                        if(master_list[player].player_dummy_hand1[0] === master_list[player].player_dummy_hand1[1] && master_list[player].isSplit == false && master_list[player].player_hand1.length == 2){
                            var card_0 = master_list[player].player_hand1[0]
                            var card_1 = master_list[player].player_hand1[1]
                            var dummy_card_0 = master_list[player].player_dummy_hand1[0]
                            var dummy_card_1 = master_list[player].player_dummy_hand1[1]

                            var card = [];
                            var dummycard = [];
                            for (i = 0; i < 2; i++) {
                                card[i] = suit[Math.floor(Math.random()*suit.length)];
                                //generates cards for dealer and player
                            }

                            master_list[player].player_hand1 = [card_0, card[0]];
                            master_list[player].player_hand2 = [card_1, card[1]];

                            for (i = 0; i < card.length; i++) {
                                if (card[i] == 10){
                                    dummycard[i] = tens[Math.floor(Math.random()*tens.length)];
                                }else if (card[i] == 11){
                                    dummycard[i] = 'A';
                                }else{
                                    dummycard[i] = card[i];
                                }
                            }

                            master_list[player].player_dummy_hand1 = [dummy_card_0, dummycard[0]]
                            master_list[player].player_dummy_hand2 = [dummy_card_1, dummycard[1]]

                            //purchase(parseFloat(master_list[player].bet), message.author.discriminator);
                            //Uncomment out later
                            var bet = master_list[player].bet;
                            master_list[player].bet = `${bet}|${bet}`
                            master_list[player].isSplit = true;
                            
                            if(master_list[player].player_dummy_hand1[0] === 'Aasdf'){ //Set this to 'A' when done
                                master_list[player].isStay = [true, true]
                            }else{
                                master_list[player].isStay = [false, false]
                            }
                            
                            Display_Status(master_list[player],message)

                        }else if(master_list[player].isSplit == true){
                            message.channel.send("You can't resplit cards")
                        }else if(master_list[player].player_hand1.length > 2){
                            message.channel.send("You can't split after you have already hit")
                        }else if(master_list[player].gameStatus == 0){
                            message.channel.send("There currently isn't a hand being played")
                        }else{
                            message.channel.send("You can't split because your cards don't match")
                        }
                    }else{
                        message.channel.send("You don't have enough money to split")
                    }
                }catch(err){
                    console.log(err)
                    message.channel.send("Error occured in new21.js Split")
                }
            break;
            case 'doubledown':

            break;
            case 'status':
                try{
                    if(master_list[player].gameStatus == 1){
                        Display_Status(master_list[player],message)
                        console.log(master_list[player])
                    }else{
                        message.channel.send("There currently isn't a game being played")
                    }
                }catch(err){
                    console.log(err)
                    message.channel.send("Error occured in new21.js Status")
                }
            break;
            case 'stay':
                if(master_list[player].isStay[0] == true){
                    master_list[player].isStay[1] = true;
                }else{
                    master_list[player].isStay[0] = true;
                    Display_Status(master_list[player], message)
                }
                console.log(master_list[player].isStay)
            break;
            case 'surrender':
                if(master_list[player].player_hand1.length > 2){
                    message.channel.send("You can't surrender after you have already hit")
                }else if(master_list[player].isSplit == true){
                    message.channel.send("You can't surrender after you have already split")
                }else if(master_list[player].gameStatus == 0){
                    message.channel.send("There currently isn't a game being played")
                }else{
                    message.channel.send("Coward")
                    master_list[player].isStay[0] = true;
                }
            break;

            default:
                message.channel.send('Use "!21 help for a list of commands')
        }
        console.log(master_list[player].gameStatus)
    }
}


function purchase(bet_value, player) {
    try{
        const fs = require('fs');
        var user_and_currency = fs.readFileSync('./text_files/currency.txt','utf8').split(",");
        var user_money = [];
        var array = [];
        var final_array = [];

        for (i = 0; i < user_and_currency.length; i++) {
            user_money[i] = user_and_currency[i].split(" ");
        }
        //breaks .txt into individual person/money pairs

        for (i = 0; i < user_money.length; i++) {
            array[i] = {discrim: user_money[i][0],
                        name: user_money[i][1],
                        money: user_money[i][2]}
        }
        //turns each pair into an object array

        for (i = 0; i < array.length; i++) {
            if (array[i].discrim === player){
                array[i].money = String(parseFloat(array[i].money) - parseFloat(bet_value));
            }
        }
        //compares the current players name to all other server names to see where to attribute bet to
        
        for (j = 0; j < array.length; j++) {
            final_array[j] = array[j].discrim + " " + array[j].name + " " + array[j].money;
        }
        //converts object array back into normal array that can be easily written into a text file

        fs.writeFileSync('./text_files/currency.txt', final_array);
    }catch(err){
        console.log(err)
        message.channel.send("Error Occured in guessgame.js Purchase");
    }

}

function New_Card(suit, tens){
    try{
        var dummycard = "";
        var card = suit[Math.floor(Math.random()*suit.length)];
        if (card == 10){
            dummycard = tens[Math.floor(Math.random()*tens.length)];
        }else if (card == 11){
            dummycard = 'A';
        }else{
            dummycard = card;
        }
        return [card, dummycard]
    }catch(err){
        console.log(err)
        message.channel.send("Error occured in new21.js New_Card")
    }
}

function Display_Status(master_list, message){
    const Discord = require('discord.js')
    var current_bet = master_list.bet;
    var current_hand1 = master_list.player_dummy_hand1;
    var current_hand2 = master_list.player_dummy_hand2;
    var dealer_hand = master_list.dealer_dummy_hand;
    if(current_hand2.length == 0){
        var blackjack_stats = `Dealer's hand: ${dealer_hand[0]} ?\nPlayer's hand: ${current_hand1} \nCurrent bet: ${current_bet}`
    }else{
        var blackjack_stats = `Dealer's hand: ${dealer_hand[0]} ?\nPlayer's hand 1: ${current_hand1} \nPlayer's Hand 2: ${current_hand2} \nCurrent bet: ${current_bet}`
    }
    const blackjack_stats_embed = new Discord.RichEmbed()
    .addField('Status', blackjack_stats);
    message.channel.send(blackjack_stats_embed);
}

function sum(arr) {
    //function to sum hands
    var s = 0

    for (var j = 0; j < arr.length; j++){
        s = arr[j] + s;
    }
    return s;
}
