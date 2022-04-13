const WebSocket = require('ws');

const watchPort = 3476;
const forwardPort = 3808;

let forwardServer = new WebSocket.Server({ port: forwardPort });
let watchServer = new WebSocket.Server({ port: watchPort });

let client = '?';

console.log('Listening on \'ws://localhost:' + watchPort + '\'\n');

watchServer.on('connection', function connection(ws) {
	ws.on('message', function message(data) {
		data = data.toString().split(':');

		if (data[0] === 'clientName') {
			if (client === '?') {
				client = data[1];
				console.log('%s connected', client);
			}

			return;
		}

		if (client == '?') { // Someone sent us something and we don't have a client yet.
			return;
		}
		
		forwardServer.clients.forEach((c) => {
			c.send(JSON.stringify(data));
		})

		console.log('%s: %sbpm', client, data[1]);
	});

	ws.on('close', function disconnect() {
		console.log('%s disconnected', client);
		client = '?';
	});
});

forwardServer.on('connection', function connection(ws, request) {
	const path = request.url;

	if (path === '/ws') {
		console.log("WebSocket connected");
		ws.on('close', function disconnect() {
			console.log("WebSocket disconnected");
		});
	}
	else {
		ws.terminate();
	}
})

forwardServer.on('error', function error() {
	// Socket probably isn't open.
});