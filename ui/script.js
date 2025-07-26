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

        fetch(`/joystick?x=${data.x}&y=${data.y}&t=${data.timestamp}`)
            .then(res => res.text())
            .then(text => console.log("Joystick:", text))
            .catch(console.error);
    }
}

// Initialize joystick
const joystick = new Joystick(
    document.getElementById('joystick'),
    document.getElementById('joystick-knob')
);

// Control buttons
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
    const t = Date.now();
    fetch(`/command?cmd=${command}&t=${t}`)
        .then(res => res.text())
        .then(text => console.log("Command:", text))
        .catch(console.error);
}

// Update live sensor data
function updateSensorData() {
    fetch('/temperature')
        .then(res => res.text())
        .then(temp => {
            document.getElementById('temperature').textContent = `${temp}°C`;
        })
        .catch(err => {
            console.error("Failed to fetch temperature:", err);
        });

    // Simulate other sensors for now
    document.getElementById('humidity').textContent = (60 + Math.random() * 20).toFixed(0) + '%';
    document.getElementById('pressure').textContent = (1010 + Math.random() * 10).toFixed(0) + ' hPa';
    document.getElementById('light').textContent = (700 + Math.random() * 100).toFixed(0) + ' lux';

    // Simulated ML prediction
    const predictions = ['Normal Operation', 'Maintenance Soon', 'Optimal Performance'];
    document.getElementById('ml-prediction').textContent = predictions[Math.floor(Math.random() * predictions.length)];
    document.getElementById('ml-confidence').textContent = (90 + Math.random() * 10).toFixed(1) + '%';
    document.getElementById('ml-updated').textContent = new Date().toLocaleTimeString();
}

// Start periodic updates
updateSensorData();
setInterval(updateSensorData, 3000);
