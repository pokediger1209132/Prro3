function updateClockAndDate() {
    const now = new Date();

    // Update Clock
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}`;
    document.getElementById('clock').textContent = timeString;

    // Update Date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = now.toLocaleDateString(undefined, options);
    document.getElementById('date').textContent = dateString;

    // Update Timezone
    const timezoneMatch = now.toString().match(/\(([^)]+)\)/);
    if (timezoneMatch && timezoneMatch[1]) {
        document.getElementById('timezone').textContent = timezoneMatch[1];
    }
}

// Update the clock and date every second
setInterval(updateClockAndDate, 1000);

// Initial call to display everything immediately
updateClockAndDate();

// Stopwatch functionality
const stopwatchDisplay = document.getElementById('stopwatch');
const startBtn = document.getElementById('start-stopwatch');
const stopBtn = document.getElementById('stop-stopwatch');
const resetBtn = document.getElementById('reset-stopwatch');

let stopwatchInterval;
let startTime;
let elapsedTime = 0;
let isRunning = false;

function formatTime(ms) {
    const date = new Date(ms);
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    const milliseconds = String(date.getUTCMilliseconds()).padStart(3, '0');
    return `${minutes}:${seconds}.${milliseconds}`;
}

function updateStopwatch() {
    const currentTime = Date.now();
    elapsedTime = currentTime - startTime;
    stopwatchDisplay.textContent = formatTime(elapsedTime);
}

startBtn.addEventListener('click', () => {
    if (!isRunning) {
        isRunning = true;
        startTime = Date.now() - elapsedTime;
        stopwatchInterval = setInterval(updateStopwatch, 10); // Update every 10ms
    }
});

stopBtn.addEventListener('click', () => {
    if (isRunning) {
        isRunning = false;
        clearInterval(stopwatchInterval);
    }
});

resetBtn.addEventListener('click', () => {
    isRunning = false;
    clearInterval(stopwatchInterval);
    elapsedTime = 0;
    stopwatchDisplay.textContent = formatTime(elapsedTime);
});
