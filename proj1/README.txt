Iselda Aiello

Controls:
wasd to move blue tank, e to shoot a bullet from blue tank
ijkl to move red tank, o to shoot a bullet from red tank

Throughout the duration of the game, there are 6 2d polygons. These are the Blue tank and the Red tank with their respective hitboxes and bullets. There are also 4 colors in the game, those being Blue (for the blue tank/bullet), Red (for the red tank/bullet), Cream (for the background), and Orange (for the hitboxes).
The scoring system is implemented through an alert that appears once a game has been completed. The goal of the game is to defeat the enemy tank by shooting your bullet at them. You only have one bullet, but it respawns whenever it goes out of bounds.
I planned on including brown obstacles that both the bullet and tanks would need to maneuver around, however was unable to due to time constraints. They are not difficult, and I can implement them later if I would like, but was already running out of time due to the scope of my project currently.
The players interacts with the game using the keyboard. I used a built-in JS EventListener method to be able to read in multiple keystrokes at once, allowing both players to play simultaneously with each other. This also fixed the issue of the tank "skipping" along as you held a button, as now it moves seamlessly with each input that is given.

I implemented this game fairly easily. Each object, the tank, hitbox, and bullet, all follow the same movement patterns dictated by the keystrokes and move along with each other as a single entity. This made it easier for me to implement, as well as perform calculations with.
The bullets were a bit tricky to deal with, however. I created a separate function for each bullet. While not shooting, they would simply follow the tank's movements and glue to the inside of it. Once they were shot, however, they followed their current angle and move forward without changing trajectory until they either hit the edge of the canvas, or an enemy tank.
The collision detection I implemented uses the fact that the area of the hitbox will be about the same as the area of four triangles generated between vertices of the hitbox with the point the bullet was located. If they were different, then the point is clearly not in the hitbox. There is a slight range to allow for more generous hit detection, but otherwise it seems to work flawlessly.

There are some bugs that arose, taht I didn't have time to fully fix. For one, it is possible to clip the corner/side of the tank into the canvas (which I thought wasn't a BIG deal, and it just required more tedious collision detection).
If a player is holding a direction while the game is won, upon reset that button will remain pressed until pressed down again. I'm not sure why this happens, but I couldn't find a way to fix it.
I tried implementing the scoring and winning message to the HTML itself, but couldn't find a way to do so, so the winning and score message are simply given through an alert and cannot be displayed to the players at all times. (Though, they could be sent a message through console.log as well, but I figured it wouldn't make sense for a use to open the console to view their score.)
Also, there is not collision detection between tanks, so they are free to drive into each other as they please.

Given more time, I would work on the obstacles on the field as it is quite bare-bones and empty as it stands. With this, I would need to work on better collision detection with the tanks and fixing the corner-clipping bug. After that, I would work on implementing the score to be shown on the HTML file at all times.
Regardless, the game is functional as is, and works quite well in my opinion. I didn't come across any other major bugs in my time testing, but if any are present I was not aware of them through my time fiddling with it.
