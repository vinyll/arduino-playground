import time
from pyfirmata import Arduino, util

board=Arduino('/dev/tty.usbmodem641')

led = board.get_pin('d:13:o')

def go_green():
    y.write(1)
    time.sleep(DELAY)
    r.write(0)
    g.write(1)
    y.write(0)
    time.sleep(GREEN)
    y.write(1)
    time.sleep(DELAY)
    g.write(0)
    y.write(0)


while True:
    led.write(1)
    time.sleep(.1)
    led.write(0)
    time.sleep(.1)
    led.write(1)
    time.sleep(1)
    led.write(0)
    time.sleep(1)

board.exit()