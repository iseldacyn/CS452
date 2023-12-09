var gl;
var shaderTri;
var shaderSq;
var n;

// Rotation Variables
var alpha;
var Mrx;
var MrxUniTri;
var MrxUniSq;
var beta;
var Mry;
var MryUniTri;
var MryUniSq;
var gamma;
var Mrz;
var MrzUniTri;
var MrzUniSq;

// Scaling Variables
var sx;
var sy;
var Ms;
var MsUniTri;
var MsUniSq;

// Translation Variables
var tx;
var ty;
var Mt;
var MtUniTri;
var MsUniSq;

// Texture Mapping
var iBufferTri;
var iBufferSq;
var vertexBufferTri;
var vertexBufferSq;
var textureVertexBufferTri;
var textureVertexBufferSq;
var textureTri;
var textureSq;

const controller = {
	"w": {pressed: false},
	"a": {pressed: false},
	"s": {pressed: false},
	"d": {pressed: false},

	"i": {pressed: false},
	"o": {pressed: false},
	"p": {pressed: false},

	"x": {pressed: false},
	"n": {pressed: false},
	"y": {pressed: false},
	"m": {pressed: false},
}
document.addEventListener( "keydown", (e) => {
	if ( controller[e.key] )
		controller[e.key].pressed = true;
})
document.addEventListener( "keyup", (e) => {
	if ( controller[e.key] )
		controller[e.key].pressed = false;
})

function init()
{
	// WebGL setup code
    var canvas=document.getElementById("gl-canvas");
    gl=WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert( "WebGL is not available" ); }
    
    gl.viewport( 0, 0, canvas.width, canvas.height );
    
    gl.clearColor( .68, .86, .68, 1.0 );

    // Will include depth test to render faces correctly!
    gl.enable( gl.DEPTH_TEST );

    shaderTri =
        initShaders( gl,"vertex-shader-tri", "fragment-shader-tri" );
    gl.useProgram( shaderTri );

	shaderSq =
        initShaders( gl,"vertex-shader-sq", "fragment-shader-sq" );
    gl.useProgram( shaderSq );
    
	// X Rotation Setup
	alpha = .0;
	Mrx = [1.0, .0, .0, .0,
		   .0, Math.cos(alpha), -Math.sin(alpha), .0,
		   .0, Math.sin(alpha), Math.cos(alpha), .0,
		   .0, .0, .0, 1.0];

	gl.useProgram( shaderTri );
	MrxUniTri = gl.getUniformLocation( shaderTri, "MrxTri" );
	gl.uniformMatrix4fv( MrxUniTri, false, Mrx );
	gl.useProgram( shaderSq );
	MrxUniSq = gl.getUniformLocation( shaderSq, "MrxSq" );
	gl.uniformMatrix4fv( MrxUniSq, false, Mrx );

	// Y Rotation Setup
	beta = .0;
	Mry = [Math.cos(beta), .0, -Math.sin(beta), .0,
		   .0, 1.0, .0, .0,
		   Math.sin(beta), .0, Math.cos(beta), .0,
		   .0, .0, .0, 1.0];
	gl.useProgram( shaderTri );
	MryUniTri = gl.getUniformLocation( shaderTri, "MryTri" );
	gl.uniformMatrix4fv( MryUniTri, false, Mry );
	gl.useProgram( shaderSq );
	MryUniSq = gl.getUniformLocation( shaderSq, "MrySq" );
	gl.uniformMatrix4fv( MryUniSq, false, Mry );

	// Z Rotation Setup
	gamma = .0;
	Mrz = [Math.cos(gamma), -Math.sin(gamma), .0, .0,
		   Math.sin(gamma), Math.cos(gamma), .0, .0,
		   .0, .0, 1.0, .0,
		   .0, .0, .0, 1.0];
	gl.useProgram( shaderTri );
	MrzUniTri = gl.getUniformLocation( shaderTri, "MrzTri" );
	gl.uniformMatrix4fv( MrzUniTri, false, Mrz );
	gl.useProgram( shaderSq );
	MrzUniSq = gl.getUniformLocation( shaderSq, "MrzSq" );
	gl.uniformMatrix4fv( MrzUniSq, false, Mrz );

	// Scaling Setup
	sx = 1.0;
	sy = 1.0;
	Ms = [sx, .0, .0, .0,
		  .0, sy, .0, .0,
		  .0, .0, 1.0, .0,
		  .0, .0, .0, 1.0];
	gl.useProgram( shaderTri );
	MsUniTri = gl.getUniformLocation( shaderTri, "MsTri" );
	gl.uniformMatrix4fv( MsUniTri, false, Ms );
	gl.useProgram( shaderSq );
	MsUniSq = gl.getUniformLocation( shaderSq, "Ms" );
	gl.uniformMatrix4fv( MsUniSq, false, Ms );

	// Translation Setup
	tx = .0;
	ty = .0;
	Mt = [1.0, .0, .0, .0,
		  .0, 1.0, .0, .0,
		  .0, .0, 1.0, .0,
		  tx, ty, .0, 1.0];
	gl.useProgram( shaderTri );
	MtUniTri = gl.getUniformLocation( shaderTri, "MtTri" );
	gl.uniformMatrix4fv( MtUniTri, false, Mt );
	gl.useProgram( shaderSq );
	MtUniSq = gl.getUniformLocation( shaderSq, "MtSq" );
	gl.uniformMatrix4fv( MtUniSq, false, Mt );

	// Initialize and render the tetrahedron
    setupTri();
	setupSq();
	n = 0;
    render();
}

function setupTri()
{
	/* lab 3 code
		// Vertices of Tetrahedron
		var vertices = [vec4( .0, .25, .0, 1), 		// p0
						vec4( -.25, -.25, -.25, 1), 		// p1
						vec4( .25, -.25, -.25, 1), 		// p2
						vec4( .25,  -.25, .25, 1), 		// p3
						vec4( -.25,  -.25, .25, 1)]; 	// p4

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
	*/

	gl.useProgram( shaderTri );
    // texture mapping
	var vertices = 
		[ // Front
		-1.0, -1.0, 1.0,
		0.0, 1.0, 0.0,
		1.0, -1.0, 1.0,
		// Right
		1.0, -1.0, 1.0,
		0.0, 1.0, 0.0,
		1.0, -1.0, -1.0,
		// Back
		1.0, -1.0, -1.0,
		0.0, 1.0, 0.0,
		-1.0, -1.0, -1.0,
		// Left
		-1.0, -1.0, -1.0,
		0.0, 1.0, 0.0,
		-1.0, -1.0, 1.0];

	var textureCoordinates = 
		[ // Front
		0.0, 0.0,
		0.5, 1.0,
		1.0, 0.0,
		// Right
		0.0, 0.0,
		0.5, 1.0,
		1.0, 0.0,
		// Back
		0.0, 0.0,
		0.5, 1.0,
		1.0, 0.0,
		// Left
		0.0, 0.0,
		0.5, 1.0,
		1.0, 0.0];
	
	var indexList =
		[ // Front
		0, 1, 2,
		// Right
		3, 4, 5,
		// Back
		6, 7, 8,
		// Left
		9, 10, 11];

	// initialize triangle image
	textureTri = gl.createTexture();
	gl.bindTexture( gl.TEXTURE_2D, textureTri );
	const triImage = new Image();
	var url = "https://i.kym-cdn.com/entries/icons/original/000/040/009/3dsaulcover.jpg";
	triImage.crossOrigin = "anonymous";

	triImage.onload = function () {
		gl.bindTexture( gl.TEXTURE_2D, textureTri );
		gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, true );
		gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, triImage );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );
		return textureTri;
	};
	triImage.src = url;

	// initialization for triangle texture
	iBufferTri = gl.createBuffer();
	gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, iBufferTri  );
	gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexList), gl.STATIC_DRAW);

	vertexBufferTri = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, vertexBufferTri );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

	var vertexPosition = gl.getAttribLocation( shaderTri, "vertexPositionTri" );
	gl.vertexAttribPointer( vertexPosition, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vertexPosition );

	textureVertexBufferTri = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, textureVertexBufferTri );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(textureCoordinates), gl.STATIC_DRAW );

	var textureCoordinate = gl.getAttribLocation( shaderTri, "textureCoordinateTri" );
	gl.vertexAttribPointer( textureCoordinate, 2, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( textureCoordinate );
}

function setupSq()
{
	gl.useProgram( shaderSq );
	// texture mapping
	var vertices =
		[ // Bottom
		-1.0, -1.0, -1.0,
		1.0, -1.0, -1.0,
		1.0, -1.0, 1.0,
		-1.0, -1.0, 1.0];

	var textureCoordinates = 
		[ // Bottom
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0];

	var indexList =
		[ // Bottom
		0, 1, 2,
		0, 2, 3];
	
	// initialize square image
	textureSq = gl.createTexture();
	gl.bindTexture( gl.TEXTURE_2D, textureSq );
	const sqImage = new Image();
	var url = "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/f0d63a99-c688-40c0-90cc-e7334c370b5e/df1e3e8-bc4e6759-3921-4e82-9f89-6c98f747d829.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2YwZDYzYTk5LWM2ODgtNDBjMC05MGNjLWU3MzM0YzM3MGI1ZVwvZGYxZTNlOC1iYzRlNjc1OS0zOTIxLTRlODItOWY4OS02Yzk4Zjc0N2Q4MjkuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.ifkRV0REXZ8Zs5O3pHCNlCQW_O0LJWfCh6qF2bKMFOo";
	sqImage.crossOrigin = "anonymous";

	sqImage.onload = function () {
		gl.bindTexture( gl.TEXTURE_2D, textureSq );
		gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, true );
		gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, sqImage );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );
		return textureSq;
	};
	sqImage.src = url;

	// initialization for square image
	iBufferSq = gl.createBuffer();
	gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, iBufferSq  );
	gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexList), gl.STATIC_DRAW);

	vertexBufferSq = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, vertexBufferSq );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

	var vertexPosition = gl.getAttribLocation( shaderSq, "vertexPositionSq" );
	gl.vertexAttribPointer( vertexPosition, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vertexPosition );

	textureVertexBufferSq = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, textureVertexBufferSq );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(textureCoordinates), gl.STATIC_DRAW );

	var textureCoordinate = gl.getAttribLocation( shaderSq, "textureCoordinateSq" );
	gl.vertexAttribPointer( textureCoordinate, 2, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( textureCoordinate );
}

function render()
{
	if ( n == 0 ) { n=2; reset(); }
	if ( n == 2 ) moveShapeKeys();
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

	gl.useProgram( shaderTri );

	gl.bindBuffer( gl.ARRAY_BUFFER, vertexBufferTri )
	var vertexPositionTri = gl.getAttribLocation( shaderTri, "vertexPositionTri" );
	gl.vertexAttribPointer( vertexPositionTri, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray( vertexPositionTri );

	gl.bindBuffer( gl.ARRAY_BUFFER, textureVertexBufferTri )
	var textureCoordinateTri = gl.getAttribLocation( shaderTri, "textureCoordinateTri" );
	gl.vertexAttribPointer( textureCoordinateTri, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray( textureCoordinateTri );

	gl.activeTexture( gl.TEXTURE0 );
	gl.bindTexture( gl.TEXTURE_2D, textureTri );
	gl.uniform1i( gl.getUniformLocation( shaderTri, "texMap0" ), 0 );

	gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, iBufferTri );
    gl.drawElements( gl.TRIANGLES, 12, gl.UNSIGNED_SHORT, 0 );

	gl.useProgram( shaderSq );

	gl.bindBuffer( gl.ARRAY_BUFFER, vertexBufferSq )
	var vertexPositionSq = gl.getAttribLocation( shaderSq, "vertexPositionSq" );
	gl.vertexAttribPointer( vertexPositionSq, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray( vertexPositionSq );

	gl.bindBuffer( gl.ARRAY_BUFFER, textureVertexBufferSq )
	var textureCoordinateSq = gl.getAttribLocation( shaderSq, "textureCoordinateSq" );
	gl.vertexAttribPointer( textureCoordinateSq, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray( textureCoordinateSq );

	gl.activeTexture( gl.TEXTURE1 );
	gl.bindTexture( gl.TEXTURE_2D, textureSq );
	gl.uniform1i( gl.getUniformLocation( shaderSq, "texMap1" ), 1 );

	gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, iBufferSq );
    gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0 );

	n++;
	n = n % 2 + 2;
	console.log(n);
	requestAnimFrame( render );
}

function rotateAroundX()
{
	alpha += .1;
	Mrx = [1.0, .0, .0, .0,
		   .0, Math.cos(alpha), -Math.sin(alpha), .0,
		   .0, Math.sin(alpha), Math.cos(alpha), .0,
		   .0, .0, .0, 1.0];

	gl.useProgram( shaderTri );
	gl.uniformMatrix4fv( MrxUniTri, false, Mrx );
	gl.useProgram( shaderSq );
	gl.uniformMatrix4fv( MrxUniSq, false, Mrx );
}

function rotateAroundY()
{
	beta += .1;
	Mry = [Math.cos(beta), .0, -Math.sin(beta), .0,
		   .0, 1.0, .0, .0,
		   Math.sin(beta), .0, Math.cos(beta), .0,
		   .0, .0, .0, 1.0];
	
	gl.useProgram( shaderTri );
	gl.uniformMatrix4fv( MryUniTri, false, Mry );
	gl.useProgram( shaderSq );
	gl.uniformMatrix4fv( MryUniSq, false, Mry );
}

function rotateAroundZ()
{
	gamma += .1;
	Mrz = [Math.cos(gamma), -Math.sin(gamma), .0, .0,
		   Math.sin(gamma), Math.cos(gamma), .0, .0,
		   .0, .0, 1.0, .0,
		   .0, .0, .0, 1.0];

	gl.useProgram( shaderTri );
	gl.uniformMatrix4fv( MrzUniTri, false, Mrz );
	gl.useProgram( shaderSq );
	gl.uniformMatrix4fv( MrzUniSq, false, Mrz );
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

	gl.useProgram( shaderTri );
	gl.uniformMatrix4fv( MsUniTri, false, Ms );
	gl.useProgram( shaderSq );
	gl.uniformMatrix4fv( MsUniSq, false, Ms );
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

	gl.useProgram( shaderTri );
	gl.uniformMatrix4fv( MtUniTri, false, Mt );
	gl.useProgram( shaderSq );
	gl.uniformMatrix4fv( MtUniSq, false, Mt );
}

function moveShapeKeys()
{
	// If "i" is pressed, rotate along the X axis
	if ( controller["i"].pressed )
		rotateAroundX();

	// If "o" is pressed, rotate along the Y axis
	if ( controller["o"].pressed )
		rotateAroundY();

	// If "p" is pressed, rotate along the Z axis
	if ( controller["p"].pressed )
		rotateAroundZ();

	// If "X" is pressed, scale up along the X axis
	if ( controller["x"].pressed )
		scale(1);

	// If "n" is pressed, scale down along the X axis
	if ( controller["n"].pressed )
		scale(2);

	// If "y" is pressed, scale up along the Y axis
	if ( controller["y"].pressed )
		scale(3);

	// If "m" is pressed, scale down along the Y axis
	if ( controller["m"].pressed )
		scale(4);

	// If "w" is pressed, move along the positive Y axis
	if ( controller["w"].pressed )
		translate(1);

	// If "a" is pressed, move along the positive X axis
	if ( controller["a"].pressed )
		translate(2);

	// If "s" is pressed, move along the negative Y axis
	if ( controller["s"].pressed )
		translate(3);

	// If "d" is pressed, move along the negative X axis
	if ( controller["d"].pressed )
		translate(4);
}

function reset()
{
	// Reset X Rotation
	alpha = .0;
	Mrx = [1.0, .0, .0, .0,
		   .0, Math.cos(alpha), -Math.sin(alpha), .0,
		   .0, Math.sin(alpha), Math.cos(alpha), .0,
		   .0, .0, .0, 1.0];
	gl.useProgram( shaderTri );
	MrxUniTri = gl.getUniformLocation( shaderTri, "MrxTri" );
	gl.uniformMatrix4fv( MrxUniTri, false, Mrx );
	gl.useProgram( shaderSq );
	MrxUniSq = gl.getUniformLocation( shaderSq, "MrxSq" );
	gl.uniformMatrix4fv( MrxUniSq, false, Mrx );

	// Reset Y Rotation
	beta = .0;
	Mry = [Math.cos(beta), .0, -Math.sin(beta), .0,
		   .0, 1.0, .0, .0,
		   Math.sin(beta), .0, Math.cos(beta), .0,
		   .0, .0, .0, 1.0];
	gl.useProgram( shaderTri );
	MryUniTri = gl.getUniformLocation( shaderTri, "MryTri" );
	gl.uniformMatrix4fv( MryUniTri, false, Mry );
	gl.useProgram( shaderSq );
	MryUniSq = gl.getUniformLocation( shaderSq, "MrySq" );
	gl.uniformMatrix4fv( MryUniSq, false, Mry );

	// Reset Z Rotation
	gamma = .0;
	Mrz = [Math.cos(gamma), -Math.sin(gamma), .0, .0,
		   Math.sin(gamma), Math.cos(gamma), .0, .0,
		   .0, .0, 1.0, .0,
		   .0, .0, .0, 1.0];
	gl.useProgram( shaderTri );
	MrzUniTri = gl.getUniformLocation( shaderTri, "MrzTri" );
	gl.uniformMatrix4fv( MrzUniTri, false, Mrz );
	gl.useProgram( shaderSq );
	MrzUniSq = gl.getUniformLocation( shaderSq, "MrzSq" );
	gl.uniformMatrix4fv( MrzUniSq, false, Mrz );

	// Reset Scaling
	sx = 1.0;
	sy = 1.0;
	Ms = [sx, .0, .0, .0,
		  .0, sy, .0, .0,
		  .0, .0, 1.0, .0,
		  .0, .0, .0, 1.0];
	gl.useProgram( shaderTri );
	MsUniTri = gl.getUniformLocation( shaderTri, "MsTri" );
	gl.uniformMatrix4fv( MsUniTri, false, Ms );
	gl.useProgram( shaderSq );
	MsUniSq = gl.getUniformLocation( shaderSq, "MsSq" );
	gl.uniformMatrix4fv( MsUniSq, false, Ms );

	// Reset Translation
	tx = .0;
	ty = .0;
	Mt = [1.0, .0, .0, .0,
		  .0, 1.0, .0, .0,
		  .0, .0, 1.0, .0,
		  tx, ty, .0, 1.0];
	gl.useProgram( shaderTri );
	MtUniTri = gl.getUniformLocation( shaderTri, "MtTri" );
	gl.uniformMatrix4fv( MtUniTri, false, Mt );
	gl.useProgram( shaderSq );
	MtUniSq = gl.getUniformLocation( shaderSq, "MtSq" );
	gl.uniformMatrix4fv( MtUniSq, false, Mt );

    requestAnimFrame( render );
}
