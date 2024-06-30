module.exports = {
    name: 'test',
    description: 'new blackjack',
    execute(message, args, master, blackJackHands){
        const general = require('./Functions/GeneralFunctions')
        const MINBET = 15
        args = ['21', '20']

        if(blackJackHands[message.author.id] != undefined){
            SendGameDisplay(message, blackJackHands, message.author.id)
            return
        }

        if(args.length < 2){
            message.channel.send("You must specificy a bet amount")
            return
        }

        if(!general.CommandUsageValidator(message, master, args[1], MINBET, master[message.author.id].gbp, general.defaultRecipient)){
            return
        }
        
        CreateNewGame(message, blackJackHands, message.author.id, args[1])
        /*
        Start

        Player tries to start a game
        1. Player is already playing a game so it brings up embed of current game END
        2. Player isnt already playing a game

        Validate if player can start game
        1. if player bets/bank is invalid for game send explanation END
        2. If players bet/bank situation is valid start game

        Create game for player
        1. add player game to blackJackHands object

        Hands are created for player and dealer. 4 possible outcomes
        Player and Dealer dont have blackjack
            -Play begins
        Player has blackjack/ dealer doesnt
            -Hand Win
        Player doesnt have blackjack/ dealer does
            -Hand Loss
        Both player and dealer have blackjack
            -Hand Push

        Hand start. 5 Possible outcomes
        1. Player Hit
            -add card to players hand
            -only able to hit or stay now
            -if bust go to second hand if player split, else go to hand lost
        2. Player Stay
            -Dealer turn
        3. Player Doubledown
            -player gets 1 card and then stays
            -if bust, hand loss
            -if not dealer turn
        4. Player Split
            -can only be done when player hand is size 2 and hasnt split before
            -add two new cards to hand
        5. Can only be done when hand size is 2 and player hasnt split before
            -go Surrender
            
        Dealer turn. Take card. 3 outcomes.
        1. less than hard 17, take card and check again
        2. more than hard 17 less than 22, stay, go to comparison
        3. more than 21, Hand win

        Compare player and dealer hands and go to appropriate outcome

        4 Final outcomes
        Hand Win
        Hand Loss
        Hand Push
        Surrender

       End
       */
    }
}

function CreateNewGame(message, blackJackHands, user, bet){
    AddPlayerToHandsArray(blackJackHands, user, bet)
    CreateHands(blackJackHands, user)
    SendGameDisplay(message, blackJackHands, user)
}

function AddPlayerToHandsArray(blackJackHands, user, bet){
    blackJackHands[user] = {
        bet: bet,
        currentMessageID: "",
        dealerHand: [],
        dealerDummyHand: [],
        playerHand: [[],[]],
        playerDummyHand:[[],[]],
        playerSplit: false,
        playerStay: false
    }
}

function SendGameDisplay(message, blackJackHands, user){
    const embed = require('./Functions/embed_functions')
    var title = "Test"
    var description = `${blackJackHands[user].dealerDummyHand[0]} ${blackJackHands[user].dealerDummyHand[1]}`

    var temp = blackJackHands[user].playerDummyHand
    if(temp.length == 1){
        temp = blackJackHands[user].playerDummyHand[0]
    }
    var fields = {name: "Player Hand", value: temp}
    const embedMessage = embed.EmbedCreator(message, title, description, fields)
    message.channel.send({embeds: [embedMessage]})
}

//creates hands for both player and dealer at the same time
function CreateHands(blackJackHands, user){
    for (var i = 0; i < 2; i++) {
        var temp = AddCard()
        blackJackHands[user].playerHand[0].push(temp[0])
        blackJackHands[user].playerDummyHand[0].push(temp[1])
        
        var temp2 = AddCard()
        blackJackHands[user].dealerHand.push(temp2[0])
        blackJackHands[user].dealerDummyHand.push(temp2[1])
    }
}

//creates a card to be used in a hand
//if the card is a 10 it is randomzied as a face card
//if the card is an 11 it becomes an ace
//also adds a random suit to each created card
function AddCard(){
    const CARDVALUES = [2,3,4,5,6,7,8,9,10,10,10,10,11]
    const TENS = ['10','J','Q','K']
    const SUITS = [':diamonds:',':hearts:',':spades:',':clubs:']

    var card = ""
    var dummyCard = ""
    card = dummyCard = CARDVALUES[Math.floor(Math.random()*CARDVALUES.length)];
    if(card == 11){
        dummyCard = "A"
    }

    if(card == 10){
        dummyCard = TENS[Math.floor(Math.random() * TENS.length)]
    }
    
    dummyCard += SUITS[Math.floor(Math.random()*SUITS.length)];
    return [card, dummyCard]
}