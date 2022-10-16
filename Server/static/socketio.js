var socket = io();
      socket.on('connect', function() {
        socket.emit('transmit', 1);
      });

      socket.on('accel_data', function(accel){
        console.log(accel);
      });