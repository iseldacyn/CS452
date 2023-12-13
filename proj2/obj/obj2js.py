iF = input("OBJ file to be parsed: ")
iF += ".obj"
oF = input("JS file to be created: ")
oF += ".js"
oFname = oF

oF = open( oF, "w" )

n = 0
v = 0

for i in range(4):
    file = open( iF, "r" )
    lines = file.readlines()
    if i == 0:
        oF.write( "function getVertices()\n{\n" )
        for line in lines:
            line = line.split()
            if not line:
                continue
            if line[0] != 'v':
                continue

            if n == 0:
                oF.write( f'\tvar vertices = [ vec4( {line[1]}, {line[2]}, {line[3]}, 1.0 )' )
                v += 1
                n += 1

            else:
                oF.write( f',\n\t\t\t\tvec4( {line[1]}, {line[2]}, {line[3]}, 1.0 )' )
                v += 1

    if i == 1:
        oF.write( "];\n\n\treturn vertices;\n}\n\nfunction getTextureCoordinates()\n{\n" )
        for line in lines:
            line = line.split()
            if not line:
                continue
            if line[0] != 'vt':
                continue

            if n == 1:
                oF.write( f'\tvar textureCoordinates = [ vec2( {line[1]}, {line[2]} )' )
                n += 1

            else:
                oF.write( f',\n\t\t\t\tvec2( {line[1]}, {line[2]} )' )

    if i == 2:
        oF.write( "];\n\n\treturn textureCoordinates;\n}\n\nfunction getVertexNormals()\n{\n" )
        for line in lines:
            line = line.split()
            if not line:
                continue
            if line[0] != 'vn':
                continue

            if n == 2:
                oF.write( f'\tvar vertexNormals = [ vec3( {line[1]}, {line[2]}, {line[3]} )' )
                n += 1
            
            else:
                oF.write( f',\n\t\t\t\tvec3( {line[1]}, {line[2]}, {line[3]} )' )

    if i == 3:
        oF.write( "];\n\n\treturn vertexNormals;\n}\n\nfunction getFaces()\n{\n" )
        for line in lines:
            line = line.split()
            if not line:
                continue
            if line[0] != 'f':
                continue

            if n == 3:
                oF.write( f'\n\tvar indexList = [ ' )
                indices = []
                for index in line:
                    index = index.split('/')
                    indices.append( index )
                if int(indices[1][0]) < 0:
                    oF.write( f'{v-int(indices[1][0])-1}' )
                else:
                    oF.write( f'{int(indices[1][0])-1}' )
                if int(indices[2][0]) < 0:
                    oF.write( f', {v-int(indices[2][0])-1}' )
                else:
                    oF.write( f', {int(indices[2][0])-1}' )
                if int(indices[3][0]) < 0:
                    oF.write( f', {v-int(indices[3][0])-1}' )
                else:
                    oF.write( f', {int(indices[3][0])-1}' )
                i = len(indices)-1
                while ( i > 3 ):
                    if int(indices[1][0]) < 0:
                        oF.write( f',\n\t\t\t\t{v-int(indices[1][0])-1}' )
                    else:
                        oF.write( f',\n\t\t\t\t{int(indices[1][0])-1}' )
                    if int(indices[i-1][0]) < 0:
                        oF.write( f', {v-int(indices[i-1][0])-1}' )
                    else:
                        oF.write( f', {int(indices[i-1][0])-1}' )
                    if int(indices[i][0]) < 0:
                        oF.write( f', {v-int(indices[i][0])-1}' )
                    else:
                        oF.write( f', {int(indices[i][0])-1}' )
                    i -= 1
                n += 1

            else:
                indices = []
                for index in line:
                    index = index.split('/')
                    indices.append( index )
                if int(indices[1][0]) < 0:
                    oF.write( f',\n\t\t\t\t{v-int(indices[1][0])-1}' )
                else:
                    oF.write( f',\n\t\t\t\t{int(indices[1][0])-1}' )
                if int(indices[1][0]) < 0:
                    oF.write( f', {v-int(indices[2][0])-1}' )
                else:
                    oF.write( f', {int(indices[2][0])-1}' )
                if int(indices[2][0]) < 0:
                    oF.write( f', {v-int(indices[3][0])-1}' )
                else:
                    oF.write( f', {int(indices[3][0])-1}' )
                i = len(indices)-1
                while ( i > 3 ):
                    if int(indices[1][0]) < 0:
                        oF.write( f',\n\t\t\t\t{v-int(indices[1][0])-1}' )
                    else:
                        oF.write( f',\n\t\t\t\t{int(indices[1][0])-1}' )
                    if int(indices[i-1][0]) < 0:
                        oF.write( f', {v-int(indices[i-1][0])-1}' )
                    else:
                        oF.write( f', {int(indices[i-1][0])-1}' )
                    if int(indices[i][0]) < 0:
                        oF.write( f', {v-int(indices[i][0])-1}' )
                    else:
                        oF.write( f', {int(indices[i][0])-1}' )
                    i -= 1
    file.close()

oF.write( " ];\n\n\treturn indexList;\n}" )
print( "File written to " + oFname )
