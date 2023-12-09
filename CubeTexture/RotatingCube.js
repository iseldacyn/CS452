var gl;
var myShaderProgram;
var alpha;
var beta;
var iBuffer;
var textureChecker;
var textureImage;

function drawCube() {
    
    var canvas=document.getElementById("gl-canvas");
    gl=WebGLUtils.setupWebGL(canvas);
    
    if (!gl) { alert( "WebGL is not available" ); }
    
    gl.viewport( 0, 0, canvas.width, canvas.height );
    
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    gl.enable( gl.DEPTH_TEST );
    
    alpha = .6;
    beta = 0.0;
    
    myShaderProgram =
    initShaders( gl,"vertex-shader", "fragment-shader" );
    gl.useProgram( myShaderProgram );

    
    var vertices =
       [// Front face
       -1.0, -1.0,  1.0,
        1.0, -1.0,  1.0,
        1.0,  1.0,  1.0,
       -1.0,  1.0,  1.0,
        // Back face
       -1.0, -1.0, -1.0,
       -1.0,  1.0, -1.0,
        1.0,  1.0, -1.0,
        1.0, -1.0, -1.0,
        // Top face
       -1.0,  1.0, -1.0,
       -1.0,  1.0,  1.0,
        1.0,  1.0,  1.0,
        1.0,  1.0, -1.0,
        // Bottom face
        1.0, -1.0, -1.0,
        1.0, -1.0,  1.0,
       -1.0, -1.0,  1.0,
        // Right face
        1.0, -1.0, -1.0,
        1.0,  1.0, -1.0,
        1.0,  1.0,  1.0,
        1.0, -1.0,  1.0,
        // Left face
       -1.0, -1.0, -1.0,
       -1.0, -1.0,  1.0,
       -1.0,  1.0,  1.0,
       -1.0,  1.0, -1.0];
    
    var textureCoordinates =
       [// Front
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        // Back
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        // Top
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        // Bottom
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        // Right
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        // Left
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0];
    

    var indexList =
       [//Front
        0,  1,  2,
        0,  2,  3,
             
             
        //Back
        4,  5,  6,
        4,  6,  7,
             
             
        //Top
        8,  9,  10,
        8,  10, 11,
             
             
        //Bottom
        12, 13, 14,
        12, 14, 15,
             
             
        //Right
        16, 17, 18,
        16, 18, 19,
             
             
        //Left
        20, 21, 22,
        20, 22, 23
        
        ];
    
    
    /* Checkerboard Texture */
    var texSize = 64;
    var numRows = 16;
    var numCols = 16;
    
    var myTexels = new Uint8Array( 4 * texSize * texSize );
    
    for ( var i=0; i<texSize; i++ ) {
        for ( var j=0; j<texSize; j++ ) {
            var patchx = Math.floor( i/(texSize/numRows) );
            var patchy = Math.floor( j/(texSize/numCols) );
            var c;
            if ( (patchx % 2) != (patchy % 2) ) {
                c = 255;
            } else {
                
                c = 0;
            }
            
            
            myTexels[4*i*texSize + 4*j    ] = c; // r
            myTexels[4*i*texSize + 4*j + 1] = c; // g
            myTexels[4*i*texSize + 4*j + 2] = c; // b
            myTexels[4*i*texSize + 4*j + 3] = 255; // opacity alpha
        }
    }
    /* Checkerboard Texture ends here */
    
    
    
    console.log("here1");

    //var url = "https://tars.clarkson.edu/classes/graphics/flower.jpg";
    

    textureImage = gl.createTexture(); // for flower image
    gl.bindTexture( gl.TEXTURE_2D, textureImage );
    const myImage = new Image();
    var url = "https://c1.staticflickr.com/9/8873/18598400202_3af67ef38f_q.jpg";
    myImage.crossOrigin = "anonymous";
    
    myImage.onload = function() {
        gl.bindTexture( gl.TEXTURE_2D, textureImage );
        gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, true );
        gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, myImage );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);        
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        //gl.generateMipmap( gl.TEXTURE_2D ); // only use this if the image is a power of 2
        return textureImage;
    };
    myImage.src = url;
    
    textureChecker = gl.createTexture(); // for checkerboard
    gl.bindTexture( gl.TEXTURE_2D, textureChecker );
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, myTexels );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    
    
    iBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,iBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indexList), gl.STATIC_DRAW);
    
    var vertexbuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,vertexbuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
    
    var vertexPosition = gl.getAttribLocation(myShaderProgram,"vertexPosition");
    gl.vertexAttribPointer( vertexPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vertexPosition );
    
    
    var textureVertexbuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,textureVertexbuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(textureCoordinates), gl.STATIC_DRAW);
    
    var textureCoordinate = gl.getAttribLocation(myShaderProgram,"textureCoordinate");
    gl.vertexAttribPointer( textureCoordinate, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( textureCoordinate );
    
    console.log("here3");

    
    render();
    console.log("here4");

}

function rotateAroundX() {
    alpha += .1;
    alphaLoc=gl.getUniformLocation(myShaderProgram,"alpha");
    gl.uniform1f(alphaLoc,alpha);
}

function rotateAroundY() {
    beta += .1;
    betaLoc=gl.getUniformLocation(myShaderProgram,"beta");
    gl.uniform1f(betaLoc,beta);
}

function render() {
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textureImage);
    gl.uniform1i(gl.getUniformLocation(myShaderProgram, "texMap0"), 0);
    
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, textureChecker);
    gl.uniform1i(gl.getUniformLocation(myShaderProgram, "texMap1"), 1);
    
    
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
    var numVertices=36;
    gl.drawElements( gl.TRIANGLES, numVertices, gl.UNSIGNED_SHORT, 0 );
    requestAnimFrame(render);
}



