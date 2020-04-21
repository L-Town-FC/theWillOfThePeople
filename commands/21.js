module.exports = {
    name: '21',
    description: 'plays black jack',
    execute(message,args,total_money){
        const fs = require('fs');
        const Discord = require('discord.js');
        const suit = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11];
        //list of possible cards. Have multiple tens to account for J, Q, and K. 11 is for A
        const tens = ['10','J','Q','K']
        //used to convert 10s into other cards
        var isStay = false;
        var isPlayerbust = false;
        var isDealerbust = false;
        var gameongoing = false;
        var blackjack = false;
        var bet = args[2];
        var gambler = message.author.discriminator;
        var min_bet = 25;
        card = [];
        dummycard = [];

        switch (String(args[1]).toLowerCase()){
            case 'deal':
                if (typeof(player_hand_value) == 'undefined'){
                    //if no hands exist then a hand may be started
                    if(typeof(bet) == 'string' && parseFloat(bet) > min_bet && parseFloat(bet) < parseFloat(total_money)){
                        //if no bet is made then hand cant be started
                        bet2 = bet;
                        //hold bet value so it can't be overwritten until new deal
                        var i;
                        for (i = 0; i < 4; i++) {
                            card[i] = suit[Math.floor(Math.random()*suit.length)];
                            //generates cards for dealer and player
                        }

                        //card[0] = 10;
                        //card[1] = 11;
                        //card[2] = 10;
                        //card[3] = 11;
                        //dummy cards that can be used for testing


                        player_hand_value = [card[0], card[1]];
                        dealer_hand_value = [card[2], card[3]];
                        //actual value of cards. Used for calculations

                        var i;
                        for (i = 0; i < card.length; i++) {
                            if (card[i] == 10){
                                dummycard[i] = tens[Math.floor(Math.random()*tens.length)];
                            }else if (card[i] == 11){
                                dummycard[i] = 'A';
                            }else{
                                dummycard[i] = card[i];
                            }
                        }
                        
                        player_hand = [dummycard[0], dummycard[1]];
                        dealer_hand = [dummycard[2], '?'];
                        dealer_hand2 = [dummycard[2], dummycard[3]];
                        //dummy cards that convert the values into face cards if needed. No calculations are done with these
                        //automatically makes second dealer card face down

                        message.channel.send(`Dealer's hand: ${dealer_hand[0]} ${dealer_hand[1]}`);
                        message.channel.send(`Player's hand: ${player_hand[0]} ${player_hand[1]}`);
                        //Shows player and dealers hands

                        if (dealer_hand_value[0] == 11){
                            if (dealer_hand_value[1] == 10){
                                isStay = true;
                            }else{
                                message.channel.send("Dealer doesn't have Blackjack")
                            }
                        }else if (dealer_hand_value[0] == 10){
                            if (dealer_hand_value[1] == 11){
                                isStay = true;
                            }
                        }
                        //Checks if dealer has blackjack and responds accordingly
                        if (sum(player_hand_value) == 21){
                            isStay = true;
                            message.channel.send('Player has Blackjack')
                            blackjack = true;
                            bet2 = parseFloat(bet2) * 1.5;
                        }
                    }else{
                        message.channel.send(`Please place a valid bet greater than ${min_bet} gbp`);
                    }
                }else{
                    message.channel.send('Hand is already ongoing');
                }
            break;

            case 'hit':
                if (typeof(player_hand_value) == 'undefined'){
                    message.channel.send("There isn't an ongoing hand");
                    //checks if hand is currently ongoing
                }else{

                    if (sum(player_hand_value) > 21){
                        if (player_hand_value.indexOf(11) !== -1){
                            player_hand_value[player_hand_value.indexOf(11)] = 1;
                        }else{
                            message.channel.send('Player busts');
                            isPlayerbust = true;
                        }
                    }
                    //checks if player is above 21. If they have an ace its value becomes 1 
                    //If they don't have an ace they busted

                    
                    i = card.length + 1;
                    card[i] = suit[Math.floor(Math.random()*suit.length)];
                    player_hand_value.push(card[i]);
                    if (card[i] == 10){
                        dummycard[i] = tens[Math.floor(Math.random()*tens.length)];
                    }else if (card[i] == 11){
                        dummycard[i] = 'A';
                    }else{
                        dummycard[i] = card[i];
                    }
                    //generates a new card for the player. If the card is a 10 it turns it into either a 10, J, Q, or King
                    //If the card is an 11 it converts it into an ace. Otherwise the card doesn't change
                    
                    player_hand.push(dummycard[i]);
                    message.channel.send(`Player's hand: ${player_hand.join()}`);
                    //adds card to players hand and send message with contents of hand to player


                    if (sum(player_hand_value) > 21){
                        if (player_hand_value.indexOf(11) !== -1){
                            player_hand_value[player_hand_value.indexOf(11)] = 1;
                        }else{
                            message.channel.send('Player busts');
                            isStay = true;
                            isPlayerbust = true;
                        }
                    }
                    //checks if player is above 21. If they have an ace its value becomes 1 
                    //If they don't have an ace they busted

                }

            break;

            case 'doubledown':

                if (typeof(player_hand_value) == 'undefined'){
                    message.channel.send("There isn't an ongoing hand");
                }else if(player_hand.length > 2){
                    message.channel.send("You can't double down after you have already hit once");
                }else{
                    bet2 = parseFloat(bet2) * 2;
                    i = card.length + 1;
                    card[i] = suit[Math.floor(Math.random()*suit.length)];
                    player_hand_value.push(card[i]);
                    if (card[i] == 10){
                        dummycard[i] = tens[Math.floor(Math.random()*tens.length)];
                    }else if (card[i] == 11){
                        dummycard[i] = 'A';
                    }else{
                        dummycard[i] = card[i];
                    }
                    //generates a new card for the player. If the card is a 10 it turns it into either a 10, J, Q, or King
                    //If the card is an 11 it converts it into an ace. Otherwise the card doesn't change
                    
                    player_hand.push(dummycard[i]);
                    message.channel.send(`Player's hand: ${player_hand.join()}`);
                    //adds card to players hand and send message with contents of hand to player


                    if (sum(player_hand_value) > 21){
                        if (player_hand_value.indexOf(11) !== -1){
                            player_hand_value[player_hand_value.indexOf(11)] = 1;
                        }else{
                            message.channel.send('Player busts');
                            isPlayerbust = true;
                        }
                    }
                    //checks if player is above 21. If they have an ace its value becomes 1 
                    //If they don't have an ace they busted
                    isStay = true;
                }
            break;

            case 'split':
                message.channel.send('split');
            break;

            case 'stay':
                if (typeof(player_hand_value) == 'undefined'){
                    message.channel.send("There isn't an ongoing hand");
                }else{
                    isStay = true;
                }

            break;

            case 'hands':
                if (typeof(player_hand_value) == 'undefined'){
                    message.channel.send("There isn't an ongoing hand")
                }else{
                    message.channel.send(`Dealer's hand: ${dealer_hand}`);
                    message.channel.send(`Player's hand: ${player_hand}`);
                }
                //checks if there is an ongoing hand. If there is it responds with the current hands
            break;

            case 'help':
                var blackjack_commands = fs.readFileSync('./text_files/blackjack_commands.txt','utf8');
                const help_embed = new Discord.RichEmbed()
                .addField('List of Commands', blackjack_commands);
                message.channel.send(help_embed);
            break;

            default:
                message.channel.send('Use "!21 help" for a list of commands');

        }

        if (isStay == true && isPlayerbust == false){
            message.channel.send(`Dealer's hand: ${dealer_hand2}`);
            //checks if the player has stayed and if the payer has busted
            //reveals the dealers full hand
            if (dealer_hand_value.length == 2 && sum(dealer_hand_value) == 21){
                message.channel.send('Dealer has Blackjack');
                //checks if dealer has blackjack
            }else{
                //makes sure it doesn't register two aces as busting
                if (sum(dealer_hand_value) > 21){
                    if (dealer_hand_value.indexOf(11) !== -1){
                        dealer_hand_value[dealer_hand_value.indexOf(11)] = 1;
                    }else{
                        message.channel.send('Dealer busts');
                        gameongoing = false;
                        isDealerbust = true;
                    }
                }
                
                //if the dealer doesn't have blackjack the dealer gains cards until its over 17
                while (sum(dealer_hand_value) < 17 && blackjack == false){
                    i = i + 1;
                    card[i] = suit[Math.floor(Math.random()*suit.length)];
                    dealer_hand_value.push(card[i]);
                    if (card[i] == 10){
                        dummycard[i] = tens[Math.floor(Math.random()*tens.length)];
                    }else if (card[i] == 11){
                        dummycard[i] = 'A';
                    }else{
                        dummycard[i] = card[i];
                    }
                    dealer_hand2.push(dummycard[i]);
                    message.channel.send(`Dealer's hand: ${dealer_hand2}`);
                    if (sum(dealer_hand_value) > 21){
                        if (dealer_hand_value.indexOf(11) !== -1){
                            dealer_hand_value[dealer_hand_value.indexOf(11)] = 1;
                        }else{
                            message.channel.send('Dealer busts');
                            gameongoing = false;
                            isDealerbust = true;
                        }
                    }   
                }
            }
        }else if (isStay == true && isPlayerbust == true){
            message.channel.send(`Dealer's hand: ${dealer_hand2}`);
            gameongoing = false;
            //checks if player busted
        }
        if (isStay == true && gameongoing == false){
            isStay = false;

            //checks if either player busted
            //deletes dealt card array so new hand can be started
            if (isPlayerbust == true){
                message.channel.send(`Dealer wins`);
                betting(bet2, 'lose', gambler);
                delete(player_hand_value);
            }else if (isDealerbust == true){
                message.channel.send('Player wins');
                betting(bet2, 'win', gambler);
                delete(player_hand_value);
            }else{
                //if neither player nor dealer busted both hands are compared to see who won
                
                if (sum(player_hand_value) > sum(dealer_hand_value)){
                    message.channel.send('Player wins');
                    betting(bet2, 'win', gambler);
                    delete(player_hand_value);
                }else if (sum(player_hand_value) < sum(dealer_hand_value)){
                    message.channel.send('Dealer wins');
                    betting(bet2, 'lose', gambler);
                    delete(player_hand_value);
                }else{
                    message.channel.send('Players pushes');
                    betting(bet2, 'push', gambler);
                    delete(player_hand_value);
                }
            }
        }
    }
}


function sum(arr) {
    //function to sum hands
    var s = 0

    for (var j = 0; j < arr.length; j++){
        s = arr[j] + s;
    }
    return s;
}

function betting(bet_value, outcome, player) {
    const fs = require('fs');
    var holdings = fs.readFileSync('./text_files/currency.txt','utf8');
    var user_and_currency = holdings.split(",");
    var user_money = [];
    var just_discrim = [];
    var array = [];
    var final_array = [];

    switch(outcome){
        //checks outcome to apply proper muliplier to bet
        case 'win':
            bet_value = parseFloat(bet_value);
        break;

        case 'lose':
            bet_value = parseFloat(bet_value) * -1
        break;

        case 'push':
            bet_value = 0;
        break;
    }

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
        just_discrim[i] = array[i].discrim;
    }
    //assigns just the names in the object array to another array that can be used to cross reference the current players name
    
    for (i = 0; i < array.length; i++) {
        if (just_discrim[i] === player){
            array[i].money = String(parseFloat(array[i].money) + parseFloat(bet_value));
        }
    }
    //compares the current players name to all other server names to see where to attribute bet to
    

    for (j = 0; j < array.length; j++) {
        final_array[j] = array[j].discrim + " " + array[j].name + " " + array[j].money;
    }
    //converts object array back into normal array that can be easily written into a text file

    fs.writeFileSync('./text_files/currency.txt', final_array);
}