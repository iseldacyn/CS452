var gl;
var myShaderProgramLight;
var myShaderProgramView;
var alpha;
var beta;

function drawCube() {
    
    var canvas=document.getElementById("gl-canvas");
    gl=WebGLUtils.setupWebGL(canvas);
    
    if (!gl) { alert( "WebGL is not available" ); }
    
    
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    gl.enable( gl.DEPTH_TEST );
    
    alpha = .6;
    beta = 0.0;
    
    myShaderProgramView =
    initShaders( gl,"view-vertex-shader", "view-fragment-shader" );
    myShaderProgramLight =
    initShaders( gl,"light-vertex-shader", "light-fragment-shader" );
    gl.useProgram( myShaderProgramLight );

    
    var vertices = [vec4( -.2,  .8,  -.8,  1), // p0
                    vec4( -.2,  .4,  -.8,  1), // p1
                    vec4(  .2,  .4,  -.8,  1), // p2
                    vec4(  .2,  .8,  -.8,  1), // p3
                    vec4(  .2,  .8,  -.4,  1), // p4
                    vec4( -.2,  .8,  -.4,  1), // p5
                    vec4( -.2,  .4,  -.4,  1), // p6
                    vec4(  .2,  .4,  -.4,  1),
                    vec4( -1.8,  .1,  -1.5,  1), // p0
                    vec4( -1.8,  .0,  -1.5,  1), // p1
                    vec4(  1.8,  .0,  -1.5,  1), // p2
                    vec4(  1.8,  .1,  -1.5,  1), // p3
                    vec4(  1.8,  .1,   .5,  1), // p4
                    vec4( -1.8,  .1,   .5,  1), // p5
                    vec4( -1.8,  .0,   .5,  1), // p6
                    vec4(  1.8,  .0,   .5,  1)];  // p7
    
    var cuber = .1;
    var cubeg = .8;
    var cubeb = .7;
    var planer = .5;
    var planeg = .4;
    var planeb = .5;
    
    var coefficients = [vec3(cuber,cubeg,cubeb),
                        vec3(cuber,cubeg,cubeb),
                        vec3(cuber,cubeg,cubeb),
                        vec3(cuber,cubeg,cubeb),
                        vec3(cuber,cubeg,cubeb),
                        vec3(cuber,cubeg,cubeb),
                        vec3(cuber,cubeg,cubeb),
                        vec3(cuber,cubeg,cubeb),
                        vec3(planer,planeg,planeb),
                        vec3(planer,planeg,planeb),
                        vec3(planer,planeg,planeb),
                        vec3(planer,planeg,planeb),
                        vec3(planer,planeg,planeb),
                        vec3(planer,planeg,planeb),
                        vec3(planer,planeg,planeb),
                        vec3(planer,planeg,planeb)];
    
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
                     2, 6, 7,
                     8, 9, 11,
                     9, 10, 11,
                     14, 13, 15,
                     12, 15, 13,
                     8, 14, 9,
                     13, 14, 8,
                     10, 12, 11,
                     10, 15, 12,
                     8, 12, 13,
                     8, 11, 12,
                     10, 9, 14,
                     10, 14, 15];
    var faceNormals = getFaceNormals( vertices, indexList, 24 );
    var vertexNormals = getVertexNormals( indexList, faceNormals, 16, 24 );
    var shadowMapWidth = 4 * canvas.width;
    var shadowMapHeight = 4 * canvas.height;
    
    // create EMPTY texture (will be used later for FBO)
    gl.viewport( 0, 0, shadowMapWidth, shadowMapHeight );
    var shadowTexture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D,shadowTexture);
    gl.pixelStorei(gl.UNPACK_Y_FLIP_WEBGL,false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB,
                  shadowMapWidth, shadowMapHeight, 0,
                  gl.RGB, gl.UNSIGNED_BYTE, null);
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAX_FILTER, gl.LINEAR_MIPMAP_LINEAR );
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.bindTexture(gl.TEXTURE_2D,null);
    
    // create framebuffer object (FBO)
    var framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    // create renderbuffer to support FBO
    var renderbuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, shadowMapWidth, shadowMapHeight);
    // send color to texture map so that we can read it
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, shadowTexture, 0);
    // use renderbuffer to make depth-based comparisons
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);
    var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (status != gl.FRAMEBUFFER_COMPLETE) {
        alert('Frame buffer not complete!');
    }
    
    // Uniforms
    // Set up light as if it were a camera.
    var p0 = vec3( -.3, 1.38, -.4); // 'eye' of light
    var al = vec3(.0, .6, -.6); // look at point for light
    var vupl = vec3(.0, 1.0, .0);
    var nl = normalize( subtract( p0, al ) );
    var ul = normalize(cross(vupl,nl));
    var vl = normalize(cross(nl,ul));
    var rightl = .5;
    var topl = .5;
    var nearl = .1;
    var farl = 5.0;
    
    // Modelview for light
    var Ml = [ul[0], vl[0], nl[0], .0,
              ul[1], vl[1], nl[1], .0,
              ul[2], vl[2], nl[2], .0,
             -dot(p0,ul), -dot(p0,vl), -dot(p0,nl), 1.0];
    // Projection for light
    var Pl = [nearl/rightl, .0, .0, .0,
              .0, nearl/topl, .0, .0,
             .0, .0, -(farl+nearl)/(farl-nearl), -1.0,
             .0, .0, -2.0 * farl * nearl / (farl-nearl), .0];
    
    
    
    // Set up camera
    var e = vec3( .0, 1.0, .0); // eye of camera
    var a = vec3(.0, .6, -.6); // look at point for camera (center of object)
    var vup = vec3(.0, 1.0, .0);
    var n = normalize( subtract( e, a ) );
    var u = normalize(cross(vup,n));
    var v = normalize(cross(n,u));
    var right = .5;
    var top = .5;
    var near = .3;
    var far = 2.0;
    
    // Modelview for camera
    var M = [u[0], v[0], n[0], .0,
             u[1], v[1], n[1], .0,
             u[2], v[2], n[2], .0,
             -dot(e,u), -dot(e,v), -dot(e,n), 1.0];
    // Modelview inverse transpose for camera
    var Mit = [u[0], v[0], n[0], e[0],
               u[1], v[1], n[1], e[1],
               u[2], v[2], n[2], e[2],
               .0, .0, .0, 1.0];

    // Projection for camera
    var P = [near/right, .0, .0, .0,
             .0, near/top, .0, .0,
             .0, .0, -(far+near)/(far-near), -1.0,
             .0, .0, -2.0 * far * near / (far-near), .0];
    
    // Set up lighting parameters and coefficients
    var Ia = vec3(.3, .3, .3);
    var Id = vec3(.8, .8, .8);
    var ka = vec3(.5, .1, .3);
    var kd = vec3(.5, .1, .3);
    
    
    gl.useProgram(myShaderProgramLight);
    gl.uniformMatrix4fv(gl.getUniformLocation(myShaderProgramLight,"Ml"),false,flatten(Ml));
    gl.uniformMatrix4fv(gl.getUniformLocation(myShaderProgramLight,"Pl"),false,flatten(Pl));

    
    
    var lightIBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,lightIBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint8Array(indexList), gl.STATIC_DRAW);
    
    var lightVertexbuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,lightVertexbuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
    
    var lightVertexPosition = gl.getAttribLocation(myShaderProgramLight,"lightVertexPosition");
    gl.vertexAttribPointer( lightVertexPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( lightVertexPosition );
    
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
    gl.drawElements( gl.TRIANGLES, 72, gl.UNSIGNED_BYTE, 0 );

    gl.bindFramebuffer(gl.FRAMEBUFFER,null);
    gl.bindFramebuffer(gl.RENDERBUFFER,null);
    
    gl.useProgram(myShaderProgramView);
    
    gl.uniform3f(gl.getUniformLocation(myShaderProgramView,"p0"),p0[0],p0[1],p0[2]);

    gl.uniformMatrix4fv(gl.getUniformLocation(myShaderProgramView,"M"),false,flatten(M));
    gl.uniformMatrix4fv(gl.getUniformLocation(myShaderProgramView,"Mit"),false,flatten(Mit));
    gl.uniformMatrix4fv(gl.getUniformLocation(myShaderProgramView,"P"),false,flatten(P));
    gl.uniformMatrix4fv(gl.getUniformLocation(myShaderProgramView,"Ml"),false,flatten(Ml));
    gl.uniformMatrix4fv(gl.getUniformLocation(myShaderProgramView,"Pl"),false,flatten(Pl));
    
    gl.uniform3f(gl.getUniformLocation(myShaderProgramView,"Ia"),Ia[0],Ia[1],Ia[2]);
    gl.uniform3f(gl.getUniformLocation(myShaderProgramView,"Id"),Id[0],Id[1],Id[2]);
    gl.uniform3f(gl.getUniformLocation(myShaderProgramView,"ka"),ka[0],ka[1],ka[2]);
    gl.uniform3f(gl.getUniformLocation(myShaderProgramView,"kd"),kd[0],kd[1],kd[2]);
    
    
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D,shadowTexture);
    
    var iBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,iBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint8Array(indexList), gl.STATIC_DRAW);

    var vertexbuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,vertexbuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
    
    var vertexPosition = gl.getAttribLocation(myShaderProgramView,"vertexPosition");
    gl.vertexAttribPointer( vertexPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vertexPosition );
    
    var normalsbuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,normalsbuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertexNormals), gl.STATIC_DRAW);
    
    var nv = gl.getAttribLocation(myShaderProgramView,"nv");
    gl.vertexAttribPointer( nv, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( nv );
    
    var coefficientsbuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,coefficientsbuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(coefficients), gl.STATIC_DRAW);
    
    var k = gl.getAttribLocation(myShaderProgramView,"k");
    gl.vertexAttribPointer( k, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( k );
    
    var shadowMapLoc = gl.getUniformLocation(myShaderProgramView, "shadowMap");
    gl.uniform1i(shadowMapLoc, 0);
    
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
    gl.drawElements( gl.TRIANGLES, 72, gl.UNSIGNED_BYTE, 0 );
    
}


function getFaceNormals( vertices, indexList, numTriangles ) {
    var faceNormals=[];
    for (var i = 0; i < numTriangles; i++) {
        var p0 = vec3( vertices[indexList[3*i]][0],
                      vertices[indexList[3*i]][1],
                      vertices[indexList[3*i]][2] );
        var p1 = vec3( vertices[indexList[3*i+1]][0],
                      vertices[indexList[3*i+1]][1],
                      vertices[indexList[3*i+1]][2] );
        var p2 = vec3( vertices[indexList[3*i+2]][0],
                      vertices[indexList[3*i+2]][1],
                      vertices[indexList[3*i+2]][2] );
        var p1mp0 = vec3( p1[0]-p0[0], p1[1]-p0[1], p1[2]-p0[2]);
        var p2mp0 = vec3( p2[0]-p0[0], p2[1]-p0[1], p2[2]-p0[2]);
        var n = cross( p1mp0, p2mp0 );
        n = normalize(n);
        faceNormals.push( n );
    }
    return faceNormals;
}

function getVertexNormals( indexList, faceNormals, numVertices, numTriangles ) {
    var vertexNormals=[];
    for (var j = 0; j < numVertices; j++) {
        var vn = vec3( 0, 0, 0 );
        for (var i = 0; i < numTriangles; i++) {
            if (indexList[3*i]==j |
                indexList[3*i+1] == j |
                indexList[3*i+2] == j ) {
                vn[0] = vn[0] + faceNormals[i][0];
                vn[1] = vn[1] + faceNormals[i][1];
                vn[2] = vn[2] + faceNormals[i][2];
            }
        }
        vn = normalize(vn);
        vn[0]=-1.0*vn[0];
        vn[1]=-1.0*vn[1];
        vn[2]=-1.0*vn[2];
        
        vertexNormals.push( vn );
    }
    return vertexNormals;
}
