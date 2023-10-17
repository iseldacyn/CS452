var gl;
var shaderProgramSquare;
//var thetaUniform;
var MUniform;
var MValue;
var thetaValue;
var stopStartFlag;

var s;
var sflag;
var MsValue;
var MsUniform;

var MtUniform;
var MtValue;
var tx;
var ty;

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
    
    thetaValue = 0.0;
	MValue = [Math.cos( thetaValue ), 
		-Math.sin( thetaValue ), 0, 
		Math.sin( thetaValue ), 
		Math.cos( thetaValue ), 0,
		0, 0, 1];
	MUniform = gl.getUniformLocation( shaderProgramSquare, "M" );
	gl.uniformMatrix3fv( MUniform, false, MValue );

    s = 1.0;
	sflip = 1;
	MsValue = [s, 0, 0, 0, s, 0, 0, 0, 1];
	MsUniform = gl.getUniformLocation( shaderProgramSquare, "Ms" );
	gl.uniformMatrix3fv( MsUniform, false, MsValue );

	tx = .0;
	ty = .0;
	MtValue = [1, 0, 0, 0, 1, 0, tx, ty, 1];
	MtUniform = gl.getUniformLocation( shaderProgramSquare, "Mt" );
	gl.uniformMatrix3fv( MtUniform, false, MtValue );
    
    stopStartFlag = 1;
    
    // Force the WebGL context to clear the color buffer
    gl.clear( gl.COLOR_BUFFER_BIT );
    
    setupSquare();
    
    render();
    
    //setInterval( drawSquare, 5 );
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

function stopStartAnim() {
    if (stopStartFlag == 1) {
        stopStartFlag = 0;
    } else {
        stopStartFlag = 1;
    }
}


function render() {
        
    thetaValue += (.01 * stopStartFlag);
	MValue = [Math.cos( thetaValue ), 
		-Math.sin( thetaValue ), 0,
		Math.sin( thetaValue ), 
		Math.cos( thetaValue ), 0,
		0, 0, 1];
	gl.uniformMatrix3fv( MUniform, false, MValue );

	s = s + (.005 * sflip);
	if ( s >= 3.0 )
		sflip = -1;
	if ( s <= .5 )
		sflip = 1;
	MsValue = [s, 0, 0, 0, s, 0, 0, 0, 1];
	gl.uniformMatrix3fv( MsUniform, false, MsValue );
    
	tx += .001;
	ty += .002;
	MtValue = [1, 0, 0, 0, 1, 0, tx, ty, 1];
	MtUniform = gl.getUniformLocation( shaderProgramSquare, "Mt" );
	gl.uniformMatrix3fv( MtUniform, false, MtValue );

    gl.clear( gl.COLOR_BUFFER_BIT );
    
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );
    requestAnimFrame(render);
    
}
