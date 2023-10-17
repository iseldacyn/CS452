var gl;
var shaderProgram;

// Rotation
var thetaValue;
var MrValue;
var MrUniform;
var flag;

// Translation
var tx;
var ty;
var MtValue;
var MtUniform;

// Key press events
var speed;
var xflag;
var yflag;
var mousePositionUniform;
var mouseX;
var mouseY;

function init()
{
	// Set up canvas
	var canvas = document.getElementById( "gl-canvas" );
	gl = WebGLUtils.setupWebGL( canvas );
	if ( !gl ) { alert( "WebGLG is not available!" ); }

	// Set up viewport
	gl.viewport( 0, 0, 512, 512 );

	// Set up background color
	gl.clearColor( .53, .81, .92, 1.0 );

	shaderProgram = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( shaderProgram );

	// Force WebGL context to clear color buffer
	gl.clear( gl.COLOR_BUFFER_BIT );

	// Code for rotation of the polygon
	thetaValue = .0;
	MrValue = [Math.cos( thetaValue ),
		-Math.sin( thetaValue ), 0,
		Math.sin( thetaValue ),
		Math.cos( thetaValue ), 0,
		0, 0, 1];
	MrUniform = gl.getUniformLocation( shaderProgram, "Mr" );
	gl.uniformMatrix3fv( MrUniform, false, MrValue );

	// Start without rotations
	flag = 0;

	// Code for translation of the polygon
	tx = .0;
	ty = .0;
	MtValue = [1, 0, 0, 0, 1, 0, tx, ty, 1];
	MtUniform = gl.getUniformLocation( shaderProgram, "Mt" );
	gl.uniformMatrix3fv( MtUniform, false, MtValue );

	// Start moving only to the right
	speed = 1;
	xflag = 1;
	yflag = 0;

	// Mouse position initialization
	mouseX = 0;
	mouseY = 0;
	mousePositionUniform = gl.getUniformLocation( shaderProgram, "mousePosition" );
	gl.uniform2f( mousePositionUniform, mouseX, mouseY );

	setupPolygon();

	render();
}

function setupPolygon()
{
	// Array set up
	var p0 = vec2( -.1, -.2 );
	var p1 = vec2( -.2, 0 );
	var p2 = vec2( -.1, .2 );
	var p3 = vec2( .1, .2 );
	var p4 = vec2( .2, 0 );
	var p5 = vec2( .1, -.2 );
	var arrayOfPoints = [p0, p1, p2, p3, p4, p5];

	// Create buffer in graphics card for shader
	var bufferId = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(arrayOfPoints), gl.STATIC_DRAW );

	// Creates a pointer to iterate over array of points in shader
	var myPositionAttribute = gl.getAttribLocation( shaderProgram, "myPosition" );
	gl.vertexAttribPointer( myPositionAttribute, 2, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( myPositionAttribute );
}

// Mouse Click
function moveShape( event )
{
	mouseX = event.clientX / 512.0 * 2.0 - 1.0;
	mouseY = -(event.clientY / 512.0 * 2.0 - 1.0);

	tx = .0;
	ty = .0;

	gl.uniform2f( mousePositionUniform, mouseX, mouseY );
}

// Key Press
function moveShapeKeys( event )
{
	var keyCode = event.keyCode;

	// If "a" is pressed, move left
	if ( keyCode == 97 )
	{
		xflag = -1;
		yflag = 0;
	}
	// If "d" is pressed, move right
	if ( keyCode == 100 )
	{
		xflag = 1;
		yflag = 0;
	}
	// If "s" is pressed, move down
	if ( keyCode == 115 )
	{
		xflag = 0;
		yflag = -1;
	}
	// If "w" is pressed, move up
	if ( keyCode == 119 )
	{
		xflag = 0;
		yflag = 1;
	}
}

// Increase/Decrease Button function
function velocity( yesno )
{
	if ( yesno )
		speed *= 1.5;
	else
		speed *= .75;
}

// Rotation Button function
function rotate( yesno )
{
	flag = yesno;
}

function render()
{
	// Starts translation
	tx += ( .002 * xflag ) * speed;
	ty += ( .002 * yflag ) * speed;
	MtValue = [1, 0, 0, 0, 1, 0, tx, ty, 1];
	gl.uniformMatrix3fv( MtUniform, false, MtValue );

	// Begins rotation only when button is pressed
	thetaValue += ( .02 * flag );
	MrValue = [Math.cos( thetaValue ),
		-Math.sin( thetaValue ), 0,
		Math.sin( thetaValue ),
		Math.cos( thetaValue ), 0,
		0, 0, 1];
	gl.uniformMatrix3fv( MrUniform, false, MrValue );


	// Force WebGL context to clear color buffer
	gl.clear( gl.COLOR_BUFFER_BIT );

	// Draw and animate the shape			
	gl.drawArrays( gl.TRIANGLE_FAN, 0, 6 );
	requestAnimFrame( render );
}
