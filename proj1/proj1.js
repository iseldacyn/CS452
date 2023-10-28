/* Iselda Aiello */
/* CS452 Project 1 */
/* Combat Atari Game Recreation */

var gl;
var n = 0;
var hitboxes;
var score;

// vars for tank shaders
var tankShaderProgram1;
var tankShaderProgram2;
var tankBuffer1;
var tankBuffer2;

// vars for hitbox shaders
var hitboxShaderProgram1;
var hitboxShaderProgram2;
var hitboxBuffer1;
var hitboxBuffer2;

// vars for bullet shaders
var bulletShaderProgram1;
var bulletShaderProgram2;
var bulletBuffer1;
var bulletBuffer2;

// Rotation variables
var thetaValue1, thetaValue2;
var MrValue1, MrValue2;
var MrUni1, MrUni2;
var MrHitbox1, MrHitbox2;
var MrBullet1, MrBullet2;

// Translation variables
var tx1, tx2;
var ty1, ty2;
var MtValue1, MtValue2;
var MtUni1, MtUni2;
var MtHitbox1, MtHitbox2;
var MtBullet1, MtBullet2;

// Bullet variables
var shoot1, shoot2;
var bulletTheta1, bulletTheta2;
var txBullet1, txBullet2;
var tyBullet1, tyBullet2;

const controller = {
	"w": {pressed: false},
	"s": {pressed: false},
	"a": {pressed: false},
	"d": {pressed: false},
	"e": {pressed: false},

	"i": {pressed: false},
	"j": {pressed: false},
	"k": {pressed: false},
	"l": {pressed: false},
	"o": {pressed: false}
}
document.addEventListener( "keydown", (e) => {
	if( controller[e.key] )
		controller[e.key].pressed = true;
})
document.addEventListener( "keyup", (e) => {
	if( controller[e.key] )
		controller[e.key].pressed = false;
})

function init()
{
	// Initialize canvas and WebGL context
	var canvas = document.getElementById( "gl-canvas" );
	gl = WebGLUtils.setupWebGL( canvas );
	if( !gl ) { alert( "WebGL is not available!" ); }
	
	// Set up viewport
	gl.viewport( 0, 0, 512, 512 );

	// Set background color
	gl.clearColor( 1.0, .99, .815, 1.0 );

	// Force WebGL context to clear the color buffer
	gl.clear( gl.COLOR_BUFFER_BIT );

	// Create shader program for first tank
	tankShaderProgram1 =
		initShaders( gl, "vertex-tank1", "fragment-tank1" );

	// Create shader program for second tank
	tankShaderProgram2 = 
		initShaders( gl, "vertex-tank2", "fragment-tank2" );

	// Create shader program for first and second hitboxes
	hitboxShaderProgram1 =
		initShaders( gl, "vertex-hitbox1", "fragment-hitbox1" );
	hitboxShaderProgram2 =
		initShaders( gl, "vertex-hitbox2", "fragment-hitbox2" );

	// Create shader program for bullets
	bulletShaderProgram1 = 
		initShaders( gl, "vertex-bullet1", "fragment-bullet1" );
	bulletShaderProgram2 = 
		initShaders( gl, "vertex-bullet2", "fragment-bullet2" );

	// Code for rotation of tanks
	gl.useProgram( tankShaderProgram1 );
	thetaValue1 = 0;
	MrValue1 = [Math.cos( thetaValue1 ), -Math.sin( thetaValue1 ), 0,
		Math.sin( thetaValue1 ), Math.cos( thetaValue1 ), 0,
		0, 0, 1];
	MrUni1 = gl.getUniformLocation( tankShaderProgram1, "Mr" );
	gl.uniformMatrix3fv( MrUni1, false, MrValue1 );

	gl.useProgram( hitboxShaderProgram1 );
	MrHitbox1 = gl.getUniformLocation( hitboxShaderProgram1, "Mr" );
	gl.uniformMatrix3fv( MrHitbox1, false, MrValue1 );
	gl.useProgram( bulletShaderProgram1 );
	MrBullet1 = gl.getUniformLocation( bulletShaderProgram1, "Mr" );
	gl.uniformMatrix3fv( MrBullet1, false, MrValue1 );

	gl.useProgram( tankShaderProgram2 );
	thetaValue2 = 0;
	MrValue2 = [Math.cos( thetaValue2 ), -Math.sin( thetaValue2 ), 0,
		Math.sin( thetaValue2 ), Math.cos( thetaValue2 ), 0,
		0, 0, 1];
	MrUni2 = gl.getUniformLocation( tankShaderProgram2, "Mr" );
	gl.uniformMatrix3fv( MrUni2, false, MrValue2 );

	gl.useProgram( hitboxShaderProgram2 );
	MrHitbox2 = gl.getUniformLocation( hitboxShaderProgram2, "Mr" );
	gl.uniformMatrix3fv( MrHitbox2, false, MrValue2 );
	gl.useProgram( bulletShaderProgram2 );
	MrBullet2 = gl.getUniformLocation( bulletShaderProgram2, "Mr" );
	gl.uniformMatrix3fv( MrBullet2, false, MrValue2 );

	// Code for translation of tanks
	gl.useProgram( tankShaderProgram1 );
	tx1 = -.85;
	ty1 = .0;
	MtValue1 = [ 1.0, .0, .0,
		.0, 1.0, .0,
		tx1, ty1, 1.0]
	MtUni1 = gl.getUniformLocation( tankShaderProgram1, "Mt" );
	gl.uniformMatrix3fv( MtUni1, false, MtValue1 );

	gl.useProgram( hitboxShaderProgram1 );
	MtHitbox1 = gl.getUniformLocation( hitboxShaderProgram1, "Mt" );
	gl.uniformMatrix3fv( MtHitbox1, false, MtValue1 );
	gl.useProgram( bulletShaderProgram1 );
	MtBullet1 = gl.getUniformLocation( bulletShaderProgram1, "Mt" );
	gl.uniformMatrix3fv( MtBullet1, false, MtValue1 );

	gl.useProgram( tankShaderProgram2 );
	tx2 = .85;
	ty2 = .0;
	MtValue2 = [ 1.0, .0, .0 ,
		.0, 1.0, .0,
		tx2, ty2, 1.0]
	MtUni2 = gl.getUniformLocation( tankShaderProgram2, "Mt" );
	gl.uniformMatrix3fv( MtUni2, false, MtValue2 );

	gl.useProgram( hitboxShaderProgram2 );
	MtHitbox2 = gl.getUniformLocation( hitboxShaderProgram2, "Mt" );
	gl.uniformMatrix3fv( MtHitbox2, false, MtValue2 );
	gl.useProgram( bulletShaderProgram2 );
	MtBullet2 = gl.getUniformLocation( bulletShaderProgram2, "Mt" );
	gl.uniformMatrix3fv( MtBullet2, false, MtValue2 );

	// Neither tank has shot yet
	shoot1 = false;
	shoot2 = false;

	// Disable hitboxes by default
	hitboxes = false;

	// Set score to 0
	score = vec2( 0, 0 );

	initTank1();
	initTank2();
	initHitbox1();
	initHitbox2();
	initBullet1();
	initBullet2();
	render();
}

// Initialize points in Tank 1 and create buffer
function initTank1()
{
	var a1,b1,c1,d1,e1,f1,g1,h1,i1,j1,k1,l1,m1,n1,o1,p1;
	/*
	a1 = vec2(-.875,.05);
	b1 = vec2(-.925,.05);
	c1 = vec2(-.875,-.05);
	d1 = vec2(-.925,-.05);
	e1 = vec2(-.9,.02);
	f1 = vec2(-.9,-.02);
	g1 = vec2(-.8,.02);
	h1 = vec2(-.8,-.02);
	i1 = vec2(-.86,.02);
	j1 = vec2(-.84,.02);
	k1 = vec2(-.86,0.06);
	l1 = vec2(-.84,.06);
	m1 = vec2(-.825,-.05);
	n1 = vec2(-.775,-.05);
	o1 = vec2(-.825,.05);
	p1 = vec2(-.775,.05);
	*/
	a1 = vec2(-.025,.05);
	b1 = vec2(-.075,.05);
	c1 = vec2(-.025,-.05);
	d1 = vec2(-.075,-.05);
	e1 = vec2(-.025,.02);
	f1 = vec2(-.025,-.02);
	g1 = vec2(.025,.02);
	h1 = vec2(.025,-.02);
	i1 = vec2(-.01,.02);
	j1 = vec2(.01,.02);
	k1 = vec2(-.01,0.06);
	l1 = vec2(.01,.06);
	m1 = vec2(.025,-.05);
	n1 = vec2(.075,-.05);
	o1 = vec2(.025,.05);
	p1 = vec2(.075,.05);
	var arrayOfPoints = [a1, b1, c1, d1, e1, f1, g1, h1, i1, j1, k1, l1, j1, i1, g1, h1, m1, n1, o1, p1];

	// Create buffer in graphics card for shader
	tankBuffer1 = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, tankBuffer1 );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(arrayOfPoints), gl.STATIC_DRAW );
}

// Initialize points in Tank 2 and create buffer
function initTank2()
{
	var a2,b2,c2,d2,e2,f2,g2,h2,i2,j2,k2,l2,m2,n2,o2,p2;
	/*
	a2 = vec2(.875,.05);
	b2 = vec2(.925,.05);
	c2 = vec2(.875,-.05);
	d2 = vec2(.925,-.05);
	e2 = vec2(.9,.02);
	f2 = vec2(.9,-.02);
	g2 = vec2(.8,.02);
	h2 = vec2(.8,-.02);
	i2 = vec2(.86,.02);
	j2 = vec2(.84,.02);
	k2 = vec2(.86,0.06);
	l2 = vec2(.84,.06);
	m2 = vec2(.825,-.05);
	n2 = vec2(.775,-.05);
	o2 = vec2(.825,.05);
	p2 = vec2(.775,.05);
	*/
	a2 = vec2(-.025,.05);
	b2 = vec2(-.075,.05);
	c2 = vec2(-.025,-.05);
	d2 = vec2(-.075,-.05);
	e2 = vec2(-.025,.02);
	f2 = vec2(-.025,-.02);
	g2 = vec2(.025,.02);
	h2 = vec2(.025,-.02);
	i2 = vec2(-.01,.02);
	j2 = vec2(.01,.02);
	k2 = vec2(-.01,0.06);
	l2 = vec2(.01,.06);
	m2 = vec2(.025,-.05);
	n2 = vec2(.075,-.05);
	o2 = vec2(.025,.05);
	p2 = vec2(.075,.05);
	var arrayOfPoints = [a2, b2, c2, d2, e2, f2, g2, h2, i2, j2, k2, l2, j2, i2, g2, h2, m2, n2, o2, p2];

	// Create buffer in graphics card for shader
	tankBuffer2 = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, tankBuffer2 );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(arrayOfPoints), gl.STATIC_DRAW );
}

// Initialize points for hitbox of Tank 1 and create buffer
function initHitbox1()
{
	var p0, p1, p2, p3;
	p0 = vec2( .08, -.055 );
	p1 = vec2( -.08, -.055 );
	p2 = vec2( .08, .065 );
	p3 = vec2( -.08, .065 );
	var arrayOfPoints = [p0, p1, p2, p3];

	// Create buffer in graphics card for shader
	hitboxBuffer1 = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, hitboxBuffer1 );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(arrayOfPoints), gl.STATIC_DRAW );
}

// Initialize points for hitbox of Tank 2 and create buffer
function initHitbox2()
{
	var p0, p1, p2, p3;
	p0 = vec2( .08, -.055 );
	p1 = vec2( -.08, -.055 );
	p2 = vec2( .08, .065 );
	p3 = vec2( -.08, .065 );
	var arrayOfPoints = [p0, p1, p2, p3];

	// Create buffer in graphics card for shader
	hitboxBuffer2 = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, hitboxBuffer2 );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(arrayOfPoints), gl.STATIC_DRAW );
}

// Initialize points for bullet of Tank 1 and create buffer
function initBullet1()
{
	var p0, p1, p2, p3;
	p0 = vec2( -.01, -.01 );
	p1 = vec2( .0, .01 );
	p2 = vec2( .01, -.01 );
	var arrayOfPoints = [p0, p1, p2];

	// Create buffer in graphics card for shader
	bulletBuffer1 = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, bulletBuffer1 );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(arrayOfPoints), gl.STATIC_DRAW );
}

// Initialize points for bullet of Tank 2 and create buffer
function initBullet2()
{
	var p0, p1, p2, p3;
	p0 = vec2( -.01, -.01 );
	p1 = vec2( .0, .01 );
	p2 = vec2( .01, -.01 );
	var arrayOfPoints = [p0, p1, p2];

	// Create buffer in graphics card for shader
	bulletBuffer2 = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, bulletBuffer2 );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(arrayOfPoints), gl.STATIC_DRAW );
}

function moveRedTank()
{
	var distance = 0;

	if( controller["w"].pressed )
		distance = .01;
	if( controller["s"].pressed )
		distance = -.01;
	if( controller["a"].pressed )
		thetaValue1 -= Math.PI/16;
	if( controller["d"].pressed )
		thetaValue1 += Math.PI/16;
	if( controller["e"].pressed && !shoot1 )
		shoot1 = true;

	// Move to new X and Y based on current angle
	tx1 += distance*Math.sin(thetaValue1);
	ty1 += distance*Math.cos(thetaValue1);

	// Keep within bounds of canvas
	if( tx1 >= .95 )
		tx1 -= .1;
	if( tx1 <= -.95 )
		tx1 += .1;
	if( ty1 >= .95 )
		ty1 -= .1;
	if( ty1 <= -.95 )
		ty1 += .1;
	
	// Apply transformations to tank, hitbox, and bullet
	gl.useProgram( tankShaderProgram1 );
	MrValue1 = [Math.cos( thetaValue1 ), -Math.sin( thetaValue1 ), 0,
		Math.sin( thetaValue1 ), Math.cos( thetaValue1 ), 0,
		0, 0, 1];
	gl.uniformMatrix3fv( MrUni1, false, MrValue1 );
	MtValue1 = [1.0, .0, .0,
		.0, 1.0, .0,
		tx1, ty1, 1.0];
	gl.uniformMatrix3fv( MtUni1, false, MtValue1 );

	gl.useProgram( hitboxShaderProgram1 );
	gl.uniformMatrix3fv( MrHitbox1, false, MrValue1 );
	gl.uniformMatrix3fv( MtHitbox1, false, MtValue1 );
}
			
function moveBlueTank()
{
	var distance = 0;
	
	if( controller["i"].pressed )
		distance = .01;
	if( controller["k"].pressed )
		distance = -.01;
	if( controller["j"].pressed )
		thetaValue2 -= Math.PI/16;
	if( controller["l"].pressed )
		thetaValue2 += Math.PI/16;
	if( controller["o"].pressed && !shoot2 )
		shoot2 = true;

	// Move to new X and Y based on current angle
	tx2 += distance*Math.sin(thetaValue2);
	ty2 += distance*Math.cos(thetaValue2);

	// Keep within bounds of canvas
	if( tx2 >= .95 )
		tx2 -= .1;
	if( tx2 <= -.95 )
		tx2 += .1;
	if( ty2 >= .95 )
		ty2 -= .1;
	if( ty2 <= -.95 )
		ty2 += .1;
	
	// Apply transformation to tank, hitbox, and bullet
	gl.useProgram( tankShaderProgram2 );
	MrValue2 = [Math.cos( thetaValue2 ), -Math.sin( thetaValue2 ), 0,
		Math.sin( thetaValue2 ), Math.cos( thetaValue2 ), 0,
		0, 0, 1];
	gl.uniformMatrix3fv( MrUni2, false, MrValue2 );
	MtValue2 = [1.0, .0, .0,
		.0, 1.0, .0,
		tx2, ty2, 1.0];
	gl.uniformMatrix3fv( MtUni2, false, MtValue2 );

	gl.useProgram( hitboxShaderProgram2 );
	gl.uniformMatrix3fv( MrHitbox2, false, MrValue2 );
	gl.uniformMatrix3fv( MtHitbox2, false, MtValue2 );
}

function moveBullet1()
{
	if( !shoot1 )
	{
		txBullet1 = tx1;
		tyBullet1 = ty1;
		bulletTheta1 = thetaValue1;
	}
	else
	{
		// Four vertices of hitbox 2
		var A = vec2( -.08 + tx2, .065 + ty2 );
		var B = vec2( .08 + tx2, .066 + ty2 );
		var C = vec2( .08 + tx2, -.055 + ty2 );
		var D = vec2( -.08 + tx2, -.055 + ty2 );

		// Current location of bullet
		var P = vec2( txBullet1, tyBullet1 );		

		// Side lengths of hitbox 2
		var AB = Math.sqrt( (A[0]-B[0])*(A[0]-B[0]) + (A[1]-B[1])*(A[1]-B[1]) );
		var BC = Math.sqrt( (B[0]-C[0])*(B[0]-C[0]) + (B[1]-C[1])*(B[1]-C[1]) );
		var CD = Math.sqrt( (C[0]-D[0])*(C[0]-D[0]) + (C[1]-D[1])*(C[1]-D[1]) );
		var DA = Math.sqrt( (D[0]-A[0])*(D[0]-A[0]) + (D[1]-A[1])*(D[1]-A[1]) );

		// Length from vertices to point P
		var AP = Math.sqrt( (A[0]-P[0])*(A[0]-P[0]) + (A[1]-P[1])*(A[1]-P[1]) );
		var BP = Math.sqrt( (B[0]-P[0])*(B[0]-P[0]) + (B[1]-P[1])*(B[1]-P[1]) );
		var CP = Math.sqrt( (C[0]-P[0])*(C[0]-P[0]) + (C[1]-P[1])*(C[1]-P[1]) );
		var DP = Math.sqrt( (D[0]-P[0])*(D[0]-P[0]) + (D[1]-P[1])*(D[1]-P[1]) );

		// Area test for collision
		var area = AB * BC;

		var u1 = ( AB + AP + BP ) / 2;
		var u2 = ( BC + BP + CP ) / 2;
		var u3 = ( CD + CP + DP ) / 2;
		var u4 = ( DA + DP + AP ) / 2;

		var area1 = Math.sqrt( u1 * ( u1 - AB ) * ( u1 - AP ) * ( u1 - BP ) );
		var area2 = Math.sqrt( u2 * ( u2 - BC ) * ( u2 - BP ) * ( u2 - CP ) );
		var area3 = Math.sqrt( u3 * ( u3 - CD ) * ( u3 - CP ) * ( u3 - DP ) );
		var area4 = Math.sqrt( u4 * ( u4 - DA ) * ( u4 - DP ) * ( u4 - AP ) );
		var areaT = area1 + area2 + area3 + area4;

		// If the bullet is in the opposing tank hitbox, show win screen
		if( ( (area-.005) <= areaT ) && (area+.0005 >= areaT ) )
		{
			winscreen( "Blue" );
		}
		// Reset bullet to current tank position if bullet leaves canvas
		else if( (txBullet1 >= 1.0) || (txBullet1 <= -1.0)
			|| (tyBullet1 >= 1.0) || (tyBullet1 <= -1.0) )
		{
			txBullet1 = tx1;
			tyBullet1 = ty1;
			bulletTheta1 = thetaValue1;
			shoot1 = false;
		}
		// Keep moving forward!
		else
		{
			txBullet1 += .075 * Math.sin( bulletTheta1 );
			tyBullet1 += .075 * Math.cos( bulletTheta1 );
			MtValue1 = [ 1.0, .0, .0,
				.0, 1.0, .0,
				txBullet1, tyBullet1, 1.0];
		}
	}

	gl.useProgram( bulletShaderProgram1 );
	gl.uniformMatrix3fv( MrBullet1, false, MrValue1 );
	gl.uniformMatrix3fv( MtBullet1, false, MtValue1 );
}

function moveBullet2()
{
	if( !shoot2 )
	{
		txBullet2 = tx2;
		tyBullet2 = ty2;
		bulletTheta2 = thetaValue2;
	}
	else
	{
		// Four vertices of hitbox 1
		var A = vec2( -.08 + tx1, .065 + ty1 );
		var B = vec2( .08 + tx1, .066 + ty1 );
		var C = vec2( .08 + tx1, -.055 + ty1 );
		var D = vec2( -.08 + tx1, -.055 + ty1 );

		// Current location of bullet
		var P = vec2( txBullet2, tyBullet2 );		

		// Side lengths of hitbox 1
		var AB = Math.sqrt( (A[0]-B[0])*(A[0]-B[0]) + (A[1]-B[1])*(A[1]-B[1]) );
		var BC = Math.sqrt( (B[0]-C[0])*(B[0]-C[0]) + (B[1]-C[1])*(B[1]-C[1]) );
		var CD = Math.sqrt( (C[0]-D[0])*(C[0]-D[0]) + (C[1]-D[1])*(C[1]-D[1]) );
		var DA = Math.sqrt( (D[0]-A[0])*(D[0]-A[0]) + (D[1]-A[1])*(D[1]-A[1]) );

		// Length from vertices to point P
		var AP = Math.sqrt( (A[0]-P[0])*(A[0]-P[0]) + (A[1]-P[1])*(A[1]-P[1]) );
		var BP = Math.sqrt( (B[0]-P[0])*(B[0]-P[0]) + (B[1]-P[1])*(B[1]-P[1]) );
		var CP = Math.sqrt( (C[0]-P[0])*(C[0]-P[0]) + (C[1]-P[1])*(C[1]-P[1]) );
		var DP = Math.sqrt( (D[0]-P[0])*(D[0]-P[0]) + (D[1]-P[1])*(D[1]-P[1]) );

		// Area test for collision
		var area = AB * BC;

		var u1 = ( AB + AP + BP ) / 2;
		var u2 = ( BC + BP + CP ) / 2;
		var u3 = ( CD + CP + DP ) / 2;
		var u4 = ( DA + DP + AP ) / 2;

		var area1 = Math.sqrt( u1 * ( u1 - AB ) * ( u1 - AP ) * ( u1 - BP ) );
		var area2 = Math.sqrt( u2 * ( u2 - BC ) * ( u2 - BP ) * ( u2 - CP ) );
		var area3 = Math.sqrt( u3 * ( u3 - CD ) * ( u3 - CP ) * ( u3 - DP ) );
		var area4 = Math.sqrt( u4 * ( u4 - DA ) * ( u4 - DP ) * ( u4 - AP ) );
		var areaT = area1 + area2 + area3 + area4;

		// If the bullet is in the opposing tank hitbox, show win screen
		if( ( (area-.005) <= areaT ) && (area+.0005 >= areaT ) )
		{
			winscreen( "Red" );
		}
		// Reset bullet to current tank position if bullet leaves canvas
		else if( (txBullet2 >= 1.0) || (txBullet2 <= -1.0)
			|| (tyBullet2 >= 1.0) || (tyBullet2 <= -1.0) )
		{
			txBullet2 = tx2;
			tyBullet2 = ty2;
			bulletTheta2 = thetaValue2;
			shoot2 = false;
		}
		// Keep moving forward!
		else
		{
			txBullet2 += .075 * Math.sin( bulletTheta2 );
			tyBullet2 += .075 * Math.cos( bulletTheta2 );
			MtValue2 = [ 1.0, .0, .0,
				.0, 1.0, .0,
				txBullet2, tyBullet2, 1.0];
		}
	}

	gl.useProgram( bulletShaderProgram2 );
	gl.uniformMatrix3fv( MrBullet2, false, MrValue2 );
	gl.uniformMatrix3fv( MtBullet2, false, MtValue2 );
}

function winscreen( color )
{
	if( color == "Blue" )
		score[0]++;
	else
		score[1]++;
	
	alert( color + " has won the game! Score: " + score[0] + " - " + score[1] );
	document.getElementById(winner).innerHTML = color + " has won the game!";
	document.getElementById(score).innerHTML = "Score: " + score[0] + " - " + score[1];
}

function toggleHitbox()
{
	hitboxes = !hitboxes;
}

function reset()
{
	// Code for rotation of tanks
	gl.useProgram( tankShaderProgram1 );
	thetaValue1 = 0;
	MrValue1 = [Math.cos( thetaValue1 ), -Math.sin( thetaValue1 ), 0,
		Math.sin( thetaValue1 ), Math.cos( thetaValue1 ), 0,
		0, 0, 1];
	MrUni1 = gl.getUniformLocation( tankShaderProgram1, "Mr" );
	gl.uniformMatrix3fv( MrUni1, false, MrValue1 );

	gl.useProgram( hitboxShaderProgram1 );
	MrHitbox1 = gl.getUniformLocation( hitboxShaderProgram1, "Mr" );
	gl.uniformMatrix3fv( MrHitbox1, false, MrValue1 );
	gl.useProgram( bulletShaderProgram1 );
	MrBullet1 = gl.getUniformLocation( bulletShaderProgram1, "Mr" );
	gl.uniformMatrix3fv( MrBullet1, false, MrValue1 );

	gl.useProgram( tankShaderProgram2 );
	thetaValue2 = 0;
	MrValue2 = [Math.cos( thetaValue2 ), -Math.sin( thetaValue2 ), 0,
		Math.sin( thetaValue2 ), Math.cos( thetaValue2 ), 0,
		0, 0, 1];
	MrUni2 = gl.getUniformLocation( tankShaderProgram2, "Mr" );
	gl.uniformMatrix3fv( MrUni2, false, MrValue2 );

	gl.useProgram( hitboxShaderProgram2 );
	MrHitbox2 = gl.getUniformLocation( hitboxShaderProgram2, "Mr" );
	gl.uniformMatrix3fv( MrHitbox2, false, MrValue2 );
	gl.useProgram( bulletShaderProgram2 );
	MrBullet2 = gl.getUniformLocation( bulletShaderProgram2, "Mr" );
	gl.uniformMatrix3fv( MrBullet2, false, MrValue2 );

	// Code for translation of tanks
	gl.useProgram( tankShaderProgram1 );
	tx1 = -.85;
	ty1 = .0;
	MtValue1 = [ 1.0, .0, .0,
		.0, 1.0, .0,
		tx1, ty1, 1.0]
	MtUni1 = gl.getUniformLocation( tankShaderProgram1, "Mt" );
	gl.uniformMatrix3fv( MtUni1, false, MtValue1 );

	gl.useProgram( hitboxShaderProgram1 );
	MtHitbox1 = gl.getUniformLocation( hitboxShaderProgram1, "Mt" );
	gl.uniformMatrix3fv( MtHitbox1, false, MtValue1 );
	gl.useProgram( bulletShaderProgram1 );
	MtBullet1 = gl.getUniformLocation( bulletShaderProgram1, "Mt" );
	gl.uniformMatrix3fv( MtBullet1, false, MtValue1 );

	gl.useProgram( tankShaderProgram2 );
	tx2 = .85;
	ty2 = .0;
	MtValue2 = [ 1.0, .0, .0 ,
		.0, 1.0, .0,
		tx2, ty2, 1.0]
	MtUni2 = gl.getUniformLocation( tankShaderProgram2, "Mt" );
	gl.uniformMatrix3fv( MtUni2, false, MtValue2 );

	gl.useProgram( hitboxShaderProgram2 );
	MtHitbox2 = gl.getUniformLocation( hitboxShaderProgram2, "Mt" );
	gl.uniformMatrix3fv( MtHitbox2, false, MtValue2 );
	gl.useProgram( bulletShaderProgram2 );
	MtBullet2 = gl.getUniformLocation( bulletShaderProgram2, "Mt" );
	gl.uniformMatrix3fv( MtBullet2, false, MtValue2 );

	// Neither tank has shot yet
	shoot1 = false;
	shoot2 = false;

	render();
}

function render()
{
	// Clear previous frame of animation
	gl.clear( gl.COLOR_BUFFER_BIT );

	if( n == 3 )
	{
		moveRedTank();
		moveBlueTank();
		moveBullet1();
		moveBullet2();
		n = 0;
	}

	// Draw Hitbox 1 only if it is enabled
	gl.useProgram( hitboxShaderProgram1 );
	gl.bindBuffer( gl.ARRAY_BUFFER, hitboxBuffer1 );
	var hitboxPositionAttribute1 = gl.getAttribLocation( hitboxShaderProgram1, "hitboxPosition" );
	gl.vertexAttribPointer( hitboxPositionAttribute1, 2, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( hitboxPositionAttribute1 );
	if( hitboxes )
	{
		 gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
	}

	// Draw Bullet 1 to the screen
	gl.useProgram( bulletShaderProgram1 );
	gl.bindBuffer( gl.ARRAY_BUFFER, bulletBuffer1 );
	var bulletPositionAttribute1 = gl.getAttribLocation( bulletShaderProgram1, "bulletPosition" );
	gl.vertexAttribPointer( bulletPositionAttribute1, 2, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( bulletPositionAttribute1 );
	gl.drawArrays( gl.TRIANGLE_STRIP, 0, 3 );
	
	// Draw Hitbox 2 only if it is enabled
	gl.useProgram( hitboxShaderProgram2 );
	gl.bindBuffer( gl.ARRAY_BUFFER, hitboxBuffer2 );
	var hitboxPositionAttribute2 = gl.getAttribLocation( hitboxShaderProgram2, "hitboxPosition" );
	gl.vertexAttribPointer( hitboxPositionAttribute2, 2, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( hitboxPositionAttribute2 );
	if( hitboxes )
	{
	 gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
	}

	// Draw Bullet 2 to the screen
	gl.useProgram( bulletShaderProgram2 );
	gl.bindBuffer( gl.ARRAY_BUFFER, bulletBuffer2 );
	var bulletPositionAttribute2 = gl.getAttribLocation( bulletShaderProgram2, "bulletPosition" );
	gl.vertexAttribPointer( bulletPositionAttribute2, 2, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( bulletPositionAttribute2 );
	gl.drawArrays( gl.TRIANGLE_STRIP, 0, 3 );


	// Draw Tank 1 to the screen
	gl.useProgram( tankShaderProgram1 );
	gl.bindBuffer( gl.ARRAY_BUFFER, tankBuffer1 );
	var tankPositionAttribute1 = gl.getAttribLocation( tankShaderProgram1, "tankPosition" );
	gl.vertexAttribPointer( tankPositionAttribute1, 2, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( tankPositionAttribute1 );
	gl.drawArrays( gl.TRIANGLE_STRIP, 0, 20 );

	// Draw Tank 2 to the screen
	gl.useProgram( tankShaderProgram2 );
	gl.bindBuffer( gl.ARRAY_BUFFER, tankBuffer2 );
	var tankPositionAttribute2 = gl.getAttribLocation( tankShaderProgram2, "tankPosition" );
	gl.vertexAttribPointer( tankPositionAttribute2, 2, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( tankPositionAttribute2 );
	gl.drawArrays( gl.TRIANGLE_STRIP, 0, 20 );

	n++;
	requestAnimFrame( render );
}
