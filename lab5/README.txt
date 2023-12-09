Iselda Aiello

Controls: wasd to move, x/n to scale up/down on X axis, y/m to scale up/down on Y axis, iop to rotate on XYZ axes

I started with updating the controls for Lab 3, as my original configuration was unintuitive and didn't allow for continous movement. Moving on, I split up my tetrahedron into 2 different parts, the triangles on top and the square at the bottom.
I mapped the same image on the triangles on top (the character Saul Goodman from Better Call Saul), and another image on the bottom square (the character Freddy Fazbear from Five Nights at Freddy's: Security Breach).
I used the same method used in my Project 1 and Lab 2, creating separate shaders for each and defining them separately. Since they were still a part of the same object, however, they were able to use the same linear transformation matrices that were already implemented.
I got stuck drawing the objects to the screen, and I'm still not really sure why. I think my issue was with the vertices of the objects themselves, as I eventually figured it around after fiddling with the numbers a little bit. Another issue I ran into was with rendering the second image. It would only load after pressing "reset" upon loading in to the html file. I figured there was some way to make it work in their loading initally, however I couldnt figure it out.
To work around this, the render() function called reset() immediately upon being called, and is controlled by a variable 'n', which also acts as a frame-limiter, so when you press an input the object moves just a *bit* slower than the refresh rate of WebGL.
