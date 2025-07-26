import network
import socket
from time import sleep
from picozero import pico_led
import rp2
import sys

SSID = 'parth'
PASSWORD = 'parth1894'

def load_file(filename):
    try:
        with open(filename, 'r') as f:
            return f.read()
    except:
        return None

html = load_file("main.html")
css = load_file("style.css")
js = load_file("script.js")

def connect():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(SSID, PASSWORD)

    while not wlan.isconnected():
        if rp2.bootsel_button():
            print("Bootsel pressed. Exiting.")
            raise SystemExit
        print("Waiting for WiFi connection...")
        pico_led.on()
        sleep(0.5)
        pico_led.off()
        sleep(0.5)

    ip = wlan.ifconfig()[0]
    print(f"Connected to WiFi at {ip}")
    pico_led.on()
    return ip

def open_socket(ip):
    addr = (ip, 8080)
    conn = socket.socket()
    conn.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    conn.bind(addr)
    conn.listen(1)
    print(f"Listening on http://{ip}")
    return conn

def serve(conn):
    try:
        while True:
            print("waiting for connection...")
            client, addr = conn.accept()
            print(f"Connected on {addr}")

            request = client.recv(1024).decode("utf-8")
            print("Request:", request)

            response = ""
            content_type = "text/html"

            if "GET /style.css" in request:
                response = css
                content_type = "text/css"

            elif "GET /script.js" in request:
                response = js
                content_type = "application/javascript"

            elif "GET /joystick?" in request:
                print("Joystick command received.")
                response = "joystick: OK"
                content_type = "text/plain"

            elif "GET /command?" in request:
                print("Control command received.")
                response = "command: OK"
                content_type = "text/plain"

            else:
                response = html
                content_type = "text/html"

            client.send("HTTP/1.1 200 OK\r\n")
            client.send("Content-Type: {}\r\n".format(content_type))
            client.send("Connection: close\r\n\r\n")
            client.sendall(response)
            client.close()

    except KeyboardInterrupt:
        print("Server stopped manually.")
    finally:
        print("Closing socket...")
        conn.close()
        raise SystemExit

ip = connect()
connection = open_socket(ip)
serve(connection)
