var gl;
var n;

// Shader Programs
var shaderPointLight;
var shaderBench;
var shaderLamp;
var shaderBus;
var shaderStopPole;
var shaderBusStopPole;
var shaderStreet;
var shaderSidewalk;

// Bench
var numTrianglesBench;
var iBufferBench;
var vertexBufferBench;
var colorBufferBench;
var normalBench;
var kBench;

// Lamp
var numTrianglesLamp;
var iBufferLamp;
var vertexBufferLamp;
var colorBufferLamp;
var normalLamp;
var kLamp;

// Bus
var iBufferBus;
var vertexBufferBus;
var textureVertexBufferBus;
var textureBus;
var normalBus;
var kBus;

// Poles
var numTrianglesPole;
var iBufferStopPole;
var vertexBufferStopPole;
var textureVertexBufferStopPole;
var normalStopPole;
var kStopPole;
var iBufferBusStopPole;
var vertexBufferBusStopPole;
var textureVertexBufferBusStopPole;
var texturePole;
var normalBusStopPole;
var kBusStopPole;

// Signs
var iBufferStopSign;
var vertexBufferStopSign;
var textureVertexBufferStopSign;
var normalStopSign;
var kStopSign;
var iBufferBusStopSign;
var vertexBufferBusStopSign;
var textureVertexBufferBusStopSign;
var normalStopSign;
var kStopSign;

// Street
var iBufferStreet;
var vertexBufferStreet;
var textureVertexBufferStreet;
var textureStreet;
var normalStreet;
var kStreet;

// Sidewalk
var iBufferSidewalk;
var vertexBufferSidewalk;
var colorBufferSidewalk;
var normalSidewalk;
var kSidewalk;

// Bus Movement Transformations
var horn;
var Mr, MrUni;
var theta;
var Mt, MtUni;
var tx, ty, tz;
var Ms, MsUni;
var sx, sy, sz;

// Camera variables
var Mc, McUni;
var Mcit, McitUni;
var Pc, PcUni;

// Camera zoom
var zoom, zh;
var cz;
var Pz, PzUni;

const controller = {
	"w": {pressed: false},
	"a": {pressed: false},
	"s": {pressed: false},
	"d": {pressed: false},

	"o": {pressed: false},
	"p": {pressed: false},

	" ": {pressed: false},

	"z": {pressed: false},
};
document.addEventListener( "keydown", (e) => {
	if ( controller[e.key] )
		controller[e.key].pressed = true;
});
document.addEventListener( "keyup", (e) => {
	if ( controller[e.key] )
		controller[e.key].pressed = false;
});


function init()
{
	var canvas=document.getElementById( "gl-canvas" );
	gl = WebGLUtils.setupWebGL( canvas );
	if ( !gl ) { alert( "WebGL is not available" ); }

	gl.clearColor( .0588, .251, .0941, 1.0 );
	gl.enable( gl.DEPTH_TEST );
	gl.enable( gl.BLEND );
	
	// make all shaders for each object
	shaderPointLight =
		initShaders( gl, "point-light-vertex-shader", "point-light-fragment-shader" );

	shaderBench =
		initShaders( gl, "bench-vertex-shader", "bench-fragment-shader" );

	shaderLamp =
		initShaders( gl, "lamp-vertex-shader", "lamp-fragment-shader" );

	shaderBus =
		initShaders( gl, "bus-vertex-shader", "bus-fragment-shader" );

	shaderStopPole =
		initShaders( gl, "stop-pole-vertex-shader", "stop-pole-fragment-shader" );

	shaderStopSign =
		initShaders( gl, "stop-sign-vertex-shader", "stop-sign-fragment-shader" );

	shaderBusStopPole =
		initShaders( gl, "bus-stop-pole-vertex-shader", "bus-stop-pole-fragment-shader" );
	
	shaderBusStopSign =
		initShaders( gl, "bus-stop-sign-vertex-shader", "bus-stop-sign-fragment-shader" );

	shaderStreet =
		initShaders( gl, "street-vertex-shader", "street-fragment-shader" );

	shaderSidewalk =
		initShaders( gl, "sidewalk-vertex-shader", "sidewalk-fragment-shader" );

	// initialize all transformations for bus
	horn = document.createElement( 'audio' );
	horn.setAttribute( 'src', 'sound/bus-horn.mp3' );
	horn.addEventListener( 'ended', function() {
		this.currentTime = 0;
	}, false);

	gl.useProgram( shaderBus );
	
	theta = .0;
	Mr = [Math.cos(theta), -Math.sin(theta), .0, .0,
		Math.sin(theta), Math.cos(theta), .0, .0,
		.0, .0, 1.0, .0,
		.0, .0, .0, 1.0];
	MrUni = gl.getUniformLocation( shaderBus, "Mr" );
	gl.uniformMatrix4fv( MrUni, false, Mr );

	tx = .0;
	ty = .0;
	tz = .0;
	Mt = [1.0, .0, .0, .0,
		.0, 1.0, .0, .0,
		.0, .0, 1.0, .0,
		tx, ty, tz, 1.0];
	MtUni = gl.getUniformLocation( shaderBus, "Mt" );
	gl.uniformMatrix4fv( MtUni, false, Mt );

	sx = 4.0;
	sy = 4.0;
	sz = 4.0;
	Ms = [sx, .0, .0, .0,
		.0, sy, .0, .0,
		.0, .0, sz, .0,
		.0, .0, .0, 1.0];
	MsUni = gl.getUniformLocation( shaderBus, "Ms" );
	gl.uniformMatrix4fv( MsUni, false, Ms );

	// light setup
	var pl = vec3( -40, 40, 40 );
	var al = vec3( 20, -20, -20 );
    var vupl = vec3(.0, 1.0, .0);
    var nl = normalize( subtract( pl, al ) );
    var ul = normalize(cross(vupl,nl));
    var vl = normalize(cross(nl,ul));
    var rightl = .5;
    var topl = .5;
    var nearl = 1;
    var farl = 100.0;
    // light modelview
    var Ml = [ul[0], vl[0], nl[0], .0,
              ul[1], vl[1], nl[1], .0,
              ul[2], vl[2], nl[2], .0,
             -dot(pl,ul), -dot(pl,vl), -dot(pl,nl), 1.0];
    // projection for light
    var Pl = [nearl/rightl, .0, .0, .0,
              .0, nearl/topl, .0, .0,
             .0, .0, -(farl+nearl)/(farl-nearl), -1.0,
             .0, .0, -2.0 * farl * nearl / (farl-nearl), .0];

	// send to point light program
	gl.useProgram( shaderPointLight )
    gl.uniformMatrix4fv(gl.getUniformLocation(shaderPointLight,"Ml"),false,flatten(Ml));
    gl.uniformMatrix4fv(gl.getUniformLocation(shaderPointLight,"Pl"),false,flatten(Pl));

	// diffuse lighting
	var p0 = vec3( -10, 20, -15 );

	gl.useProgram( shaderBench );
	gl.uniform3f( gl.getUniformLocation( shaderBench, "p0" ), p0[0], p0[1], p0[2] );

	gl.useProgram( shaderLamp );
	gl.uniform3f( gl.getUniformLocation( shaderLamp, "p0" ), p0[0], p0[1], p0[2] );

	gl.useProgram( shaderBus );
	gl.uniform3f( gl.getUniformLocation( shaderBus, "p0" ), p0[0], p0[1], p0[2] );

	gl.useProgram( shaderStopPole );
	gl.uniform3f( gl.getUniformLocation( shaderStopPole, "p0" ), p0[0], p0[1], p0[2] );

	gl.useProgram( shaderStopSign );
	gl.uniform3f( gl.getUniformLocation( shaderStopSign, "p0" ), p0[0], p0[1], p0[2] );

	gl.useProgram( shaderBusStopPole );
	gl.uniform3f( gl.getUniformLocation( shaderBusStopPole, "p0" ), p0[0], p0[1], p0[2] );

	gl.useProgram( shaderBusStopSign );
	gl.uniform3f( gl.getUniformLocation( shaderBusStopSign, "p0" ), p0[0], p0[1], p0[2] );

	gl.useProgram( shaderStreet );
	gl.uniform3f( gl.getUniformLocation( shaderStreet, "p0" ), p0[0], p0[1], p0[2] );

	gl.useProgram( shaderSidewalk );
	gl.uniform3f( gl.getUniformLocation( shaderSidewalk, "p0" ), p0[0], p0[1], p0[2] );

	// camera setup
	var pc = vec3( 20.0, 30.0, 40.0 );
	//var pc = vec3( 20, 10, 4 );
	var ac = vec3( 5.0, 5.0, 5.0 );
	var vcup = vec3( .0, 1.0, .0 );
	var nc = normalize( subtract( pc, ac ) );
    var uc = normalize(cross(vcup,nc));
    var vc = normalize(cross(nc,uc));
    var rightc = .5;
    var topc = .5;
    var nearc = 1.0;
    var farc = 100.0;

	// camera modelview
    Mc = [uc[0], vc[0], nc[0], .0,
              uc[1], vc[1], nc[1], .0,
              uc[2], vc[2], nc[2], .0,
             -dot(pc,uc), -dot(pc,vc), -dot(pc,nc), 1.0];
	// modelview inverse transpose
    Mcit = [uc[0], vc[0], nc[0], pc[0],
               uc[1], vc[1], nc[1], pc[1],
               uc[2], vc[2], nc[2], pc[2],
               .0, .0, .0, 1.0];

    // perspective projection
    Pc = [nearc/rightc, .0, .0, .0,
             .0, nearc/topc, .0, .0,
             .0, .0, -(farc+nearc)/(farc-nearc), -1.0,
             .0, .0, -2.0 * farc * nearc / (farc-nearc), .0];
	// send to the programs
	gl.useProgram( shaderBench );
	McUni = gl.getUniformLocation( shaderBench, "Mc" );
	gl.uniformMatrix4fv( McUni, false, Mc );
	McitUni = gl.getUniformLocation( shaderBench, "Mcit" );
	gl.uniformMatrix4fv( McitUni, false, Mcit );
	PcUni = gl.getUniformLocation( shaderBench, "Pc" );
	gl.uniformMatrix4fv( PcUni, false, Pc );

	gl.useProgram( shaderLamp );
	McUni = gl.getUniformLocation( shaderLamp, "Mc" );
	gl.uniformMatrix4fv( McUni, false, Mc );
	McitUni = gl.getUniformLocation( shaderLamp, "Mcit" );
	gl.uniformMatrix4fv( McitUni, false, Mcit );
	PcUni = gl.getUniformLocation( shaderLamp, "Pc" );
	gl.uniformMatrix4fv( PcUni, false, Pc );

	gl.useProgram( shaderBus );
	McUni = gl.getUniformLocation( shaderBus, "Mc" );
	gl.uniformMatrix4fv( McUni, false, Mc );
	McitUni = gl.getUniformLocation( shaderBus, "Mcit" );
	gl.uniformMatrix4fv( McitUni, false, Mcit );
	PcUni = gl.getUniformLocation( shaderBus, "Pc" );
	gl.uniformMatrix4fv( PcUni, false, Pc );

	gl.useProgram( shaderStopPole );
	McUni = gl.getUniformLocation( shaderStopPole, "Mc" );
	gl.uniformMatrix4fv( McUni, false, Mc );
	McitUni = gl.getUniformLocation( shaderStopPole, "Mcit" );
	gl.uniformMatrix4fv( McitUni, false, Mcit );
	PcUni = gl.getUniformLocation( shaderStopPole, "Pc" );
	gl.uniformMatrix4fv( PcUni, false, Pc );

	gl.useProgram( shaderStopSign );
	McUni = gl.getUniformLocation( shaderStopSign, "Mc" );
	gl.uniformMatrix4fv( McUni, false, Mc );
	McitUni = gl.getUniformLocation( shaderStopSign, "Mcit" );
	gl.uniformMatrix4fv( McitUni, false, Mcit );
	PcUni = gl.getUniformLocation( shaderStopSign, "Pc" );
	gl.uniformMatrix4fv( PcUni, false, Pc );

	gl.useProgram( shaderBusStopPole );
	McUni = gl.getUniformLocation( shaderBusStopPole, "Mc" );
	gl.uniformMatrix4fv( McUni, false, Mc );
	McitUni = gl.getUniformLocation( shaderBusStopPole, "Mcit" );
	gl.uniformMatrix4fv( McitUni, false, Mcit );
	PcUni = gl.getUniformLocation( shaderBusStopPole, "Pc" );
	gl.uniformMatrix4fv( PcUni, false, Pc );

	gl.useProgram( shaderBusStopSign );
	McUni = gl.getUniformLocation( shaderBusStopSign, "Mc" );
	gl.uniformMatrix4fv( McUni, false, Mc );
	McitUni = gl.getUniformLocation( shaderBusStopSign, "Mcit" );
	gl.uniformMatrix4fv( McitUni, false, Mcit );
	PcUni = gl.getUniformLocation( shaderBusStopSign, "Pc" );
	gl.uniformMatrix4fv( PcUni, false, Pc );

	gl.useProgram( shaderStreet );
	McUni = gl.getUniformLocation( shaderStreet, "Mc" );
	gl.uniformMatrix4fv( McUni, false, Mc );
	PcUni = gl.getUniformLocation( shaderStreet, "Pc" );
	gl.uniformMatrix4fv( PcUni, false, Pc );

	gl.useProgram( shaderSidewalk );
	McUni = gl.getUniformLocation( shaderSidewalk, "Mc" );
	gl.uniformMatrix4fv( McUni, false, Mc );
	PcUni = gl.getUniformLocation( shaderSidewalk, "Pc" );
	gl.uniformMatrix4fv( PcUni, false, Pc );


	// initialize camera zoom
	gl.useProgram( shaderBus );

	zoom = false;
	zh = true;
	cz = 1;
	Pz = [ cz, .0, .0, .0,
		.0, cz, .0, .0,
		.0, .0, cz, .0,
		.0, .0, .0, 1.0];
	PzUni = gl.getUniformLocation( shaderBus, "Pz" )
	gl.uniformMatrix4fv( PzUni, false, Pz );

	// initalize objects and render them
	makeBench();
	makeLamp();
	makePoleBus();
	makePole();
	makeStopSign();
	makeBusStopSign();
	makeBus();
	makeStreet();
	makeSidewalk();

	n = 0;
	render();
}

function render()
{
	if ( n == 0 ) { n = 2; resetBus(); }
	if ( n == 2 ) { moveBus(); zoomCamera(); }

	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
	gl.blendFunc( gl.ONE, gl.ONE_MINUS_SRC_ALPHA );
	
	// bench stuff
	gl.useProgram( shaderBench );

	gl.bindBuffer( gl.ARRAY_BUFFER, vertexBufferBench )
	var vertexPositionBench = gl.getAttribLocation( shaderBench, "vertexPosition" );
	gl.vertexAttribPointer( vertexPositionBench, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray( vertexPositionBench );

	gl.bindBuffer( gl.ARRAY_BUFFER, colorBufferBench )
	var colorValue = gl.getAttribLocation( shaderBench, "colorValue" );
	gl.vertexAttribPointer( colorValue, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray( colorValue );

	gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, iBufferBench );
    gl.drawElements( gl.TRIANGLES, numTrianglesBench, gl.UNSIGNED_SHORT, 0 );
	
	// lamp stuff
	gl.useProgram( shaderLamp );

	gl.bindBuffer( gl.ARRAY_BUFFER, vertexBufferLamp )
	var vertexPositionLamp = gl.getAttribLocation( shaderLamp, "vertexPosition" );
	gl.vertexAttribPointer( vertexPositionLamp, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray( vertexPositionLamp );

	gl.bindBuffer( gl.ARRAY_BUFFER, colorBufferLamp )
	var colorValue = gl.getAttribLocation( shaderLamp, "colorValue" );
	gl.vertexAttribPointer( colorValue, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray( colorValue );

	gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, iBufferLamp );
    gl.drawElements( gl.TRIANGLES, numTrianglesLamp, gl.UNSIGNED_SHORT, 0 );

	// stop pole stuff
	gl.useProgram( shaderStopPole );

	gl.bindBuffer( gl.ARRAY_BUFFER, vertexBufferStopPole )
	var vertexPositionStopPole = gl.getAttribLocation( shaderStopPole, "vertexPosition" );
	gl.vertexAttribPointer( vertexPositionStopPole, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray( vertexPositionStopPole );

	gl.bindBuffer( gl.ARRAY_BUFFER, textureVertexBufferStopPole )
	var textureCoordinateStopPole = gl.getAttribLocation( shaderStopPole, "textureCoordinate" );
	gl.vertexAttribPointer( textureCoordinateStopPole, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray( textureCoordinateStopPole );

	/*
	gl.bindBuffer( gl.ARRAY_BUFFER, normalStopPole );
	var nvStopPole = gl.getAttribLocation( shaderStopPole, "nv" );
	gl.vertexAttribPointer( nvStopPole, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( nvStopPole );
	*/

	gl.activeTexture( gl.TEXTURE0 );
	gl.bindTexture( gl.TEXTURE_2D, texturePole );
	gl.uniform1i( gl.getUniformLocation( shaderStopPole , "texMap" ), 0 );

	gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, iBufferStopPole );
    gl.drawElements( gl.TRIANGLES, numTrianglesPole, gl.UNSIGNED_SHORT, 0 );

	// stop sign stuff
	gl.useProgram( shaderStopSign );

	gl.bindBuffer( gl.ARRAY_BUFFER, vertexBufferStopSign )
	var vertexPositionStopSign = gl.getAttribLocation( shaderStopSign, "vertexPosition" );
	gl.vertexAttribPointer( vertexPositionStopSign, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray( vertexPositionStopSign );

	gl.bindBuffer( gl.ARRAY_BUFFER, textureVertexBufferStopSign )
	var textureCoordinateStopSign = gl.getAttribLocation( shaderStopSign, "textureCoordinate" );
	gl.vertexAttribPointer( textureCoordinateStopSign, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray( textureCoordinateStopSign );

	gl.activeTexture( gl.TEXTURE1 );
	gl.bindTexture( gl.TEXTURE_2D, textureBus );
	gl.uniform1i( gl.getUniformLocation( shaderStopSign , "texMap" ), 1 );

	gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, iBufferStopSign );
    gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0 );

	// bus stop pole stuff
	gl.useProgram( shaderBusStopPole );

	gl.bindBuffer( gl.ARRAY_BUFFER, vertexBufferBusStopPole )
	var vertexPositionBusStopPole = gl.getAttribLocation( shaderBusStopPole, "vertexPosition" );
	gl.vertexAttribPointer( vertexPositionBusStopPole, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray( vertexPositionBusStopPole );

	gl.bindBuffer( gl.ARRAY_BUFFER, textureVertexBufferBusStopPole )
	var textureCoordinateBusStopPole = gl.getAttribLocation( shaderBusStopPole, "textureCoordinate" );
	gl.vertexAttribPointer( textureCoordinateBusStopPole, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray( textureCoordinateBusStopPole );

	gl.activeTexture( gl.TEXTURE0 );
	gl.bindTexture( gl.TEXTURE_2D, texturePole );
	gl.uniform1i( gl.getUniformLocation( shaderBusStopPole , "texMap" ), 0 );

	gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, iBufferBusStopPole );
	gl.drawElements( gl.TRIANGLES, numTrianglesPole, gl.UNSIGNED_SHORT, 0 );

	// bus stop sign stuff
	gl.useProgram( shaderBusStopSign );

	gl.bindBuffer( gl.ARRAY_BUFFER, vertexBufferBusStopSign )
	var vertexPositionBusStopSign = gl.getAttribLocation( shaderBusStopSign, "vertexPosition" );
	gl.vertexAttribPointer( vertexPositionBusStopSign, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray( vertexPositionBusStopSign );

	gl.bindBuffer( gl.ARRAY_BUFFER, textureVertexBufferBusStopSign )
	var textureCoordinateBusStopSign = gl.getAttribLocation( shaderBusStopSign, "textureCoordinate" );
	gl.vertexAttribPointer( textureCoordinateBusStopSign, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray( textureCoordinateBusStopSign );

	gl.activeTexture( gl.TEXTURE2 );
	gl.bindTexture( gl.TEXTURE_2D, texturePole );
	gl.uniform1i( gl.getUniformLocation( shaderBusStopSign , "texMap" ), 2 );

	gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, iBufferBusStopSign );
    gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0 );

	// bus stop pole stuff
	gl.useProgram( shaderBusStopPole );

	gl.bindBuffer( gl.ARRAY_BUFFER, vertexBufferBusStopPole )
	var vertexPositionBusStopPole = gl.getAttribLocation( shaderBusStopPole, "vertexPosition" );
	gl.vertexAttribPointer( vertexPositionBusStopPole, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray( vertexPositionBusStopPole );

	gl.bindBuffer( gl.ARRAY_BUFFER, textureVertexBufferBusStopPole )
	// street stuff
	gl.useProgram( shaderStreet );

	gl.bindBuffer( gl.ARRAY_BUFFER, vertexBufferStreet )
	var vertexPositionStreet = gl.getAttribLocation( shaderStreet, "vertexPosition" );
	gl.vertexAttribPointer( vertexPositionStreet, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray( vertexPositionStreet );

	gl.bindBuffer( gl.ARRAY_BUFFER, textureVertexBufferStreet )
	var textureCoordinateStreet = gl.getAttribLocation( shaderStreet, "textureCoordinate" );
	gl.vertexAttribPointer( textureCoordinateStreet, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray( textureCoordinateStreet );

	gl.activeTexture( gl.TEXTURE2 );
	gl.bindTexture( gl.TEXTURE_2D, textureStreet );
	gl.uniform1i( gl.getUniformLocation( shaderStreet, "texMap" ), 2 );

	gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, iBufferStreet );
    gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0 );

	// sidewalk stuff
	gl.useProgram( shaderSidewalk );

	gl.bindBuffer( gl.ARRAY_BUFFER, vertexBufferSidewalk )
	var vertexPositionSidewalk = gl.getAttribLocation( shaderSidewalk, "vertexPosition" );
	gl.vertexAttribPointer( vertexPositionSidewalk, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray( vertexPositionSidewalk );

	gl.bindBuffer( gl.ARRAY_BUFFER, colorBufferSidewalk )
	var colorValue = gl.getAttribLocation( shaderSidewalk, "colorValue" );
	gl.vertexAttribPointer( colorValue, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray( colorValue );

	gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, iBufferSidewalk );
    gl.drawElements( gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0 );

	// bus stuff
	gl.useProgram( shaderBus );

	gl.bindBuffer( gl.ARRAY_BUFFER, vertexBufferBus )
	var vertexPositionBus = gl.getAttribLocation( shaderBus, "vertexPosition" );
	gl.vertexAttribPointer( vertexPositionBus, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray( vertexPositionBus );

	gl.bindBuffer( gl.ARRAY_BUFFER, textureVertexBufferBus )
	var textureCoordinateBus = gl.getAttribLocation( shaderBus, "textureCoordinate" );
	gl.vertexAttribPointer( textureCoordinateBus, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray( textureCoordinateBus );

	gl.activeTexture( gl.TEXTURE1 );
	gl.bindTexture( gl.TEXTURE_2D, textureBus );
	gl.uniform1i( gl.getUniformLocation( shaderBus, "texMap" ), 1 );

	gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, iBufferBus );
    gl.drawElements( gl.TRIANGLES, 30, gl.UNSIGNED_SHORT, 0 );

	n++;
	n = n % 2 + 2;
	requestAnimFrame( render );
}

function makeBench()
{
	var vertices = getBenchVertices();
	var indexList = getBenchFaces();
	numTrianglesBench = indexList.length - 1;
	var vertexColor = [];
	for ( var i = 0; i < vertices.length; i++ )
		vertexColor.push( vec4( .4331, .3255, .1569, 1 ) );

	gl.useProgram( shaderBench );
	
	iBufferBench = gl.createBuffer();
	gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, iBufferBench  );
	gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexList), gl.STATIC_DRAW);

	vertexBufferBench = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, vertexBufferBench );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

	var vertexPosition = gl.getAttribLocation( shaderBench, "vertexPosition" );
	gl.vertexAttribPointer( vertexPosition, 4, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vertexPosition );

	colorBufferBench = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, colorBufferBench );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(vertexColor), gl.STATIC_DRAW );

	var colorValue = gl.getAttribLocation( shaderBench, "colorValue" );
	gl.vertexAttribPointer( colorValue, 4, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( colorValue );

}

function makeLamp()
{
	var vertices = getLampVertices();
	var indexList = getLampFaces();
	numTrianglesLamp = indexList.length - 1;
	var vertexColor = [];
	for ( var i = 0; i < vertices.length; i++ )
		vertexColor.push( vec4( .5922, .5922, .5922, 1 ) );

	gl.useProgram( shaderLamp );
	
	iBufferLamp = gl.createBuffer();
	gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, iBufferLamp  );
	gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexList), gl.STATIC_DRAW);

	vertexBufferLamp = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, vertexBufferLamp );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

	var vertexPosition = gl.getAttribLocation( shaderLamp, "vertexPosition" );
	gl.vertexAttribPointer( vertexPosition, 4, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vertexPosition );

	colorBufferLamp = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, colorBufferLamp );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(vertexColor), gl.STATIC_DRAW );

	var colorValue = gl.getAttribLocation( shaderLamp, "colorValue" );
	gl.vertexAttribPointer( colorValue, 4, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( colorValue );
}

function makePole()
{
	var vertices = [];
	for ( var i = 0; i < 2; i += .01 )
	{
		vertices.push( vec4( 0.25*Math.sin(Math.PI*i), 0.0, 0.25*Math.cos(Math.PI*i), 1.0 ) );
		vertices.push( vec4( 0.25*Math.sin(Math.PI*i), 9.0, 0.25*Math.cos(Math.PI*i), 1.0 ) );
	}

	var textureCoordinate = [];
	for ( var i = 0; i < 2; i+= .01 )
	{
		textureCoordinate.push( vec2( Math.sin(Math.PI/4*i)*.5, 0.0 ) );
		textureCoordinate.push( vec2( Math.sin(Math.PI/4*i)*.5, 1.0 ) );
	}
	var vertexColor = [];
	for ( var i = 0; i < vertices.length; i++ )
		vertexColor.push( vec4( .9805, 1.0, .8824, 1 ) );

	var indexList = [];
	var numVertices = vertices.length;
	for ( var i = 0; i < numVertices; i+=2 )
	{
		indexList.push(i);
		indexList.push(i+1);
		indexList.push((i+3)%numVertices);
		indexList.push(i);
		indexList.push((i+3)%numVertices);
		indexList.push((i+2)%numVertices);
	}
	numTrianglesPole = indexList.length;

	gl.useProgram( shaderStopPole );
	// initialization of pole texture
	texturePole = gl.createTexture();
	gl.bindTexture( gl.TEXTURE_2D, texturePole );
	const poleImage = new Image();
	// run python server.py to access
	var url = "http://0.0.0.0:8000/texture/pole-sign.png";
	poleImage.crossOrigin = "anonymous";

	poleImage.onload = function () {
		gl.bindTexture( gl.TEXTURE_2D, texturePole );
		gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, poleImage );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );
		gl.generateMipmap( gl.TEXTURE_2D );
		return texturePole;
	};
	poleImage.src = url;

	iBufferStopPole = gl.createBuffer();
	gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, iBufferStopPole  );
	gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexList), gl.STATIC_DRAW);

	vertexBufferStopPole = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, vertexBufferStopPole );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

	var vertexPosition = gl.getAttribLocation( shaderStopPole, "vertexPosition" );
	gl.vertexAttribPointer( vertexPosition, 4, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vertexPosition );

	textureVertexBufferStopPole = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, textureVertexBufferStopPole );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(textureCoordinate), gl.STATIC_DRAW );

	var textureCoordinate = gl.getAttribLocation( shaderStopPole, "textureCoordinate" );
	gl.vertexAttribPointer( textureCoordinate, 2, gl.FLOAT, false, 0, 0 );

	/*
	var faceNormals = getFaceNormals( vertices, indexList, indexList.length/3 );
	var vertexNormals = getVertexNormals( indexList, faceNormals, vertices.length, indexList.length/3 );
	normalStopPole = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, normalStopPole );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(vertexNormals), gl.STATIC_DRAW );

	var nv = gl.getAttribLocation( shaderStopPole, "nv" );
	gl.vertexAttribPointer( nv, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( nv );
	*/
}

function makePoleBus()
{
	var vertices = [];
	for ( var i = 0; i < 2; i += .01 )
	{
		vertices.push( vec4( 0.25*Math.sin(Math.PI*i), 0.0, 0.25*Math.cos(Math.PI*i), 1.0 ) );
		vertices.push( vec4( 0.25*Math.sin(Math.PI*i), 9.0, 0.25*Math.cos(Math.PI*i), 1.0 ) );
	}

	var textureCoordinate = [];
	for ( var i = 0; i < 2; i+= .01 )
	{
		textureCoordinate.push( vec2( Math.sin(Math.PI/4*i)*.5, 0.0 ) );
		textureCoordinate.push( vec2( Math.sin(Math.PI/4*i)*.5, 1.0 ) );
	}
	var vertexColor = [];
	for ( var i = 0; i < vertices.length; i++ )
		vertexColor.push( vec4( .9805, 1.0, .8824, 1 ) );

	var indexList = [];
	var numVertices = vertices.length;
	for ( var i = 0; i < numVertices; i+=2 )
	{
		indexList.push(i);
		indexList.push(i+1);
		indexList.push((i+3)%numVertices);
		indexList.push(i);
		indexList.push((i+3)%numVertices);
		indexList.push((i+2)%numVertices);
	}

	gl.useProgram( shaderBusStopPole );
	
	iBufferBusStopPole = gl.createBuffer();
	gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, iBufferBusStopPole  );
	gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexList), gl.STATIC_DRAW);

	vertexBufferBusStopPole = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, vertexBufferBusStopPole );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

	var vertexPosition = gl.getAttribLocation( shaderBusStopPole, "vertexPosition" );
	gl.vertexAttribPointer( vertexPosition, 4, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vertexPosition );

	textureVertexBufferBusStopPole = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, textureVertexBufferBusStopPole );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(textureCoordinate), gl.STATIC_DRAW );

	var textureCoordinate = gl.getAttribLocation( shaderBusStopPole, "textureCoordinate" );
	gl.vertexAttribPointer( textureCoordinate, 2, gl.FLOAT, false, 0, 0 );
}

function makeStopSign()
{
	var vertices = [ 0, 0, 0,
					1, 0, 0,
					1, 1, 0,
					0, 1, 0];

	var textureCoordinate = [ .4, .799,
					.6, .799,
					.6, .6,
					.4, .6];

	var indexList = [0,1,2,
					0,2,3];

	gl.useProgram( shaderStopSign );
	
	iBufferStopSign = gl.createBuffer();
	gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, iBufferStopSign  );
	gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexList), gl.STATIC_DRAW);

	vertexBufferStopSign = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, vertexBufferStopSign );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

	var vertexPosition = gl.getAttribLocation( shaderStopSign, "vertexPosition" );
	gl.vertexAttribPointer( vertexPosition, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vertexPosition );

	textureVertexBufferStopSign = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, textureVertexBufferStopSign );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(textureCoordinate), gl.STATIC_DRAW );

	var textureCoordinate = gl.getAttribLocation( shaderStopSign, "textureCoordinate" );
	gl.vertexAttribPointer( textureCoordinate, 2, gl.FLOAT, false, 0, 0 );

	/*
	var faceNormals = getFaceNormals( vertices, indexList, indexList.length/3 );
	var vertexNormals = getVertexNormals( indexList, faceNormals, vertices.length, indexList.length/3 );
	normalStopSign = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, normalStopSign );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(vertexNormals), gl.STATIC_DRAW );

	var nv = gl.getAttribLocation( shaderStopSign, "nv" );
	gl.vertexAttribPointer( nv, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( nv );
	*/

}

function makeBusStopSign()
{
	var vertices = [ 0, 0, 0,
					1, 0, 0,
					1, 1, 0,
					0, 1, 0];

	var textureCoordinate = [ .5, .5,
					1, .5,
					1, 0,
					.5, 0];

	var indexList = [0,1,2,
					0,2,3];

	gl.useProgram( shaderBusStopSign );
	
	iBufferBusStopSign = gl.createBuffer();
	gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, iBufferBusStopSign  );
	gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexList), gl.STATIC_DRAW);

	vertexBufferBusStopSign = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, vertexBufferBusStopSign );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

	var vertexPosition = gl.getAttribLocation( shaderBusStopSign, "vertexPosition" );
	gl.vertexAttribPointer( vertexPosition, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vertexPosition );

	textureVertexBufferBusStopSign = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, textureVertexBufferBusStopSign );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(textureCoordinate), gl.STATIC_DRAW );

	var textureCoordinate = gl.getAttribLocation( shaderBusStopSign, "textureCoordinate" );
	gl.vertexAttribPointer( textureCoordinate, 2, gl.FLOAT, false, 0, 0 );
}

function makeBus()
{
	var vertices = 
		[ // Left
			-2.5, 3.0, 1.0,
			2.5, 3.0, 1.0,
			2.5, 0.0, 1.0,
			-2.5, 0.0, 1.0,
		// Right
			2.5, 3.0, -1.0,
			-2.5, 3.0, -1.0,
			-2.5, 0.0, -1.0,
			2.5, 0.0, -1.0,
		// Top
			2.5, 3.0, -1.0,
			-2.5, 3.0, -1.0,
			-2.5, 3.0, 1.0,
			2.5, 3.0, 1.0,
		// Front
			-2.5, 3.0, 1.0,
			-2.5, 3.0, -1.0,
			-2.5, 0.0, -1.0,
			-2.5, 0.0, 1.0,
		// Back
			2.5, 3.0, 1.0,
			2.5, 3.0, -1.0,
			2.5, 0.0, -1.0,
			2.5, 0.0, 1.0];

	var textureCoordinates = 
		[ // Left
			0.0, 0.3008,
			1.0, 0.3008,
			1.0, 0.599,
			0.0, 0.599,
		// Right
			0.0, 0.0,
			1.0, 0.0,
			1.0, 0.2995,
			0.0, 0.2995,
		// Top
			0.0, 0.8012,
			1.0, 0.8012,
			1.0, 1.0,
			0.0, 1.0,
		// Front
			0.0, 0.7993,
			0.0, 0.6012,
			0.2998, 0.6012,
			0.2998, 0.7993,
		// Back
			1.0, 0.6012,
			1.0, 0.7989,
			0.7012, 0.7989,
			0.7012, 0.6012];
	
	var indexList =
		[ // Right
			0,1,2,
			0,2,3,
		// Left
			4,5,6,
			4,6,7,
		// Front
			8,9,10,
			8,10,11,
		// Back
			12,13,14,
			12,14,15,
		// Top
			16,17,18,
			16,18,19];

	// initialization of bus texture
	gl.useProgram( shaderBus )
	textureBus = gl.createTexture();
	gl.bindTexture( gl.TEXTURE_2D, textureBus );
	const busImage = new Image();
	// run python server.py to access
	var url = "http://0.0.0.0:8000/texture/bus.png";
	busImage.crossOrigin = "anonymous";

	busImage.onload = function () {
		gl.bindTexture( gl.TEXTURE_2D, textureBus );
		gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, busImage );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );
		gl.generateMipmap( gl.TEXTURE_2D );
		return textureBus;
	};
	busImage.src = url;

	// initialization for bus drawing
	iBufferBus = gl.createBuffer();
	gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, iBufferBus  );
	gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexList), gl.STATIC_DRAW);

	vertexBufferBus = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, vertexBufferBus );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

	var vertexPosition = gl.getAttribLocation( shaderBus, "vertexPosition" );
	gl.vertexAttribPointer( vertexPosition, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vertexPosition );

	textureVertexBufferBus = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, textureVertexBufferBus );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(textureCoordinates), gl.STATIC_DRAW );

	var textureCoordinate = gl.getAttribLocation( shaderBus, "textureCoordinate" );
	gl.vertexAttribPointer( textureCoordinate, 2, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( textureCoordinate );
}

function makeStreet()
{
	var vertices = [-43.0, .0, 40.0,
					-43.0, .0, -10.0,
					30.0, .0, -10.0,
					30.0, .0, 40.0]; 

	var textureCoordinates = [0.0, 1.0,
							0.0, 0.0,
							1.0, 0.0,
							1.0, 1.0];
	
	var indexList = [0,3,2,
					0,2,1];

	// Initialization of Street texture
	gl.useProgram( shaderStreet );

	textureStreet = gl.createTexture();
	gl.bindTexture( gl.TEXTURE_2D, textureStreet );
	const streetImage = new Image();
	// run python server.py to acces100
	var url = "http://0.0.0.0:8000/texture/road.png";
	streetImage.crossOrigin = "anonymous";

	streetImage.onload = function () {
		gl.bindTexture( gl.TEXTURE_2D, textureStreet );
		gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, streetImage );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );
		gl.generateMipmap( gl.TEXTURE_2D );
		return textureBus;
	}
	streetImage.src = url;

	iBufferStreet = gl.createBuffer();
	gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, iBufferStreet  );
	gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexList), gl.STATIC_DRAW);

	vertexBufferStreet = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, vertexBufferStreet );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

	var vertexPosition = gl.getAttribLocation( shaderStreet, "vertexPosition" );
	gl.vertexAttribPointer( vertexPosition, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vertexPosition );

	textureVertexBufferStreet = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, textureVertexBufferStreet );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(textureCoordinates), gl.STATIC_DRAW );

	var textureCoordinate = gl.getAttribLocation( shaderStreet, "textureCoordinate" );
	gl.vertexAttribPointer( textureCoordinate, 2, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( textureCoordinate );
}

function makeSidewalk()
{
	var vertices = [ vec4( -55.0, 0.0, -10.0, 1.0  ),
		vec4( -55.0, 0.0, -20.0, 1.0 ),
		vec4( 30.0, 0.0, -20.0, 1.0 ),
		vec4( 30.0, 0.0, -10.0, 1.0 ),
		vec4( -55.0, 1.0, -10.0, 1.0  ),
		vec4( -55.0, 1.0, -20.0, 1.0 ),
		vec4( 30.0, 1.0, -20.0, 1.0 ),
		vec4( 30.0, 1.0, -10.0, 1.0 )];

	var vertexColors =  [ vec4( .4431, .4196, .3529, 1.0 ),
		vec4( .4431, .4196, .3529, 1.0 ),
		vec4( .4431, .4196, .3529, 1.0 ),
		vec4( .4431, .4196, .3529, 1.0 ),
		vec4( .4431, .4196, .3529, 1.0 ),
		vec4( .4431, .4196, .3529, 1.0 ),
		vec4( .4431, .4196, .3529, 1.0 ),
		vec4( .4431, .4196, .3529, 1.0 )];

	var indexList = [
		// Bottom
		0,1,2,
		0,2,3,
		// Top
		4,5,6,
		4,6,7,
		// Left
		0,4,5,
		0,5,1,
		// Front
		0,3,7,
		0,7,4,
		// Right
		3,2,6,
		3,6,7,
		// Back
		2,6,5,
		2,5,1];

	gl.useProgram( shaderSidewalk );

	iBufferSidewalk = gl.createBuffer();
	gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, iBufferSidewalk  );
	gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexList), gl.STATIC_DRAW);

	vertexBufferSidewalk = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, vertexBufferSidewalk );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

	var vertexPosition = gl.getAttribLocation( shaderSidewalk, "vertexPosition" );
	gl.vertexAttribPointer( vertexPosition, 4, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vertexPosition );

	colorBufferSidewalk = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, colorBufferSidewalk );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(vertexColors), gl.STATIC_DRAW );

	var colorValue = gl.getAttribLocation( shaderSidewalk, "colorValue" );
	gl.vertexAttribPointer( colorValue, 4, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( colorValue );
}

/* update bus movements and transformations */
function moveBus()
{
	if ( controller[" "].pressed )
		horn.play();
	else if ( !controller[" "].pressed )
	{
		horn.pause()
		horn.currentTime = 0;
	}

	var distance = 0;

	if ( controller["w"].pressed )
	{
		distance = .10;
		if ( controller["d"].pressed )
			theta -= Math.PI / 700;
		if ( controller["a"].pressed )
			theta += Math.PI / 700; 
	}
	if ( controller["s"].pressed )
	{
		distance = -.10;
		if ( controller["d"].pressed )
			theta += Math.PI / 700;
		if ( controller["a"].pressed )
			theta -= Math.PI / 700;
	}

	tx += distance * Math.sin(theta - Math.PI/2);
	tz += distance * Math.cos(theta - Math.PI/2);

	if ( controller["o"].pressed )
	{
		sx += .01;
		sy += .01;
		sz += .01;
	}
	if ( controller["p"].pressed )
	{
		sx -= .01;
		sy -= .01;
		sz -= .01;
	}

	gl.useProgram( shaderBus );

	Mr = [Math.cos(theta), .0, -Math.sin(theta), .0,
		.0, 1.0, .0, .0,
		Math.sin(theta), .0, Math.cos(theta), .0,
		.0, .0, .0, 1.0];
	MrUni = gl.getUniformLocation( shaderBus, "Mr" );
	gl.uniformMatrix4fv( MrUni, false, Mr );

	Mt = [1.0, .0, .0, .0,
		.0, 1.0, .0, .0,
		.0, .0, 1.0, .0,
		tx, ty, tz, 1.0];
	MtUni = gl.getUniformLocation( shaderBus, "Mt" );
	gl.uniformMatrix4fv( MtUni, false, Mt );

	Ms = [sx, .0, .0, .0,
		.0, sy, .0, .0,
		.0, .0, sz, .0,
		.0, .0, .0, 1.0];
	MsUni = gl.getUniformLocation( shaderBus, "Ms" );
	gl.uniformMatrix4fv( MsUni, false, Ms );
}

function zoomCamera()
{
	if ( controller["z"].pressed && zh )
	{
		zoom = !zoom;
		zh = false;
	}
	else if ( !controller["z"].pressed )
		zh = true;

	if ( zoom )
	{
		if ( cz < .3 )
			cz += 0.005;
	}
	else
	{
		if ( cz > .1 )
			cz -= 0.005;
	}

	gl.useProgram( shaderBus );

	Pz = [cz, .0, .0, .0,
		.0, cz, .0, .0,
		.0, .0, cz, .0,
		.0, .0, .0, 1.0];
	PzUni = gl.getUniformLocation( shaderBus, "Pz" );
	gl.uniformMatrix4fv( PzUni, false, Pz );
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
        vn = normalize(vn);
        vn[0]=-1.0*vn[0];
        vn[1]=-1.0*vn[1];
        vn[2]=-1.0*vn[2];
        
        vertexNormals.push( vn );
    }
    return vertexNormals;
}

function resetBus()
{
	gl.useProgram( shaderBus );

	theta = .0;
	Mr = [Math.cos(theta), -Math.sin(theta), .0, .0,
		Math.sin(theta), Math.cos(theta), .0, .0,
		.0, .0, 1.0, .0,
		.0, .0, .0, 1.0];
	MrUni = gl.getUniformLocation( shaderBus, "Mr" );
	gl.uniformMatrix4fv( MrUni, false, Mr );
	
	tx = 30.0;
	ty = .0;
	tz = 6.0;
	Mt = [1.0, .0, .0, .0,
		.0, 1.0, .0, .0,
		.0, .0, 1.0, .0,
		tx, ty, tz, 1.0];
	MtUni = gl.getUniformLocation( shaderBus, "Mt" );
	gl.uniformMatrix4fv( MtUni, false, Mt );

	sx = 4.0;
	sy = 4.0;
	sz = 4.0;
	Ms = [sx, .0, .0, .0,
		.0, sy, .0, .0,
		.0, .0, sz, .0,
		.0, .0, .0, 1.0];
	MsUni = gl.getUniformLocation( shaderBus, "Ms" );
	gl.uniformMatrix4fv( MsUni, false, Ms );

	zoom = false;
	zh = true;
	cz = .1;
	Pz = [cz, .0, .0, .0,
		.0, cz, .0, .0,
		.0, .0, cz, .0,
		.0, .0, .0, 1.0];
	PzUni = gl.getUniformLocation( shaderBus, "Pz" );
	gl.uniformMatrix4fv( PzUni, false, Pz );

	requestAnimFrame( render );
}
