module.exports = {
    name: '21',
    description: 'A better blackjack',
    execute(message,args,total_money, master, stats_list, tracker){
        const fs = require('fs');
        const Discord = require('discord.js');
        const unlock = require('./Functions/Achievement_Functions')
        const stats = require('./Functions/stats_functions')
        const embed = require('./Functions/embed_functions')
        const general = require('./Functions/GeneralFunctions')
        const suit = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11];
        const suits = [':diamonds:',':hearts:',':spades:',':clubs:']
        //list of possible cards. Have multiple tens to account for J, Q, and K. 11 is for A
        const tens = ['10','J','Q','K']
        //used to convert 10s into other cards
        var new_bet = args[2];
        var match = args[3];
        var min_bet = 15;
        var command = args[1];

        //when the bot first boots up this list doesnt exist and needs to be created
        //this is the master list for all players all hands and games are tracked here
        if(typeof(master_list) == 'undefined'){
            master_list = []; 
            var counter = 0
            for (i in master){
                master_list[counter] = {
                    name: master[i].name,
                    id: i,
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
                counter = counter + 1
            }
        }
        //turns the message authors id into a a value that is used to index the master list
        for(i = 0; i < master_list.length; i++){
            if(master_list[i].id == message.author.id){
                player = i;
            }
        }

        if(String(new_bet).toLowerCase() == 'all'){
            new_bet = master[message.author.id].gbp
        }
        
        switch (String(command).toLowerCase()){
            case 'deal':
                try{

                    if(!general.CommandUsageValidator(message, master, new_bet, min_bet, master[message.author.id].gbp, message.author.id)){
                        return
                    }

                    if(master_list[player].gameStatus !== 0){
                        message.channel.send("You are already playing a game")
                        return
                    }

                    general.CommandPurchase(message, master, new_bet, general.defaultRecipient)
                    if(isNaN(match) == false){
                        if(master[message.author.id].gbp >= match){
                            message.channel.send(`Your "Match the Dealer" bet was accepted`)
                            
                            //A Fool's Bet Achievement
                            unlock.tracker1(master_list[player].id, 47, 1, message, master, tracker)
                            general.CommandPurchase(message, master, parseFloat(match), general.defaultRecipient)

                            var match_good = true
                        }else{
                            message.channel.send(`You didn't have enough for your "Match the Dealer" bet`)
                            var match_good = false
                        }
                    }
                    master_list[player].bet = [parseFloat(new_bet), 0]
                    master_list[player].gameStatus = 1;
                    if(new_bet >= 200){
                        //Psycho Achievement
                        unlock.tracker1(message.author.id, 23, 1, message, master, tracker)
                    }
                    var card = [];
                    var dummycard = [];
                    for (i = 0; i < 4; i++) {
                        card[i] = suit[Math.floor(Math.random()*suit.length)];
                        //generates cards for dealer and player
                    }

                    // Test Cards
                    //card[0] = 9;
                    //card[1] = 9;
                    //card[2] = 10;
                    //card[3] = 10;
                    //

                    master_list[player].player_hand1 = [card[0], card[1]];
                    master_list[player].dealer_hand = [card[2], card[3]];

                    for (i = 0; i < card.length; i++) {
                        var card_suit = suits[Math.floor(Math.random()*4)]
                        if (card[i] == 10){
                            dummycard[i] = tens[Math.floor(Math.random()*tens.length)];
                        }else if (card[i] == 11){
                            dummycard[i] = 'A';
                        }else{
                            dummycard[i] = card[i];
                        }
                        dummycard[i] = dummycard[i] + card_suit
                    }

                    //Test Cards
                    //dummycard[0] = 'J' + ':clubs:'
                    //dummycard[1] = 'J' + ':clubs:'
                    //dummycard[2] = 'J' + ':clubs:'
                    //dummycard[3] = 'J'
                    //

                    master_list[player].player_dummy_hand1 = [dummycard[0], dummycard[1]]
                    master_list[player].dealer_dummy_hand = [dummycard[2], dummycard[3]]

                    Display_Status(master_list[player],message, embed)
                    if(match_good == true){
                        var temp_hands = [master_list[player].player_dummy_hand1[0].split(':'), master_list[player].player_dummy_hand1[1].split(':'), master_list[player].dealer_dummy_hand[0].split(':')]
                        //console.log(temp_hands)
                        var match_winnings = 0 //winnings with original bet included
                        var true_winnings = 0 //winnings without original bet included
                        match = parseFloat(match)
                        if(temp_hands[0][0] == temp_hands[2][0]){
                            if(temp_hands[0][1] == temp_hands[2][1]){
                                true_winnings = 7 * match
                                match_winnings = true_winnings + match
                            }else{
                                true_winnings = 3 * match
                                match_winnings = true_winnings + match
                            }
                        }else{
                            true_winnings = 0
                            match_winnings = 0
                        }
                        if(temp_hands[1][0] == temp_hands[2][0]){
                            if(temp_hands[1][1] == temp_hands[2][1]){
                                true_winnings = 7 * match + true_winnings
                                match_winnings = true_winnings + match
                            }else{
                                true_winnings = 3 * match + true_winnings
                                match_winnings = true_winnings + match
                            }
                        }else{
                            true_winnings = true_winnings
                            match_winnings = match_winnings
                        }
                        //console.log(match_winnings)
                        if(match_winnings > 0){
                            message.channel.send(`You matched the dealer`)
                            message.channel.send(`You win ${true_winnings} gbp`)
                            master[message.author.id].gbp = master[message.author.id].gbp + match_winnings
                        }else{
                            message.channel.send(`You didn't match the dealer`)
                        }
                    }

                    if(master_list[player].dealer_dummy_hand[0] == 'A'){
                        if(master_list[player].dealer_hand[1] == 10){
                            master_list[player].gameStatus = 2
                            var blackjack = true
                            master_list[player].isStay[0] = true
                        }else{
                            setTimeout(function(){
                                message.channel.send("Dealer doesn't have blackjack")
                            }, 50)
                        }
                    }else if(sum(master_list[player].dealer_hand) == 21){
                        master_list[player].gameStatus = 2
                        var blackjack = true
                        master_list[player].isStay[0] = true
                    }else{
                        var blackjack = false
                    }
                    if(sum(master_list[player].player_hand1) == 21){
                        master_list[player].isStay[0] = true
                        if(blackjack == true){
                            master_list[player].gameStatus = 4
                        }else{
                            master_list[player].gameStatus = 3
                        }
                    }
                
                    /*Checks the various cases where a bet may be invalid such as when no bet is specified, you bet more gbp than you have
                    you bet less than the minimum bet, you use a non-number as a bet, and when you have already made a bet.
                    Also checks if the player or dealer has blackjack. If either are true the game status is changed accordingly and 
                    the player is forced to stay */
                }catch(err){
                    console.log(err)
                    message.channel.send("Error occurred in 21.js Deal")
                }
            break;
            case 'hit':
                try{
                    if(master_list[player].gameStatus == 1){
                        //checks if there is an ongoing game. If there is the card function generates a new card/dummy card
                        var cards = New_Card(suit,tens)
                        if(master_list[player].isStay[0] == true){
                            //If the player stays on there first hand but the game status doesn't change it means that
                            //they are split and their next hits will go to the 2nd hand
                            master_list[player].player_hand2.push(cards[0]);
                            master_list[player].player_dummy_hand2.push(cards[1]);
                            message.channel.send(`${master_list[player].name} Hand 2: ${master_list[player].player_dummy_hand2}`)
                            if(sum(master_list[player].player_hand2) > 21){
                                if (master_list[player].player_hand2.indexOf(11) !== -1){
                                    master_list[player].player_hand2[master_list[player].player_hand2.indexOf(11)] = 1;
                                }else{
                                    message.channel.send(`${master_list[player].name} hand 2 busts`)
                                    master_list[player].isStay[1] = true
                                    master_list[player].gameStatus = 11
                                }
                            }
                        }else{
                            //Defaults to the first hand if not split or if they haven't stayed yet
                            master_list[player].player_hand1.push(cards[0]);
                            master_list[player].player_dummy_hand1.push(cards[1]);
                            message.channel.send(`${master_list[player].name} Hand 1: ${master_list[player].player_dummy_hand1}`)
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
                                    }else{
                                        message.channel.send(`${master_list[player].name} hand 1 busts`)
                                        message.channel.send(`${master_list[player].name} Hand 2: ${master_list[player].player_dummy_hand2}`)
                                    }
                                }
                            }
                        }
                        //After a card is dealt it checks if the players hand is over 21. If over 21 it checks if they have an 11
                        //in their hand. If they do it is set to 1. If they don't have an 11 their game status is set to bust and
                        //they are forced to stay


                        if(master_list[player].gameStatus == 5){
                            message.channel.send("Player busts") 
                        }
                    }else{
                        message.channel.send("There currently isn't a game being played");
                    }
                }catch(err){
                    console.log(err)
                    message.channel.send("Error occurred in !21.js Hit")
                }
            break;
            case 'split':
                try{
                    if(master_list[player].isSplit){
                        message.channel.send("You can't resplit cards")
                        return
                    }

                    if(master_list[player].player_hand1.length > 2){
                        message.channel.send("You can't split after you have already hit")
                        return
                    }

                    if(master_list[player].gameStatus == 0){
                        message.channel.send("There currently isn't a hand being played")
                        return
                    }

                    if(master_list[player].player_dummy_hand1[0].split(':')[0] !== master_list[player].player_dummy_hand1[1].split(":")[0]){
                        message.channel.send("You can't split because your cards don't match")
                        return
                    }

                    /*Checks various cases such as if the player has hit or has enough gbp. If all cases are passed the players hand
                    is split with each card becoming the first card of a new hand. 2 new cards are generated for the hands
                    If the player has aces, they are forced to stay
                    */
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
                        var card_suit = suits[Math.floor(Math.random()*4)]
                        if (card[i] == 10){
                            dummycard[i] = tens[Math.floor(Math.random()*tens.length)];
                        }else if (card[i] == 11){
                            dummycard[i] = 'A';
                        }else{
                            dummycard[i] = card[i];
                        }
                        dummycard[i] = dummycard[i] + card_suit
                    }

                    master_list[player].player_dummy_hand1 = [dummy_card_0, dummycard[0]]
                    master_list[player].player_dummy_hand2 = [dummy_card_1, dummycard[1]]

                    general.CommandPurchase(message, master, parseFloat(master_list[player].bet[0]), general.defaultRecipient)

                    var bet = master_list[player].bet;
                    master_list[player].bet = [bet[0],bet[0]]
                    master_list[player].isSplit = true;
                    
                    if(master_list[player].player_dummy_hand1[0] === 'A'){ //Set this to 'A' when done
                        master_list[player].isStay = [true, true]
                        master_list[player].gameStatus = 11
                    }else{
                        master_list[player].isStay = [false, false]
                    }
                    
                    Display_Status(master_list[player],message,embed)

                    
                }catch(err){
                    console.log(err)
                    message.channel.send("Error occurred in 21.js Split")
                }
            break;
            case 'doubledown':
                try{
                    if(master_list[player].gameStatus == 1){
                        //Checks if game has started. If there is an ongoing game the player can use this command. If the player
                        //doesn't have enough gbp to fully double there bet it uses the remained of their gbp to doubledown for less
                        //This works the same as !hit but it makes the player stay after 1 card
                        var cards = New_Card(suit,tens)
                        if(master_list[player].isStay[0] == true){
                            //If the player has split and stayed on their first hand, doubledown defaults to their second hand
                            if(master_list[player].player_hand2.length == 2){
                                
                                general.CommandPurchase(message, master, parseFloat(master_list[player].bet[1]), general.defaultRecipient)
                                message.channel.send(`Your new bet is ${2 * master_list[player].bet[1]}`)
                                master_list[player].bet[1] = 2 * parseFloat(master_list[player].bet[1])
                            
                                master_list[player].isStay[1] = true
                                master_list[player].player_hand2.push(cards[0]);
                                master_list[player].player_dummy_hand2.push(cards[1]);
                                message.channel.send(`${master_list[player].name} Hand 2: ${master_list[player].player_dummy_hand2}`)
                                if(sum(master_list[player].player_hand2) > 21){
                                    if (master_list[player].player_hand1.indexOf(11) !== -1){
                                        master_list[player].player_hand1[master_list[player].player_hand1.indexOf(11)] = 1;
                                    }else{
                                        message.channel.send(`${master_list[player].name} hand 2 busts`)
                                        master_list[player].isStay[1] = true
                                    }
                                }
                                master_list[player].gameStatus = 11
                            }else{
                                message.channel.send("You can't doubledown after you have already hit once")
                            }
                        }else{
                            if(master_list[player].player_hand1.length == 2){
                                
                                general.CommandPurchase(message, master, parseFloat(master_list[player].bet[0]), general.defaultRecipient)
                                message.channel.send(`Your new bet is ${2 * master_list[player].bet[0]}`)
                                master_list[player].bet[0] = 2 * parseFloat(master_list[player].bet[0])
                                
                                master_list[player].isStay[0] = true
                                master_list[player].player_hand1.push(cards[0]);
                                master_list[player].player_dummy_hand1.push(cards[1]);
                                message.channel.send(`${master_list[player].name} Hand 1: ${master_list[player].player_dummy_hand1}`)
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
                                        }else{
                                            message.channel.send(`${master_list[player].name} hand 1 busts`)
                                        }
                                    }
                                }
                                if(master_list[player].isSplit == true){
                                    message.channel.send(`${master_list[player].name} Hand 2: ${master_list[player].player_dummy_hand2}`)
                                }
                            }else{
                                message.channel.send("You can't doubledown after you have already hit once")
                            }
                        }
                        if(master_list[player].gameStatus == 5){
                            message.channel.send("Player busts") 
                        }
                    }else{
                        message.channel.send("There currently isn't a game being played");
                    }
                }catch(err){
                    console.log(err)
                    message.channel.send("Error occurred in !21.js Doubledown")
                }
            break;
            case 'status':
                try{
                    if(master_list[player].gameStatus == 1){
                        Display_Status(master_list[player],message,embed)
                    }else{
                        message.channel.send("There currently isn't a game being played")
                    }
                }catch(err){
                    console.log(err)
                    message.channel.send("Error occurred in 21.js Status")
                }
            break;
            case 'stay':
                try{
                    //checks if the player has an ongoing game. If they do it checks if they have already stayed on a split hand
                    if(master_list[player].gameStatus !== 0){
                        if(master_list[player].isStay[0] == true){
                            master_list[player].isStay[1] = true;
                            master_list[player].gameStatus = 11;
                        }else{
                            master_list[player].isStay[0] = true;
                            if(master_list[player].isSplit == true){
                                message.channel.send(`${master_list[player].name} Hand 2: ${master_list[player].player_dummy_hand2}`)
                            }
                        }
                    }else{
                        message.channel.send("You aren't playing a game")
                    }
                }catch(err){
                    console.log(err)
                    message.channel.send("Error occurred in !21.js Stay")
                }
            break;
            case 'surrender':
                try{
                    if(master_list[player].player_hand1.length > 2){
                        message.channel.send("You can't surrender after you have already hit")
                        return
                    }
                    
                    if(master_list[player].isSplit){
                        message.channel.send("You can't surrender after you have already split")
                        return
                    }
                    
                    if(master_list[player].gameStatus == 0){
                        message.channel.send("There currently isn't a game being played")
                        return
                    }

                    message.channel.send("Coward")
                    master_list[player].isStay[0] = true;
                    master_list[player].gameStatus = 10
                    
                }catch(err){
                    console.log(err)
                    message.channel.send("Error occurred in !21.js Surrender")
                }
            break;
            case 'reset':
                reset(master_list, player)
            break;
            case 'help':
                try{
                    var title = embed.emptyValue
                    var description = embed.emptyValue
                    var fields = {
                        name: "List of Commands",
                        value: fs.readFileSync('./text_files/blackjack_commands.txt','utf8')
                    }
                    const embedMessage = embed.EmbedCreator(message, title, description, fields)
                    message.channel.send({embeds: [embedMessage]})
                }catch(err){
                    console.log(err)
                    message.channel.send("Error Occured in 21.js Help");
                }
            break;

            default:
                message.channel.send('Use "!21 help for a list of commands')
        }
        try{
            if(master_list[player].isSplit == true && master_list[player].gameStatus !== 1){
                //checks if player has split and the game is over. If they both are these lines automatically runs. Each hand is
                //checked to see if the player is over 21 and if they are is it because they have 2 aces
                if(sum(master_list[player].player_hand1) <= 21 || master_list[player].player_hand1.includes(11) == true){
                    var hand1_bust = false;
                }else{
                    var hand1_bust = true;
                }

                if(sum(master_list[player].player_hand2) <= 21|| master_list[player].player_hand2.includes(11) == true){
                    var hand2_bust = false;
                }else{
                    var hand2_bust = true;
                }
                //checks if either hand hasn't busted. If both hands haven't busted the dealer will get new cards until they hit 17
                //If both player hands have busted, the dealer doesn't draw new cards
                if(hand1_bust == false || hand2_bust == false){
                    if(sum(master_list[player].dealer_hand) > 21){
                        if (master_list[player].dealer_hand.indexOf(11) !== -1){
                            master_list[player].dealer_hand[master_list[player].dealer_hand.indexOf(11)] = 1;
                        }
                    }
                    setTimeout(function(){
                        //reusing the hit function from earlier
                        while(sum(master_list[player].dealer_hand) < 17){
                            var cards = New_Card(suit,tens)
                            master_list[player].dealer_hand.push(cards[0]);
                            master_list[player].dealer_dummy_hand.push(cards[1]);
                            message.channel.send(`Dealer hand: ${master_list[player].dealer_dummy_hand}`)
                            if(sum(master_list[player].dealer_hand) > 21){
                                if (master_list[player].dealer_hand.indexOf(11) !== -1){
                                    master_list[player].dealer_hand[master_list[player].dealer_hand.indexOf(11)] = 1;
                                }else{
                                    master_list[player].gameStatus = 12
                                    message.channel.send("Dealer busts")
                                }
                            }  
                        }
                    }, 20)
                    Display_Status(master_list[player], message,embed)
                    setTimeout(function(){   
                        //checks if the dealer busted. If they did, the player is payed out for each non-busted hand 
                        if(master_list[player].gameStatus == 12){
                            var winnings = 0
                            if(hand1_bust == false){
                                winnings = winnings + parseFloat(master_list[player].bet[0])
                                Win(master_list[player], 0, message, master, stats_list)
                            }else{
                                Lose(master_list[player], 0, message, master, stats_list)
                            }
                            if(hand2_bust == false){
                                winnings = winnings + parseFloat(master_list[player].bet[1])
                                Win(master_list[player], 0, message, master, stats_list)
                            }else{
                                Lose(master_list[player], 0, message, master, stats_list)
                            }
                            general.CommandPurchase(message, master, -2 * parseFloat(winnings), general.defaultRecipient)
                            message.channel.send(`${master_list[player].name} wins ${winnings} gbp`)

                            reset(master_list, player)

                        }else{
                            //dealer hasn't busted so their hand must be compared to the players 2 hands. If the player has 2 11s, one of them is set to 1
                            //the player is payed out according to how their hand compares to the dealers
                            var winnings = 0
                            var correction = 0
                            if(master_list[player].player_dummy_hand1 == ['A','A']){
                                master_list[player].player_hand1 = [11, 1]
                            }
                            if(master_list[player].player_dummy_hand2 == ['A','A']){
                                master_list[player].player_hand2 = [11, 1]
                            }
                            
                            if(sum(master_list[player].player_hand1) > sum(master_list[player].dealer_hand) && hand1_bust == false){
                                winnings = winnings + 2 * parseFloat(master_list[player].bet[0])
                                message.channel.send(`${master_list[player].name} wins hand 1 and ${master_list[player].bet[0]} gbp`)
                                correction = parseFloat(master_list[player].bet[0]) //Used to track actual winnings, not winnings with original bet included
                                Win(master_list[player], 0, message, master, stats_list)
                            }else if(sum(master_list[player].player_hand1) == sum(master_list[player].dealer_hand)){
                                winnings = winnings + parseFloat(master_list[player].bet[0])
                                correction = parseFloat(master_list[player].bet[0])
                                message.channel.send(`Dealer pushes hand 1`)
                                Push(master_list[player], 0, message, master, stats_list)
                            }else{
                                message.channel.send("Dealer wins hand 1")
                                winnings = 0
                                Lose(master_list[player], 0, message, master, stats_list)
                            }
                
                            if(sum(master_list[player].player_hand2) > sum(master_list[player].dealer_hand) & hand2_bust == false){
                                winnings = winnings + 2 * parseFloat(master_list[player].bet[1])
                                correction = parseFloat(master_list[player].bet[1]) + correction
                                message.channel.send(`${master_list[player].name} wins hand 2 and ${master_list[player].bet[0]} gbp`)
                                Win(master_list[player], 1, message, master, stats_list)
                            }else if(sum(master_list[player].player_hand2) == sum(master_list[player].dealer_hand)){
                                winnings = winnings + parseFloat(master_list[player].bet[1])
                                correction = parseFloat(master_list[player].bet[1]) + correction
                                message.channel.send(`Dealer pushes hand 2`)
                                Push(master_list[player], 1, message, master, stats_list)
                            }else{
                                winnings = winnings
                                message.channel.send("Dealer wins hand 2")
                                Lose(master_list[player], 1, message, master, stats_list)
                            }
                            general.CommandPurchase(message, master,-1 * parseFloat(winnings), message.author.id)
                            reset(master_list, player)
                        }
                    }, 20)
                }else{
                    //if both player hands busted, the dealer defaults a win
                    message.channel.send(`Dealer's Hand: ${master_list[player].dealer_dummy_hand}`)
                    message.channel.send("Dealer wins")
                    Lose(master_list[player], 0, message, master, stats_list)
                    Lose(master_list[player], 1, message, master, stats_list)
                    reset(master_list, player)
                }
            }else if(master_list[player].isSplit == false && master_list[player].isStay[0] == true){
                //if the player hasn't split and has stayed this block of code runs
                //Checks if the player has busted or if blackjack has been dealt to either the dealer or the player
                //If any of the cases are true new cards aren't dealt
                if(master_list[player].isStay[0] == true){
                    message.channel.send(`Dealer hand: ${master_list[player].dealer_dummy_hand}`)
                    if([2,3,4,5,10].includes(master_list[player].gameStatus) == false){    
                        if(sum(master_list[player].dealer_hand) > 21){
                            if (master_list[player].dealer_hand.indexOf(11) !== -1){
                                master_list[player].dealer_hand[master_list[player].dealer_hand.indexOf(11)] = 1;
                            }
                        }
                        while(sum(master_list[player].dealer_hand) < 17){
                            var cards = New_Card(suit,tens)
                            master_list[player].dealer_hand.push(cards[0]);
                            master_list[player].dealer_dummy_hand.push(cards[1]);
                            
                            if(sum(master_list[player].dealer_hand) > 21){
                                if (master_list[player].dealer_hand.indexOf(11) !== -1){
                                    master_list[player].dealer_hand[master_list[player].dealer_hand.indexOf(11)] = 1;
                                }else{
                                    master_list[player].gameStatus = 6
                                }
                            }
                            message.channel.send(`Dealer hand: ${master_list[player].dealer_dummy_hand}`)            
                            
                        }
                    }

                    //compares the dealers and players hand. Changes the game status according to if they player wins, loses, or pushes
                    if([2,3,4,5,6,10].includes(master_list[player].gameStatus) == false){
                        if(sum(master_list[player].player_hand1) == sum(master_list[player].dealer_hand)){
                            master_list[player].gameStatus = 7
                        }else if(sum(master_list[player].player_hand1) < sum(master_list[player].dealer_hand)){
                            master_list[player].gameStatus = 8
                        }else{
                            master_list[player].gameStatus = 9
                        }
                    }
                    setTimeout(function(){ 
                        //List of different game statuses where each status causes a different outcome
                        switch(master_list[player].gameStatus){
                            case 2:
                                message.channel.send("Dealer has blackjack")
                                message.channel.send("Dealer wins")

                                Lose(master_list[player], 0, message, master, stats_list)
                            break;
                            case 3:
                                message.channel.send("Player has blackjack")
                                message.channel.send(`${master_list[player].name} wins ${1.5 * parseFloat(master_list[player].bet[0])} gbp`)
                                general.CommandPurchase(message, master, -2.5 * parseFloat(master_list[player].bet[0]), general.defaultRecipient)
                                Win(master_list[player], 0, message, master, stats_list)
                            break;
                            case 4:
                                message.channel.send("Player has blackjack")
                                message.channel.send("Dealer has blackjack")
                                message.channel.send("Player pushes")
                                general.CommandPurchase(message, master, -1 * parseFloat(master_list[player].bet[0]), general.defaultRecipient)

                                Push(master_list[player], 0, message, master, stats_list)                               
                            break;
                            case 5:
                                message.channel.send("Dealer wins") 

                                Lose(master_list[player], 0, message, master, stats_list, tracker)
                            break;
                            case 6:
                                message.channel.send("Dealer busts")
                                message.channel.send(`${master_list[player].name} wins ${1 * parseFloat(master_list[player].bet[0])} gbp`)
                                general.CommandPurchase(message, master, -2 * parseFloat(master_list[player].bet[0]), general.defaultRecipient)

                                Win(master_list[player], 0, message, master, stats_list) 
                            break;
                            case 7:
                                message.channel.send("Player pushes")
                                general.CommandPurchase(message, master, -1 * parseFloat(master_list[player].bet[0]), general.defaultRecipient)

                                Push(master_list[player], 0, message, master, stats_list)
                            break;
                            case 8:
                                message.channel.send("Dealer wins")

                                Lose(master_list[player], 0, message, master, stats_list)
                            break;
                            case 9:
                                message.channel.send("Player wins")
                                message.channel.send(`${master_list[player].name} wins ${1 * parseFloat(master_list[player].bet[0])} gbp`)
                                general.CommandPurchase(message, master, -2 * parseFloat(master_list[player].bet[0]), general.defaultRecipient)

                                Win(master_list[player], 0, message, master, stats_list)
                            break;
                            case 10:
                                console.log(-0.5 * master_list[player].bet[0])
                                general.CommandPurchase(message, master, -0.5 * parseFloat(master_list[player].bet[0]), general.defaultRecipient)
                                message.channel.send(`You recieved ${.5 * parseFloat(master_list[player].bet[0])} gbp back`)
                                //This Bot Is Rigged Achievement
                                unlock.reset1(master_list[player].id, 8, tracker, message)
                                stats.tracker(master_list[player].id, 4, 1, stats_list)
                            break;

                            /*
                            Game Status: 
                                0 - No game ongoing
                                1 - Game ongoing
                                2 - Dealer has blackjack
                                3 - Player has blackjack
                                4 - Both have blackjack
                                5 - Player Busts
                                6 - Dealer Busts
                                7 - Player pushes
                                8 - Dealer wins without bust
                                9 - Player wins without bust
                                10 - Player Surrenders
                                11 - Player Split Options
                            */
                        }
                        reset(master_list, player)
                    }, 10)
                }
            }
        }catch(err){
            console.log(err)
            message.channel.send("Error occurred in !21.js Outcome")
        }
    }
}

function New_Card(suit, tens){
    try{
        const suits = [':diamonds:',':hearts:',':spades:',':clubs:']
        var card_suit = suits[Math.floor(Math.random()*4)]
        var dummycard = "";
        var card = suit[Math.floor(Math.random()*suit.length)];
        if (card == 10){
            dummycard = tens[Math.floor(Math.random()*tens.length)];
        }else if (card == 11){
            dummycard = 'A';
        }else{
            dummycard = card;
        }
        return [card, dummycard + card_suit]
    }catch(err){
        console.log(err)
        message.channel.send("Error occurred in new21.js New_Card")
    }
}

function Display_Status(master_list, message, embed){
    var current_bet = master_list.bet;
    var current_hand1 = master_list.player_dummy_hand1;
    var current_hand2 = master_list.player_dummy_hand2;
    var dealer_hand = master_list.dealer_dummy_hand;
    if(current_hand2.length == 0){
        var blackjack_stats = `Dealer's hand: ${dealer_hand[0]} ?\nPlayer's hand: ${current_hand1} \nCurrent bet: ${current_bet[0]}`
    }else{
        var blackjack_stats = `Dealer's hand: ${dealer_hand[0]} ?\nPlayer's hand 1: ${current_hand1} \nPlayer's Hand 2: ${current_hand2} \nCurrent bet: ${current_bet[0]}|${current_bet[1]}`
    }

    var title = embed.emptyValue
    var description = embed.emptyValue
    var fields = {
        name: `${master_list.name} Game Status:`,
        value: blackjack_stats
    }
    const embedMessage = embed.EmbedCreator(message, title, description, fields)
    message.channel.send({embeds: [embedMessage]})
    
}

function sum(arr) {
    //function to sum hands
    var s = 0

    for (var j = 0; j < arr.length; j++){
        s = arr[j] + s;
    }
    return s;
}
function reset(master_list, player){
    master_list[player].player_hand1 = [];
    master_list[player].player_hand2 = [];
    master_list[player].player_dummy_hand1 = [];
    master_list[player].player_dummy_hand2 = [];
    master_list[player].dealer_hand = [];
    master_list[player].dealer_dummy_hand = [];
    master_list[player].bet = "";
    master_list[player].gameStatus = 0;
    master_list[player].isStay = [false, true];
    master_list[player].blackjack = false;
    master_list[player].isSplit = false
}

function Win(master_list, split_index, message, master, stats_list){
    const unlock = require('./Functions/Achievement_Functions')
    const stats = require('./Functions/stats_functions')
    if(master_list.bet[split_index] >= 1000){
        //High Roller Achievement
        unlock.unlock(master_list.id, 1, message, master)
    }
    //This Bot is Rigged Achievement
    unlock.reset1(master_list.id, 8, tracker, message)

    //Professional Gambler Achievement
    unlock.tracker1(master_list.id, 33, 1.5 * parseFloat(master_list.bet[split_index]), message, master, tracker)
    
    //Jack of All Trades Achievement
    unlock.tracker3(master_list.id, 39, 0, parseFloat(master_list.bet[split_index]), message, master, tracker)
    stats.tracker(master_list.id, 2, 1, stats_list)

}

function Lose(master_list, split_index,message, master, stats_list){
    const unlock = require('./Functions/Achievement_Functions')
    const stats = require('./Functions/stats_functions')
    if(master_list.bet[split_index] >= 1000){
        //Buster Achievement
        unlock.unlock(master_list.id, 2, message, master)
    }

    //This Bot Is Rigged Achievement
    unlock.tracker1(master_list.id, 8, 1, message, master, tracker)

    //The House Always Wins Achievement
    unlock.tracker1(master_list.id, 32, parseFloat(master_list.bet[split_index]), message, master, tracker)
    stats.tracker(master_list.id, 4, 1, stats_list)
}

function Push(master_list, split_index, message, master, stats_list){
    const unlock = require('./Functions/Achievement_Functions')
    const stats = require('./Functions/stats_functions')

    //This Bot Is Rigged Achievement
    unlock.reset1(master_list.id, 8, tracker, message)
    stats.tracker(master_list.id, 3, 1, stats_list, tracker)
}