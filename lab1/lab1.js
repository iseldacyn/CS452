/* Iselda Aiello */
/* CS452 - Computer Graphics */
/* Lab 1 - Create 3 shapes */

var gl;
var MyShaderProgram1;
var MyShaderProgram2;
var MyShaderProgram3;

function init()
{
	// Initialize canvas and WebGL context
	var canvas = document.getElementById( "gl-canvas" );
	gl = WebGLUtils.setupWebGL( canvas );
	if ( !gl ) { alert( "WebGL is not available!" ); }

	// Set up viewport
	gl.viewport( 0, 0, 512, 512 );

	// Set up background color
	gl.clearColor( 0.0, 1.0, 1.0, 1.0 );

	// Force WebGL context to clear the color buffer
	gl.clear( gl.COLOR_BUFFER_BIT );


	// Create shader program for first shape
	myShaderProgram1 = 
		initShaders( gl, "vertex-shader1", "fragment-shader1" );

	// Create shader program for second shape
	myShaderProgram2 = 
		initShaders( gl, "vertex-shader2", "fragment-shader2" );

	// Create shader program for third shape
	myShaderProgram3 = 
		initShaders( gl, "vertex-shader3", "fragment-shader3" );

	// Execute Drawing Functions
	drawFrame();
	drawRoof();
	drawSun();
}

function drawFrame()
{
	// Create array of points
	var arrayOfPoints = [];
	var p0 = vec2( -0.4, -1.0 );
	var p1 = vec2( -0.5, -0.5 );
	var p2 = vec2( -0.4, 0.0 );
	var p3 = vec2( 0.4, 0.0 );
	var p4 = vec2( 0.5, -0.5 );
	var p5 = vec2( 0.4, -1.0 );
	var p6 = vec2( 0.15, -1.0 );
	var p7 = vec2( 0.15, -0.50 );
	var p8 = vec2( -0.15, -0.50 );
	var p9 = vec2( -0.15, -1.0 );
	arrayOfPoints = [ p0, p1, p2, p3, p4, p5, p6, p7, p8, p9 ];

	// Create and send buffer on graphics card for use in shaders
	var bufferId = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(arrayOfPoints), gl.STATIC_DRAW );

	gl.useProgram( myShaderProgram1 );

	// Create a pointer to iterate over the array in shader code
	var myPosition = gl.getAttribLocation( myShaderProgram1, "myPosition" );
	gl.vertexAttribPointer( myPosition, 2, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( myPosition );

	// Draw shape to the screen
	gl.drawArrays( gl.LINE_LOOP, 0, 10 );
}

function drawRoof()
{
	// Create array of points
	var arrayOfPoints = [];
	var p0 = vec2( -0.35, 0.5 );
	var p1 = vec2( 0.0, 0.35 );
	var p2 = vec2( -0.5, 0.0 );
	var p3 = vec2( 0.5, 0.0 );
	var p4 = vec2( 0.35, 0.5 );
	arrayOfPoints = [ p0, p1, p2, p3, p4, p1 ];

	// Create and send buffer on graphics card for use in shaders
	var bufferId = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(arrayOfPoints), gl.STATIC_DRAW );

	gl.useProgram( myShaderProgram2 );

	// Create a pointer to iterate over the array in shader code
	var myPosition = gl.getAttribLocation( myShaderProgram2, "myPosition" );
	gl.vertexAttribPointer( myPosition, 2, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( myPosition );

	// Draw shape to the screen
	gl.drawArrays( gl.TRIANGLE_STRIP, 0, 6 );
}

function drawSun()
{
	// Create ellipse from parametric equations
	var arrayOfPoints = [];
	var theta = 0.0;
	var x = 0.0;
	var y = 0.0;

	var a = 0.5;
	var b = 0.2;

	var h = -0.5;
	var k = 0.8;

	var i = 0;

	var n = 50;

	for ( i = 0; i < n; i++ )
	{
		theta = 2.0 * Math.PI * i / n;
		x = a * Math.cos( theta ) + h;
		y = b * Math.sin( theta ) + k;
		var p = vec2( x, y );
		arrayOfPoints.push( p );
	}

	// Create and send buffer on graphics card for use in shaders
	var bufferId = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(arrayOfPoints), gl.STATIC_DRAW );

	gl.useProgram( myShaderProgram3 );

	// Create a pointer to iterate over the array in shader code
	var myPosition = gl.getAttribLocation( myShaderProgram3, "myPosition" );
	gl.vertexAttribPointer( myPosition, 2, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( myPosition );

	// Draw shape to the screen
	gl.drawArrays( gl.TRIANGLE_FAN, 0, n );
}
