# Teen Patti

## Instructions to start server and client

1. npm i in in main directory and in frontend directory
2. from backend directory start server using `tsc server.ts && node server.js`
3. from frontend directory start client using `npm start`

## Instructions to enter game

1. Enter your name and click on `Join Game` button
2. Wait for four players to join
3. if you are fifth player, you will not be allowed to play

## Instructions to create bias player with best cards to make him win quickly and test game win condition

1. go to server.ts file in backend
2. On Line 54 set player1 odds to true

## Instructions to play game and some rules I modified based on my understanding of teen patti (IMPORTANT)

1. A value card is a card other than power card (2,7,8,10)
2. When pile is empty you can throw any card (value or power)
3. When pile is non empty you can throw power card only when you dont have a valid value card

#### When is a value card non valid and you are allowed to throw power card?

4. When you have a card of lower rank than card in pile
5. When top of pile card is 7 and you have no value card less than equal 7
6. When top of pile card is 8 (or sequence of 8(s)) and after those 8 is a 7 so you follow rule 5
7. When top of pile is 8 and after it is a value card then throw valid value card if have one. If not then only throw power card

#### Some complex rules

8. When throw 2 you can throw another card but again the checks for valid value cards in your hand happen. You cant straight away throw power card on two if have a valid value card

#### Burn of pile rules by server

9. When server detect a player dont have valid value card or a power card in mycards, it will burn the pile and give the player whole pile and skips his turn
10. same thing happen when player is playing from faceup cards, server reads faceup card and apply rule 8
11. Incase of facedown server doesnt burn pile, client makes a move upon which it is decided to burn pile (when move invalid) and add it to my cards
