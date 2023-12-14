// Name: Iselda Aiello

var gl;
var numVertices;
var numTriangles;

var myShaderProgram;

var Ppc, Poc;
var light1;
var light2;
var specular;

function initGL(){
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    gl.enable(gl.DEPTH_TEST);
    gl.viewport( 0, 0, 512, 512 );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    
    myShaderProgram = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( myShaderProgram );

    
    // The following block of code together with the 
    // definitions in object.js are provided for diagnosis
    // 
    // For full credit, REPLACE THE FOLLOWING BLOCK with
    // a block that loads the vertices and faces from the provided ply file
    // You are encouraged to explore THREE.js by using ChatGPT
    // to investigate how to load a PLY file and get
    // access to the vertices and faces
    //
    vertices = getVertices(); // currently defined in object.js
    indexList = getFaces();
    numVertices = vertices.length;
    numTriangles = indexList.length/3;
    // End of block on reading vertices and faces that you should replace
    
    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexList), gl.STATIC_DRAW);
    
    var verticesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
    
    var vertexPosition = gl.getAttribLocation(myShaderProgram,"vertexPosition");
    gl.vertexAttribPointer( vertexPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vertexPosition );
    
    // Insert your code here
	//
	// set up camera
	var pc = vec3( -4.0, 2.0, -4.0 );
	var ac = vec3( 0.0, 0.0, 0.0 );
	var vcup = vec3( 0.0, 1.0, 0.0 );
	var nc = normalize( subtract( pc, ac ) );
    var uc = normalize(cross(vcup,nc));
    var vc = normalize(cross(nc,uc));
    var rightc = 3.0;
	var leftc = -rightc;
    var topc = 3.0;
	var bottomc = -topc;
    var nearc = 4.5;
    var farc = 8.0;

	// camera modelview
    var Mc = [uc[0], vc[0], nc[0], .0,
              uc[1], vc[1], nc[1], .0,
              uc[2], vc[2], nc[2], .0,
             -dot(pc,uc), -dot(pc,vc), -dot(pc,nc), 1.0];
	// modelview inverse transpose
    var Mcit = [uc[0], vc[0], nc[0], pc[0],
               uc[1], vc[1], nc[1], pc[1],
               uc[2], vc[2], nc[2], pc[2],
               .0, .0, .0, 1.0];

	// orthographic projection
	Poc = [2.0/(rightc-leftc), .0, .0, .0,
			 .0, 2.0/(topc-bottomc), .0, .0,
		     .0, .0, -2.0/(farc-nearc), .0,
			 -(leftc+rightc)/(rightc-leftc), -(topc+bottomc)/(topc-bottomc), -(farc+nearc)/(farc-nearc), 1.0];

    // perspective projection
    Ppc = [nearc/rightc, .0, .0, .0,
             .0, nearc/topc, .0, .0,
             .0, .0, -(farc+nearc)/(farc-nearc), -1.0,
             .0, .0, -2.0 * farc * nearc / (farc-nearc), .0];

	// send camera variables to shader
	gl.uniformMatrix4fv( gl.getUniformLocation( myShaderProgram, "Mc" ), false, Mc );
	gl.uniformMatrix4fv( gl.getUniformLocation( myShaderProgram, "Mcit" ), false, Mcit );
	gl.uniformMatrix4fv( gl.getUniformLocation( myShaderProgram, "Pc" ), false, Ppc );

     
    // specular, diffuse, and ambient coefficients
	var ka = vec3( 1.0, 1.0, 1.0 );
	var kd = vec3( 1.0, 1.0, 1.0 );
	var ks = vec3( 1.0, 1.0, 1.0 );
	var alpha = 0.5;
	gl.uniform3fv( gl.getUniformLocation( myShaderProgram, "ka" ), ka );
	gl.uniform3fv( gl.getUniformLocation( myShaderProgram, "kd" ), kd );
	gl.uniform3fv( gl.getUniformLocation( myShaderProgram, "ks" ), ks );
	gl.uniform1f( gl.getUniformLocation( myShaderProgram, "alpha" ), alpha );

	// normal vectors
	var fn = getFaceNormals( vertices, indexList, numTriangles );
	var nv = getVertexNormals( indexList, fn, numVertices, numTriangles );

    var vertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vertexNormalBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(nv), gl.STATIC_DRAW );
    
    var vertexNormal = gl.getAttribLocation( myShaderProgram, "nv" );
    gl.vertexAttribPointer( vertexNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vertexNormal );

	// light 1 coefficients and position
	var ia1 = vec3( 5.0, 5.0, 5.0 );
	var id1 = vec3( 5.0, 5.0, 5.0 );
	var is1 = vec3( 5.0, 5.0, 5.0 );
	var pl1 = vec3( .0, -3.0, -6.0 );
	gl.uniform3fv( gl.getUniformLocation( myShaderProgram, "ia1" ), ia1 );
	gl.uniform3fv( gl.getUniformLocation( myShaderProgram, "id1" ), id1 );
	gl.uniform3fv( gl.getUniformLocation( myShaderProgram, "is1" ), is1 );
	gl.uniform3fv( gl.getUniformLocation( myShaderProgram, "pl1" ), pl1 );

	// light 2 coefficients and position
	var ia2 = vec3( 2.5*4.431, 2.5*4.196, 2.5*3.529 );
	var id2 = vec3( 2.5*4.431, 2.5*4.196, 2.5*3.529 );
	var is2 = vec3( 2.5*4.431, 2.5*4.196, 2.5*3.529 );
	var pl2 = vec3( 1.0, 5.0, 3.0 );
	gl.uniform3fv( gl.getUniformLocation( myShaderProgram, "ia2" ), ia2 );
	gl.uniform3fv( gl.getUniformLocation( myShaderProgram, "id2" ), id2 );
	gl.uniform3fv( gl.getUniformLocation( myShaderProgram, "is2" ), is2 );
	gl.uniform3fv( gl.getUniformLocation( myShaderProgram, "pl2" ), pl2 );

	// set up buttons
	light1 = false;
	gl.uniform1i( gl.getUniformLocation( myShaderProgram, "light1" ), 0 );
	light2 = true;
	gl.uniform1i( gl.getUniformLocation( myShaderProgram, "light2" ), 1 );
	specular = true;
	gl.uniform1i( gl.getUniformLocation( myShaderProgram, "specular" ), 1 );

    drawObject();

};


function drawObject() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
    gl.drawElements( gl.TRIANGLES, 3 * numTriangles, gl.UNSIGNED_SHORT, 0 )
}

function toggleLight1()
{
	light1 = !light1;
	gl.uniform1i( gl.getUniformLocation( myShaderProgram, "light1" ), light1 ? 1 : 0 );
	drawObject();
}

function toggleLight2()
{
	light2 = !light2;
	gl.uniform1i( gl.getUniformLocation( myShaderProgram, "light2" ), light2 ? 1 : 0 );
	drawObject();
}

function togglePerspective()
{
	gl.uniformMatrix4fv( gl.getUniformLocation( myShaderProgram, "Pc" ), false, Ppc );
	drawObject();
}

function toggleOrthographic()
{
	gl.uniformMatrix4fv( gl.getUniformLocation( myShaderProgram, "Pc" ), false, Poc );
	drawObject();
}

function toggleSpecular()
{
	specular = !specular;
	gl.uniform1i( gl.getUniformLocation( myShaderProgram, "specular" ), specular ? 1 : 0 );
	drawObject();
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
                vn[0] += faceNormals[i][0];
                vn[1] += faceNormals[i][1];
                vn[2] += faceNormals[i][2];
            }
        }
		if ( length( vn ) > 1e-6 ) {
			vn = normalize(vn);
		}
        
        vertexNormals.push( vn );
    }
    return vertexNormals;
}
