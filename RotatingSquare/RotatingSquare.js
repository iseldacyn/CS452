var gl;
var shaderProgramSquare;

var thetaUniform;
var theta;

var flag;
var mousePositionUniform;
var mouseX;
var mouseY;

var colorUniform;
var flip;
var r;
var g;
var b;

function init() {
    // Set up the canvas
    var canvas=document.getElementById("gl-canvas");
    gl=WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert( "WebGL is not available" ); }
    
    // Set up the viewport
    gl.viewport( 0, 0, 512, 512 );   // x, y, width, height
    
    
    // Set up the background color
    gl.clearColor( 1.0, 0.0, 0.0, 1.0 );
    
    shaderProgramSquare = initShaders( gl, "vertex-shader-square",
                                      "fragment-shader-square" );
    gl.useProgram( shaderProgramSquare );

	theta = .0;
	thetaUniform = gl.getUniformLocation( shaderProgramSquare, "theta" );
	gl.uniform1f( thetaUniform, theta );

	mouseX = 0;
	mouseY = 0;
	mousePositionUniform = gl.getUniformLocation( shaderProgramSquare, "mousePosition" );
	gl.uniform2f( mousePositionUniform, mouseX, mouseY );

	flag = 1;
	flip = 1;

	r = .0;
	g = .0;
	b = .0;
	colorUniform = gl.getUniformLocation( shaderProgramSquare, "color" );
	gl.uniform4f( colorUniform, r, g, b, 1.0 );
    
    setupSquare();
    
    drawSquare();
}

function setupSquare() {
    
    // Enter array set up code here
    var p0 = vec2( .2, .2 );
    var p1 = vec2( -.2, .2 );
    var p2 = vec2( -.2, -.2 );
    var p3 = vec2( .2, -.2 );
    var arrayOfPoints = [p0, p1, p2, p3];
    
    // Create a buffer on the graphics card,
    // and send array to the buffer for use
    // in the shaders
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(arrayOfPoints), gl.STATIC_DRAW );
    
    // Create a pointer that iterates over the
    // array of points in the shader code
    var myPositionAttribute = gl.getAttribLocation( shaderProgramSquare, "myPosition" );
    gl.vertexAttribPointer( myPositionAttribute, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( myPositionAttribute );    
}

function moveShapeKeys( event ) {
	// a = 97;
	// d = 100;
	// s = 115;
	// w = 119;
	
	var keyCode = event.keyCode;

	var nudge = .01;

	if ( keyCode == 97 ) {
		mouseX -= nudge;
	}
	if ( keyCode == 100 ) {
		mouseX += nudge;
	}
	if ( keyCode == 115 ) {
		mouseY -= nudge;
	}
	if ( keyCode == 119 ) {
		mouseY += nudge;
	}
	gl.uniform2f( mousePositionUniform, mouseX, mouseY );
}

function moveShape( event ) {
	mouseX = event.clientX / 512.0 * 2.0 - 1.0;
	mouseY = -(event.clientY / 512.0 * 2.0 - 1.0);  

	gl.uniform2f( mousePositionUniform, mouseX, mouseY );
}

function stopStartAnim() {
	flag = 1 - flag;
}

function drawSquare() {
        
    // Force the WebGL context to clear the color buffer
    gl.clear( gl.COLOR_BUFFER_BIT );
    
	theta += ( 0.02 * flag );
	gl.uniform1f( thetaUniform, theta );

	b = b + (.02 * flip )
	if ( b >= 1.0 ) {
		flip = -flip;
	}
	if ( b <= 0 ) {
		flip = -flip;
	}

	gl.uniform4f( colorUniform, r, g, b, 1.0 );
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );

	requestAnimFrame( drawSquare );
}
