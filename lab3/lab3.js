var gl;
var myShaderProgram;

// Rotation Variables
var alpha;
var Mrx;
var MrxUni;
var beta;
var Mry;
var MryUni;
var gamma;
var Mrz;
var MrzUni;

// Scaling Variables
var sx;
var sy;
var Ms;
var MsUni;

// Translation Variables
var tx;
var ty;
var Mt;
var MtUni;

function init()
{
	// WebGL setup code
    var canvas=document.getElementById("gl-canvas");
    gl=WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert( "WebGL is not available" ); }
    
    gl.viewport( 0, 0, 512, 512 );
    
    gl.clearColor( .68, 86, .68, 1.0 );

    
    myShaderProgram =
        initShaders( gl,"vertex-shader", "fragment-shader" );
    gl.useProgram( myShaderProgram );
    
    // Will include depth test to render faces correctly!
    gl.enable( gl.DEPTH_TEST );

	// X Rotation Setup
	alpha = .0;
	Mrx = [1.0, .0, .0, .0,
		   .0, Math.cos(alpha), -Math.sin(alpha), .0,
		   .0, Math.sin(alpha), Math.cos(alpha), .0,
		   .0, .0, .0, 1.0];
	MrxUni = gl.getUniformLocation( myShaderProgram, "Mrx" );
	gl.uniformMatrix4fv( MrxUni, false, Mrx );

	// Y Rotation Setup
	beta = .0;
	Mry = [Math.cos(beta), .0, -Math.sin(beta), .0,
		   .0, 1.0, .0, .0,
		   Math.sin(beta), .0, Math.cos(beta), .0,
		   .0, .0, .0, 1.0];
	MryUni = gl.getUniformLocation( myShaderProgram, "Mry" );
	gl.uniformMatrix4fv( MryUni, false, Mry );

	// Z Rotation Setup
	gamma = .0;
	Mrz = [Math.cos(gamma), -Math.sin(gamma), .0, .0,
		   Math.sin(gamma), Math.cos(gamma), .0, .0,
		   .0, .0, 1.0, .0,
		   .0, .0, .0, 1.0];
	MrzUni = gl.getUniformLocation( myShaderProgram, "Mrz" );
	gl.uniformMatrix4fv( MrzUni, false, Mrz );

	// Scaling Setup
	sx = 1.0;
	sy = 1.0;
	Ms = [sx, .0, .0, .0,
		  .0, sy, .0, .0,
		  .0, .0, 1.0, .0,
		  .0, .0, .0, 1.0];
	MsUni = gl.getUniformLocation( myShaderProgram, "Ms" );
	gl.uniformMatrix4fv( MsUni, false, Ms );

	// Translation Setup
	tx = .0;
	ty = .0;
	Mt = [1.0, .0, .0, .0,
		  .0, 1.0, .0, .0,
		  .0, .0, 1.0, .0,
		  tx, ty, .0, 1.0];
	MtUni = gl.getUniformLocation( myShaderProgram, "Mt" );
	gl.uniformMatrix4fv( MtUni, false, Mt );
    
	// Initialize and render the tetrahedron
    setupTetra();
    render();
}

function setupTetra()
{
    // Vertices of Tetrahedron
    var vertices = [vec4( .0, -.25, .0, 1), 		// p0
                    vec4( -.25, .25, -.25, 1), 		// p1
                    vec4( .25, .25, -.25, 1), 		// p2
                    vec4( .25,  .25, .25, 1), 		// p3
                    vec4( -.25,  .25, .25, 1)]; 	// p4

    // Colors at Vertices of Tetrahedron
    var vertexColors = [vec4( 0.0, 0.0, 0.0, 1.0), 	// p0
                        vec4( 1.0, .97, .68, 1.0),	// p1
                        vec4( 1.0, .76, .89, 1.0),	// p2
                        vec4( .75, .75, .88, 1.0), 	// p3
                        vec4( 1.0, 1.0, 1.0, 1.0)];	// p4

    // Every face on the cube is divided into two triangles,
    // each triangle is described by three indices into
    // the array "vertices"
    var indexList = [0, 1, 2,
					 0, 2, 3,
					 0, 3, 4,
					 0, 4, 1,
					 1, 3, 4,
					 1, 2, 3];
    
    // Code here to handle putting above lists into buffers
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vertexBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );
    
    var myPosition = gl.getAttribLocation( myShaderProgram, "myPosition" );
    gl.vertexAttribPointer( myPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( myPosition );
    
    var colorBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, colorBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertexColors), gl.STATIC_DRAW );
    
    var myColor = gl.getAttribLocation( myShaderProgram, "myColor" );
    gl.vertexAttribPointer( myColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( myColor );
    
    // Will populate to create buffer for indices
    var iBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, iBuffer );
    gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indexList), gl.STATIC_DRAW );
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
    
    gl.drawElements( gl.TRIANGLES, 18, gl.UNSIGNED_BYTE, 0 );
}

function rotateAroundX()
{
	alpha += .1;
	Mrx = [1.0, .0, .0, .0,
		   .0, Math.cos(alpha), -Math.sin(alpha), .0,
		   .0, Math.sin(alpha), Math.cos(alpha), .0,
		   .0, .0, .0, 1.0];

	gl.uniformMatrix4fv( MrxUni, false, Mrx );
    render();
}

function rotateAroundY()
{
	beta += .1;
	Mry = [Math.cos(beta), .0, -Math.sin(beta), .0,
		   .0, 1.0, .0, .0,
		   Math.sin(beta), .0, Math.cos(beta), .0,
		   .0, .0, .0, 1.0];
	
	gl.uniformMatrix4fv( MryUni, false, Mry );
    render();
}

function rotateAroundZ()
{
	gamma += .1;
	Mrz = [Math.cos(gamma), -Math.sin(gamma), .0, .0,
		   Math.sin(gamma), Math.cos(gamma), .0, .0,
		   .0, .0, 1.0, .0,
		   .0, .0, .0, 1.0];

	gl.uniformMatrix4fv( MrzUni, false, Mrz );
	render();
}

function scale( direction )
{
	switch( direction )
	{
		case 1: sx += .03;
			break;

		case 2: sx -= .03;
			break;

		case 3: sy += .03;
			break;

		case 4: sy -= .03;
			break;
	}

	Ms = [sx, .0, .0, .0,
		  .0, sy, .0, .0,
		  .0, .0, 1.0, .0,
		  .0, .0, .0, 1.0];
	gl.uniformMatrix4fv( MsUni, false, Ms );
	render();
}

function translate( direction )
{
	switch( direction )
	{
		case 1: ty += .02;
			break;

		case 2: tx -= .02;
			break;

		case 3: ty -= .02;
			break;

		case 4: tx += .02;
			break;
	}

	Mt = [1.0, .0, .0, .0,
		  .0, 1.0, .0, .0,
		  .0, .0, 1.0, .0,
		  tx, ty, .0, 1.0];
	gl.uniformMatrix4fv( MtUni, false, Mt );
	render();
}

function moveShapeKeys( event )
{
	switch ( event.keyCode )
	{
		// If "x" is pressed, rotate along the X axis
		case 120: rotateAroundX();
			break;

		// If "y" is pressed, rotate along the Y axis
		case 121: rotateAroundY();
			break;

		// If "z" is pressed, rotate along the Z axis
		case 122: rotateAroundZ();
			break;

		// If "M" is pressed, scale up along the X axis
		case 77: scale( 1 );
			break;

		// If "m" is pressed, scale down along the X axis
		case 109: scale( 2 );
			break;
	
		// If "N" is pressed, scale up along the Y axis
		case 78: scale( 3 );
			break;
		// If "n" is pressed, scale down along the Y axis
		case 110: scale( 4 );
			break;

		// If "w" is pressed, move along the positive Y axis
		case 119: translate( 1 );
			break;

		// If "a" is pressed, move along the positive X axis
		case 97: translate( 2 );
			break;

		// If "s" is pressed, move along the negative Y axis
		case 115: translate( 3 );
			break;

		// If "d" is pressed, move along the negative X axis
		case 100: translate( 4 );
			break;
	}
}

function reset()
{
	// Reset X Rotation
	alpha = .0;
	Mrx = [1.0, .0, .0, .0,
		   .0, Math.cos(alpha), -Math.sin(alpha), .0,
		   .0, Math.sin(alpha), Math.cos(alpha), .0,
		   .0, .0, .0, 1.0];
	MrxUni = gl.getUniformLocation( myShaderProgram, "Mrx" );
	gl.uniformMatrix4fv( MrxUni, false, Mrx );

	// Reset Y Rotation
	beta = .0;
	Mry = [Math.cos(beta), .0, -Math.sin(beta), .0,
		   .0, 1.0, .0, .0,
		   Math.sin(beta), .0, Math.cos(beta), .0,
		   .0, .0, .0, 1.0];
	MryUni = gl.getUniformLocation( myShaderProgram, "Mry" );
	gl.uniformMatrix4fv( MryUni, false, Mry );

	// Reset Z Rotation
	gamma = .0;
	Mrz = [Math.cos(gamma), -Math.sin(gamma), .0, .0,
		   Math.sin(gamma), Math.cos(gamma), .0, .0,
		   .0, .0, 1.0, .0,
		   .0, .0, .0, 1.0];
	MrzUni = gl.getUniformLocation( myShaderProgram, "Mrz" );
	gl.uniformMatrix4fv( MrzUni, false, Mrz );

	// Reset Scaling
	sx = 1.0;
	sy = 1.0;
	Ms = [sx, .0, .0, .0,
		  .0, sy, .0, .0,
		  .0, .0, 1.0, .0,
		  .0, .0, .0, 1.0];
	MsUni = gl.getUniformLocation( myShaderProgram, "Ms" );
	gl.uniformMatrix4fv( MsUni, false, Ms );

	// Reset Translation
	tx = .0;
	ty = .0;
	Mt = [1.0, .0, .0, .0,
		  .0, 1.0, .0, .0,
		  .0, .0, 1.0, .0,
		  tx, ty, .0, 1.0];
	MtUni = gl.getUniformLocation( myShaderProgram, "Mt" );
	gl.uniformMatrix4fv( MtUni, false, Mt );
    
    render();
}
