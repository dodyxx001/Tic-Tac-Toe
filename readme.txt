This is a Tic-Tac-Toe app.
Making the app was an assignment in the The Odin Project Curriculum.

We had to use objects, modules and factories.
The goal was to have as little 'global' code as possible.
Everything needs to be 'closed' in modules or factories.

So, making of this project was a bit different from previous pro-
jects.

Version1:
- created UI
- edited CSS, made it look 'nice'
- added 'choose color' buttons and 'restart' button
- wrote functions that create players - 2 players, person and CPU
- wrote function that clicks on random available field
- disabled occupied fields
- version 1 took about 4 hours to finish

Version 2:
- Improved UI a bit, added CSS animations, animated Xs and Os
- added functions that play the game - enabled computer to play 
  random fields
- added logic that checks for the winner - RegEx that is tested
  against the data-number attribute of the 'clicked' fields. If
  the numbers match the regex, the winner is returned.
- added logic that checks for the draw
- added functionality to 'restart' button