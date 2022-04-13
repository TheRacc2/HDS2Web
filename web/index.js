const forwardingPort = 3808; // See app.js for what port this is.

let socket = new ReconnectingWebSocket('ws://127.0.0.1:' + forwardingPort + '/ws');

socket.onopen = () => {
    console.log("Successfully Connected");
};

socket.onclose = event => {
    console.log("Socket Closed Connection: ", event);
    socket.send("Client Closed!")
};

socket.onerror = error => {
    console.log("Socket Error: ", error);
};

let animation = new CountUp('bpm', 0, 0, 0, .5, {
	useEasing: true,
    useGrouping: true,
    separator: " ",
    decimal: "."
});

socket.onmessage = event => {
    let data = JSON.parse(event.data);
    console.log(data);

    animation.update(data[1]);
}