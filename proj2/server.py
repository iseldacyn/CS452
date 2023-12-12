try:
    from http import server
except ImportError:
    import SimpleHTTPServer as server

class HTTPRequestHandler( server.SimpleHTTPRequestHandler ):
    def end_headers( self ):
        self.send_headers()
        server.SimpleHTTPRequestHandler.end_headers( self )

    def send_headers( self ):
        self.send_header( "Access-Control-Allow-Origin", "*" )


server.test( HandlerClass=HTTPRequestHandler )
