import * as http from 'http';
import * as debug from 'debug';

import Server from './Server';

debug('ts-express:server');

//create http server
const port = normalizePort(process.env.PORT || 3000);
const app = Server;
app.set('port', port);
const server = http.createServer(app);

//listen on provided port
server.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});
//add error handler
server.on('error', onError);
//start listening on port
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val: number|string): number|string|boolean {
  let port: number = (typeof val === 'string')
    ? parseInt(val, 10)
    : val;

  if (isNaN(port)) return val;

  if (port >= 0) return port;

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') throw error;

  let bind = (typeof port === 'string')
   ? 'Pipe ' + port
   : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch(error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening(): void {
  let addr = server.address();
  let bind = (typeof addr === 'string')
    ? `pipe ${addr}`
    : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
}
