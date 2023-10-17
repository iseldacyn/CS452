var gl;
var myShaderProgram;

var xflip;
var yflip;

// Rotation functions
var alpha;
var Mrx;
var beta;
var Mry;
var Mxuni;
var Myuni;

function init() {
    var canvas=document.getElementById("gl-canvas");
    gl=WebGLUtils.setupWebGL(canvas);
    
    if (!gl) { alert( "WebGL is not available" ); }
    
    gl.viewport( 0, 0, 512, 512 );
    
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    
    myShaderProgram =
        initShaders( gl,"vertex-shader", "fragment-shader" );
    gl.useProgram( myShaderProgram );
    
    // will include depth test to render faces correctly!
    gl.enable( gl.DEPTH_TEST );

	// X rotation
	alpha = .0;
	Mrx = [1.0, .0, .0, .0,
		   .0, Math.cos(alpha), -Math.sin(alpha), .0,
		   .0, Math.sin(alpha), Math.cos(alpha), .0,
		   .0, .0, .0, 1.0];
	Mxuni = gl.getUniformLocation( myShaderProgram, "Mrx" );
	gl.uniformMatrix4fv( Mxuni, false, Mrx );

	// Y rotation
	beta = .0;
	Mry = [Math.cos(beta), .0, -Math.sin(beta), .0,
		   .0, 1.0, .0, .0,
		   Math.sin(beta), .0, Math.cos(beta), .0,
		   .0, .0, .0, 1.0];
	Myuni =  gl.getUniformLocation( myShaderProgram, "Mry" );
	gl.uniformMatrix4fv( Myuni, false, Mry );

	xflip = 0;
	yflip = 0;
    
    setupCube();
    render();

}

function setupCube() {
    
    // Vertices of Cube
    var vertices = [vec4( -.2,  .2,  -.2,  1), // p0
                    vec4( -.2, -.2,  -.2,  1), // p1
                    vec4(  .2, -.2,  -.2,  1), // p2
                    vec4(  .2,  .2,  -.2,  1), // p3
                    vec4(  .2,  .2,  .2,  1), // p4
                    vec4( -.2,  .2,  .2,  1), // p5
                    vec4( -.2, -.2,  .2,  1), // p6
                    vec4(  .2, -.2,  .2,  1)];  // p7

    // Colors at Vertices of Cube
    var vertexColors = [vec4( 0.0, 0.0, 1.0, 1.0), // p0
                        vec4( 0.0, 1.0, 0.0, 1.0), // p1
                        vec4( 1.0, 0.0, 0.0, 1.0), // p2
                        vec4( 1.0, 1.0, 0.0, 1.0), // p3
                        vec4( 1.0, 0.0, 1.0, 1.0), // p4
                        vec4( 0.0, 1.0, 1.0, 1.0), // p5
                        vec4( 1.0, 1.0, 1.0, 1.0), // p6
                        vec4( 0.3, 0.3, 0.3, 1.0)]; // p7

    // Every face on the cube is divided into two triangles,
    // each triangle is described by three indices into
    // the array "vertices"
    var indexList = [0, 1, 3,
                     1, 2, 3,
                     6, 5, 7,
                     4, 7, 5,
                     0, 6, 1,
                     5, 6, 0,
                     2, 4, 3,
                     2, 7, 4,
                     0, 4, 5,
                     0, 3, 4,
                     2, 1, 6,
                     2, 6, 7];
    
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
    
    // will populate to create buffer for indices
    var iBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, iBuffer );
    gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indexList), gl.STATIC_DRAW );
}

function flipX()
{
	if (xflip == 1) xflip = 0;
	else xflip = 1;
}

function flipY()
{
	if (yflip == 1) yflip = 0;
	else yflip = 1;
}


function render() {

	alpha += .1 * xflip;
	Mrx = [1.0, .0, .0, .0,
		   .0, Math.cos(alpha), -Math.sin(alpha), .0,
		   .0, Math.sin(alpha), Math.cos(alpha), .0,
		   .0, .0, .0, 1.0];
	gl.uniformMatrix4fv( Mxuni, false, Mrx );

	beta += .1 * yflip;
	Mry = [Math.cos(beta), .0, -Math.sin(beta), .0,
		   .0, 1.0, .0, .0,
		   Math.sin(beta), .0, Math.cos(beta), .0,
		   .0, .0, .0, 1.0];

	gl.uniformMatrix4fv( Myuni, false, Mry );
    
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
    // will populate to render the cube
    gl.drawElements( gl.TRIANGLES, 36, gl.UNSIGNED_BYTE, 0 );
	requestAnimFrame( render );
}
