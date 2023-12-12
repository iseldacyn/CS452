iF = input("OBJ file to be parsed: ")
iF += ".obj"
oF = input("JS file to be created: ")
oF += ".js"
oFname = oF

oF = open( oF, "w" )

n = 0
v = 0

with open( iF, "r" ) as file:
    lines = file.readlines()
    for line in lines:
        line = line.split()
        if not line:
            continue

        if n == 0 and line[0] == 'v':
            oF.write( "function getVertices()\n{\n" )
            oF.write( f'\tvar vertices = [ vec4( {line[1]}, {line[2]}, {line[3]}, 1.0 )' )
            v += 1
            n += 1

        elif line[0] == 'v':
            oF.write( f',\n\t\t\t\tvec4( {line[1]}, {line[2]}, {line[3]}, 1.0 )' )
            v += 1

        if n == 1 and line[0] == 'vt':
            oF.write( "];\n\n\treturn vertices;\n}\n\nfunction getTextureCoordinates()\n{\n" )
            oF.write( f'\tvar textureCoordinates = [ vec2( {line[1]}, {line[2]} )' )
            n += 1

        elif line[0] == 'vt':
            oF.write( f',\n\t\t\t\tvec2( {line[1]}, {line[2]} )' )

        if n == 2 and line[0] == 'vn':
            oF.write( "];\n\n\treturn textureCoordinates;\n}\n\nfunction getVertexNormals()\n{\n" )
            oF.write( f'\tvar vertexNormals = [ vec3( {line[1]}, {line[2]}, {line[3]} )' )
            n += 1
        
        elif line[0] == 'vn':
            oF.write( f',\n\t\t\t\tvec3( {line[1]}, {line[2]}, {line[3]} )' )

        if n == 3 and line[0] == 'f':
            oF.write( "];\n\n\treturn vertexNormals;\n}\n\nfunction getFaces()\n{\n" )
            oF.write( f'\n\tvar indexList = [ ' )
            indices = []
            for index in line:
                index = index.split('/')
                indices.append( index )
            if int(indices[1][0]) < 0:
                oF.write( f'{v-indices[1][0]}' )
            else:
                oF.write( f'{indices[1][0]}' )
            if int(indices[2][0]) < 0:
                oF.write( f', {v-indices[2][0]}' )
            else:
                oF.write( f', {indices[2][0]}' )
            if int(indices[3][0]) < 0:
                oF.write( f', {v-indices[3][0]}' )
            else:
                oF.write( f', {indices[3][0]}' )
            i = len(indices)-1
            while ( i > 3 ):
                if int(indices[1][0]) < 0:
                    oF.write( f',\n\t\t\t\t{v-indices[1][0]}' )
                else:
                    oF.write( f',\n\t\t\t\t{indices[1][0]}' )
                if int(indices[i-1][0]) < 0:
                    oF.write( f', {v-indices[i-1][0]}' )
                else:
                    oF.write( f', {indices[i-1][0]}' )
                if int(indices[i][0]) < 0:
                    oF.write( f', {v-indices[i][0]}' )
                else:
                    oF.write( f', {indices[i][0]}' )
                i -= 1
            n += 1

        if line[0] == 'f':
            indices = []
            for index in line:
                index = index.split('/')
                indices.append( index )
            if int(indices[1][0]) < 0:
                oF.write( f',\n\t\t\t\t{v-indices[1][0]}' )
            else:
                oF.write( f',\n\t\t\t\t{indices[1][0]}' )
            if int(indices[2][0]) < 0:
                oF.write( f', {v-indices[2][0]}' )
            else:
                oF.write( f', {indices[2][0]}' )
            if int(indices[3][0]) < 0:
                oF.write( f', {v-indices[3][0]}' )
            else:
                oF.write( f', {indices[3][0]}' )
            i = len(indices)-1
            while ( i > 3 ):
                if int(indices[1][0]) < 0:
                    oF.write( f',\n\t\t\t\t{v-indices[1][0]}' )
                else:
                    oF.write( f',\n\t\t\t\t{indices[1][0]}' )
                if int(indices[i-1][0]) < 0:
                    oF.write( f', {v-indices[i-1][0]}' )
                else:
                    oF.write( f', {indices[i-1][0]}' )
                if int(indices[i][0]) < 0:
                    oF.write( f', {v-indices[i][0]}' )
                else:
                    oF.write( f', {indices[i][0]}' )
                i -= 1

    oF.write( " ];\n\n\treturn indexList;\n}" )
    print( "File written to " + oFname )
