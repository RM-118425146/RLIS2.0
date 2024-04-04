const WsSubscribers = {
    __subscribers: {},
    websocket: undefined,
    webSocketConnected: false,
    registerQueue: [],
    init: function(port, debug, debugFilters) {
        port = port || 49322;
        debug = debug || false;
        if (debug) {
            if (debugFilters !== undefined) {
                console.warn("WebSocket Debug Mode enabled with filtering. Only events not in the filter list will be dumped");
            } else {
                console.warn("WebSocket Debug Mode enabled without filters applied. All events will be dumped to console");
                console.warn("To use filters, pass in an array of 'channel:event' strings to the second parameter of the init function");
            }
        }
        WsSubscribers.webSocket = new WebSocket("ws://localhost:" + port);
        WsSubscribers.webSocket.onmessage = function (event) {
            let jEvent = JSON.parse(event.data);
            if (!jEvent.hasOwnProperty('event')) {
                return;
            }
            let eventSplit = jEvent.event.split(':');
            let channel = eventSplit[0];
            let event_event = eventSplit[1];
            if (debug) {
                if (!debugFilters) {
                    console.log(channel, event_event, jEvent);
                } else if (debugFilters && debugFilters.indexOf(jEvent.event) < 0) {
                    console.log(channel, event_event, jEvent);
                }
            }
            WsSubscribers.triggerSubscribers(channel, event_event, jEvent.data);
        };
        WsSubscribers.webSocket.onopen = function () {
            WsSubscribers.triggerSubscribers("ws", "open");
            WsSubscribers.webSocketConnected = true;
            WsSubscribers.registerQueue.forEach((r) => {
                WsSubscribers.send("wsRelay", "register", r);
            });
            WsSubscribers.registerQueue = [];
        };
        WsSubscribers.webSocket.onerror = function () {
            WsSubscribers.triggerSubscribers("ws", "error");
            WsSubscribers.webSocketConnected = false;
        };
        WsSubscribers.webSocket.onclose = function () {
            WsSubscribers.triggerSubscribers("ws", "close");
            WsSubscribers.webSocketConnected = false;
        };
    },
    /**
     * Add callbacks for when certain events are thrown
     * Execution is guaranteed to be in First In First Out order
     * @param channels
     * @param events
     * @param callback
     */
    subscribe: function(channels, events, callback) {
        if (typeof channels === "string") {
            let channel = channels;
            channels = [];
            channels.push(channel);
        }
        if (typeof events === "string") {
            let event = events;
            events = [];
            events.push(event);
        }
        channels.forEach(function(c) {
            events.forEach(function (e) {
                if (!WsSubscribers.__subscribers.hasOwnProperty(c)) {
                    WsSubscribers.__subscribers[c] = {};
                }
                if (!WsSubscribers.__subscribers[c].hasOwnProperty(e)) {
                    WsSubscribers.__subscribers[c][e] = [];
                    if (WsSubscribers.webSocketConnected) {
                        WsSubscribers.send("wsRelay", "register", `${c}:${e}`);
                    } else {
                        WsSubscribers.registerQueue.push(`${c}:${e}`);
                    }
                }
                WsSubscribers.__subscribers[c][e].push(callback);
            });
        })
    },
    clearEventCallbacks: function (channel, event) {
        if (WsSubscribers.__subscribers.hasOwnProperty(channel) && WsSubscribers.__subscribers[channel].hasOwnProperty(event)) {
            WsSubscribers.__subscribers[channel] = {};
        }
    },
    triggerSubscribers: function (channel, event, data) {
        if (WsSubscribers.__subscribers.hasOwnProperty(channel) && WsSubscribers.__subscribers[channel].hasOwnProperty(event)) {
            WsSubscribers.__subscribers[channel][event].forEach(function(callback) {
                if (callback instanceof Function) {
                    callback(data);
                }
            });
        }
    },
    send: function (channel, event, data) {
        if (typeof channel !== 'string') {
            console.error("Channel must be a string");
            return;
        }
        if (typeof event !== 'string') {
            console.error("Event must be a string");
            return;
        }
        if (channel === 'local') {
            this.triggerSubscribers(channel, event, data);
        } else {
            let cEvent = channel + ":" + event;
            WsSubscribers.webSocket.send(JSON.stringify({
                'event': cEvent,
                'data': data
            }));
        }
    }
};






//EDIT FROM HERE DOWN. DO NOT TOUCH THE ABOVE



















//Variables for EVERYTHING
//Declare here if using across multiple function/need to keep the value for duration of series
//These will only refresh if source is refreshed or the values are set in code


$(() => {
	WsSubscribers.init(49322, true)
    WsSubscribers.subscribe("Games", "Info", (e) => {
        headlineText.innerHTML = e[0]['values'][15][1].toUpperCase();
        scrollText.innerHTML = e[0]['values'][16][1].toUpperCase();
        $('#headlineText').textfill({ maxFontPixels: 25, widthOnly: true });
        $('#scrollText').textfill({ maxFontPixels: 25, widthOnly: true });

        Object.keys(e[1]['values']).forEach((id) => {
          if(e[1]['values'][id][0] == e[0]['values'][2][1]){
              currentBlue.src = e[1]['values'][id][1];
          }
          if(e[1]['values'][id][0] == e[0]['values'][2][3]){
              currentOrange.src = e[1]['values'][id][1];
          }
          if(e[1]['values'][id][0] == e[0]['values'][5][1]){
              nextBlue.src = e[1]['values'][id][1];
          }
          if(e[1]['values'][id][0] == e[0]['values'][5][3]){
              nextOrange.src = e[1]['values'][id][1];
          }
          if(e[1]['values'][id][0] == e[0]['values'][8][1]){
              nextBlue2.src = e[1]['values'][id][1];
          }
          if(e[1]['values'][id][0] == e[0]['values'][8][3]){
              nextOrange2.src = e[1]['values'][id][1];
          }
          if(e[1]['values'][id][0] == e[0]['values'][11][1]){
              nextBlue3.src = e[1]['values'][id][1];
          }
          if(e[1]['values'][id][0] == e[0]['values'][11][3]){
              nextOrange3.src = e[1]['values'][id][1];
          }
         });
    });
});

var intervalId = window.setInterval(function(){
  var oldDate = new Date();
  var newDate = oldDate.getHours() + ":" + oldDate.getMinutes();
  time.innerHTML = newDate;
}, 500);