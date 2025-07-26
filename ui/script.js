/*
class Joystick {
    constructor(element, knob) {
        this.element = element;
        this.knob = knob;
        this.isDragging = false;
        this.centerX = 100;
        this.centerY = 100;
        this.maxDistance = 70;
        this.currentX = 0;
        this.currentY = 0;

        this.init();
    }

    init() {
        this.element.addEventListener('mousedown', this.startDrag.bind(this));
        this.element.addEventListener('touchstart', this.startDrag.bind(this));
        document.addEventListener('mousemove', this.drag.bind(this));
        document.addEventListener('touchmove', this.drag.bind(this));
        document.addEventListener('mouseup', this.stopDrag.bind(this));
        document.addEventListener('touchend', this.stopDrag.bind(this));
    }

    startDrag(e) {
        this.isDragging = true;
        e.preventDefault();
    }

    drag(e) {
        if (!this.isDragging) return;

        e.preventDefault();
        const rect = this.element.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);

        const x = clientX - rect.left - this.centerX;
        const y = clientY - rect.top - this.centerY;

        const distance = Math.sqrt(x * x + y * y);

        if (distance <= this.maxDistance) {
            this.currentX = x;
            this.currentY = y;
        } else {
            this.currentX = (x / distance) * this.maxDistance;
            this.currentY = (y / distance) * this.maxDistance;
        }

        this.updateKnobPosition();
        this.updateValues();
        this.sendControlData();
    }

    stopDrag() {
        if (!this.isDragging) return;
        this.isDragging = false;

        this.currentX = 0;
        this.currentY = 0;
        this.updateKnobPosition();
        this.updateValues();
        this.sendControlData();
    }

    updateKnobPosition() {
        this.knob.style.transform = `translate(${this.currentX - 30}px, ${this.currentY - 30}px)`;
    }

    sendControlData() {
        const data = {
            x: Math.round((this.currentX / this.maxDistance) * 100),
            y: Math.round((-this.currentY / this.maxDistance) * 100),
            timestamp: Date.now()
        };

        // Send to Pico W (replace with actual endpoint)
        // this.sendToPico('/api/joystick', data);
    }

    sendToPico(endpoint, data) {
        // Simulate API call - replace with actual fetch to your Pico W
        console.log('Sending to Pico W:', endpoint, data);
        // fetch(endpoint, {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(data)
        // }).catch(console.error);
    }
}

// Initialize joystick
const joystick = new Joystick(
    document.getElementById('joystick'),
    document.getElementById('joystick-knob')
);

// Control buttons
document.getElementById('start-btn').addEventListener('click', function() {
    this.classList.add('active');
    document.getElementById('stop-btn').classList.remove('active');
    sendCommand('START');
});

document.getElementById('stop-btn').addEventListener('click', function() {
    this.classList.add('active');
    document.getElementById('start-btn').classList.remove('active');
    sendCommand('STOP');
});


function sendCommand(command) {
    const data = { command: command, timestamp: Date.now() };
    console.log('Sending command:', data);
    // Replace with actual API call to Pico W
    // fetch('/api/command', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(data)
    // }).catch(console.error);
}

// Simulate sensor data updates
function updateSensorData() {
    const sensors = {
        temperature: (20 + Math.random() * 10).toFixed(1) + '°C',
        humidity: (60 + Math.random() * 20).toFixed(0) + '%',
        pressure: (1010 + Math.random() * 10).toFixed(0) + ' hPa',
        light: (700 + Math.random() * 100).toFixed(0) + ' lux'
    };

    Object.keys(sensors).forEach(sensor => {
        document.getElementById(sensor).textContent = sensors[sensor];
    });

    // Update ML prediction
    const predictions = ['Normal Operation', 'Maintenance Soon', 'Optimal Performance'];
    const confidence = (90 + Math.random() * 10).toFixed(1) + '%';

    document.getElementById('ml-prediction').textContent = predictions[Math.floor(Math.random() * predictions.length)];
    document.getElementById('ml-confidence').textContent = confidence;
    document.getElementById('ml-updated').textContent = new Date().toLocaleTimeString();
}

// Update sensor data every 3 seconds
setInterval(updateSensorData, 3000);

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Initialize with first data update
updateSensorData();
*/

class Joystick {
    constructor(element, knob) {
        this.element = element;
        this.knob = knob;
        this.isDragging = false;
        this.centerX = 100;
        this.centerY = 100;
        this.maxDistance = 70;
        this.currentX = 0;
        this.currentY = 0;

        this.init();
    }

    init() {
        this.element.addEventListener('mousedown', this.startDrag.bind(this));
        this.element.addEventListener('touchstart', this.startDrag.bind(this));
        document.addEventListener('mousemove', this.drag.bind(this));
        document.addEventListener('touchmove', this.drag.bind(this));
        document.addEventListener('mouseup', this.stopDrag.bind(this));
        document.addEventListener('touchend', this.stopDrag.bind(this));
    }

    startDrag(e) {
        this.isDragging = true;
        e.preventDefault();
    }

    drag(e) {
        if (!this.isDragging) return;
        e.preventDefault();
        const rect = this.element.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);

        const x = clientX - rect.left - this.centerX;
        const y = clientY - rect.top - this.centerY;

        const distance = Math.sqrt(x * x + y * y);
        if (distance <= this.maxDistance) {
            this.currentX = x;
            this.currentY = y;
        } else {
            this.currentX = (x / distance) * this.maxDistance;
            this.currentY = (y / distance) * this.maxDistance;
        }

        this.updateKnobPosition();
        this.sendControlData();
    }

    stopDrag() {
        if (!this.isDragging) return;
        this.isDragging = false;

        this.currentX = 0;
        this.currentY = 0;
        this.updateKnobPosition();
        this.sendControlData();
    }

    updateKnobPosition() {
        this.knob.style.transform = `translate(${this.currentX - 30}px, ${this.currentY - 30}px)`;
    }

    sendControlData() {
        const data = {
            x: Math.round((this.currentX / this.maxDistance) * 100),
            y: Math.round((-this.currentY / this.maxDistance) * 100),
            timestamp: Date.now()
        };

        // send via get
        fetch(`/joystick?x=${data.x}&y=${data.y}&t=${data.timestamp}`)
            .then(res => res.text())
            .then(text => console.log("Joystick sent:", text))
            .catch(console.error);
    }
}

// initialize joystick
const joystick = new Joystick(
    document.getElementById('joystick'),
    document.getElementById('joystick-knob')
);

// start and stop buttons
document.getElementById('start-btn').addEventListener('click', function () {
    this.classList.add('active');
    document.getElementById('stop-btn').classList.remove('active');
    sendCommand('START');
});

document.getElementById('stop-btn').addEventListener('click', function () {
    this.classList.add('active');
    document.getElementById('start-btn').classList.remove('active');
    sendCommand('STOP');
});

function sendCommand(command) {
    const timestamp = Date.now();
    fetch(`/command?cmd=${command}&t=${timestamp}`)
        .then(res => res.text())
        .then(text => console.log("Command sent:", text))
        .catch(console.error);
}

// fake sensor updates
function updateSensorData() {
    const sensors = {
        temperature: (20 + Math.random() * 10).toFixed(1) + '°C',
        humidity: (60 + Math.random() * 20).toFixed(0) + '%',
        pressure: (1010 + Math.random() * 10).toFixed(0) + ' hPa',
        light: (700 + Math.random() * 100).toFixed(0) + ' lux'
    };

    for (const sensor in sensors) {
        document.getElementById(sensor).textContent = sensors[sensor];
    }

    const predictions = ['Normal Operation', 'Maintenance Soon', 'Optimal Performance'];
    const confidence = (90 + Math.random() * 10).toFixed(1) + '%';

    document.getElementById('ml-prediction').textContent = predictions[Math.floor(Math.random() * predictions.length)];
    document.getElementById('ml-confidence').textContent = confidence;
    document.getElementById('ml-updated').textContent = new Date().toLocaleTimeString();
}

setInterval(updateSensorData, 3000);
updateSensorData();
