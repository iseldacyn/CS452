Iselda Aiello

Textures created by: Me (Bus, Pole, Signs, Road)
Models created by: Sydney DeCyllis (Street Lamp), Nicolás Quitero (Bench)

I created a scene of a bus stop in the evening hours. The scene contains a bus, a bench, a street lamp, and two signs (i.e. stop and bus stop). The user may interact with by driving the bus around the scene. Pressing "w" will go forward, "s" will go backwards, "a" and "d" will turn left and right respectively (but only when driving), and "o" and "p" scale up and down the size of the bus. Additionally, pressing the space bar will honk the buses horn!
Unfortunately, I did not have much time to work on the lighting. I know this is a semi-late submission, however I tried my hardest to work on the lighting and kept running into complications with the object I had created. The 2D textures for the signs and road kept crashing the program, and the .obj files I integrated using a python script had similar issues (i.e. returning a NaN normalized vector). I had initially intended to add a spotlight with shadow mapping, and a diffuse lighting in the lamp post with specular reflection, but because of the amount of time it would take to figure out the bugs I was having, I instead only implemented an ambient lighting similar to a moonlight. (To disable this lighting, uncomment the marked lines in the fragment shaders to view the colors/scene better).
I created all the textures seen in this scene. The models for the street lamp and bench are credited above. There are 5 distinct textures, 4 distinct polyhedra (including the .obj objects I imported with obj2js.py), and 4 distinct pieces. The camera views the scene from a perspective projection and begins as if the bus is pulling up to the empty bus stop station.
Most of my code was inspired by previous assignments, as well as in class examples. Some aspects, such as the controller for movement and audio interfacing, I had gotten from outside resources (i.e. various forum posts, WebGL/HTML specifications, etc.).

Side notes:
 - Some code is leftover from trying to work out lighting, however most of it doesn't do anything
 - To see the textures, run "python server.py" before loading the HTML file
 - There is also some code related to camera zoom. Early on, I intended to have the camera follow the bus in it's movement and render everything around it accordingly. As I worked more, I realized how much needed to be done to achieve this, and scrapped the idea in favor of a still camera angle.
