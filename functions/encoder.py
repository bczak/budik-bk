from RPi import GPIO
from time import sleep, time
from firebase_admin import firestore
import firebase_admin

clk = 14
dt = 15
button = 18

GPIO.setmode(GPIO.BCM)
GPIO.setup(clk, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
GPIO.setup(dt, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
GPIO.setup(button, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
app = firebase_admin.initialize_app()

counter = 0
clkLastState = GPIO.input(clk)

prev = (-1, -1)
clicked = 0
def rotate(t): 
    global counter
    global clkLastState
    global clicked
    global prev
    clkState = GPIO.input(clk)
    dtState = GPIO.input(dt)
    if prev[0] == 1 and prev[1] == 0 and clkState == 0 and dtState == 0:
        clicked += 1
        print('button')
        return
    prev = (clkState, dtState)
    
    if clkState != clkLastState:
        if dtState != clkState:
            counter += 1
            print('<')
            firestore.client().collection('settings').doc('rotary').set({'updated': int(time()), 'direction': '>'})
        
        else:
            counter -= 1
            print('>')
            firestore.client().collection('settings').doc('rotary').set({'updated': int(time()), 'direction': '<'})
    clkLastState = clkState

def buttonCallback(e):
    print('button')

GPIO.add_event_detect(clk, GPIO.BOTH, rotate, bouncetime=10)
GPIO.add_event_detect(button, GPIO.BOTH, buttonCallback, bouncetime=500)

while True:
    sleep(10000)