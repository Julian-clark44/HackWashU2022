from flask import Flask, render_template
from flask_socketio import SocketIO, send, emit
import MPU6050 
import time


app = Flask(__name__)
socketio = SocketIO(app)


mpu = MPU6050.MPU6050()
accel = [0]*3


def setup():
    mpu.dmp_initialize()


@app.route('/')
def index():
    return render_template('index.html')


@socketio.on('transmit')
def handle_transmission(transmit):
    if(transmit == 1):
        while(True):
            accel = mpu.get_acceleration()
            for i in range(len(accel)):
                accel[i] /= 16384.0
            emit('accel_data', accel)
            time.sleep(1)


if __name__ == '__main__':
    setup()
    socketio.run(app, debug=True, port=80, host='0.0.0.0')
