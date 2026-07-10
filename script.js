function formatTo12Hour(date) {
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const hoursStr = String(hours).padStart(2, '0');
    return { hours: hoursStr, minutes, seconds, ampm };
}

function updateClockAndDate() {
    const now = new Date();

    // Update Clock
    const time = formatTo12Hour(now);
    const clockElement = document.getElementById('clock');
    clockElement.innerHTML = `${time.hours}:${time.minutes}:<span id="seconds-display">${time.seconds}</span> ${time.ampm}`;

    const secondsElement = document.getElementById('seconds-display');
    if (secondsElement) {
        secondsElement.classList.add('tick');
        setTimeout(() => {
            secondsElement.classList.remove('tick');
        }, 500); // Match animation duration
    }

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

// Ithaca Clock functionality
const ithacaClockDisplay = document.getElementById('ithaca-clock');

function isDst(d) {
    const year = d.getFullYear();

    // Find the second Sunday in March
    const firstOfMarch = new Date(year, 2, 1);
    const dayOfWeek = firstOfMarch.getDay(); // 0=Sun, 1=Mon, ...
    const firstSunday = new Date(year, 2, 1 + (7 - dayOfWeek) % 7);
    const dstStart = new Date(firstSunday.getTime() + 7 * 24 * 60 * 60 * 1000);
    // Set time to 2 AM
    dstStart.setHours(2);

    // Find the first Sunday in November
    const firstOfNovember = new Date(year, 10, 1);
    const firstSundayNov = new Date(year, 10, 1 + (7 - firstOfNovember.getDay()) % 7);
    const dstEnd = new Date(firstSundayNov.getTime());
    // Set time to 2 AM
    dstEnd.setHours(2);

    return d >= dstStart && d < dstEnd;
}

function updateIthacaClock() {
    const now = new Date();
    // Get UTC time
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    // Determine Ithaca offset (UTC-5 or UTC-4 for EDT)
    const ithacaOffset = isDst(now) ? -4 : -5;
    // Calculate Ithaca time
    const ithacaTime = new Date(utcTime + (3600000 * ithacaOffset));

    const hours = String(ithacaTime.getHours()).padStart(2, '0');
    const minutes = String(ithacaTime.getMinutes()).padStart(2, '0');
    const seconds = String(ithacaTime.getSeconds()).padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}`;
    ithacaClockDisplay.textContent = timeString;
}

function updateAllClocks() {
    updateClockAndDate();
    updateIthacaClock();
}

// Update all clocks every second
setInterval(updateAllClocks, 1000);

// Initial call to display everything immediately
updateAllClocks();

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
        stopwatchDisplay.classList.add('active');
        startTime = Date.now() - elapsedTime;
        stopwatchInterval = setInterval(updateStopwatch, 10); // Update every 10ms
    }
});

stopBtn.addEventListener('click', () => {
    if (isRunning) {
        isRunning = false;
        stopwatchDisplay.classList.remove('active');
        clearInterval(stopwatchInterval);
    }
});

resetBtn.addEventListener('click', () => {
    isRunning = false;
    stopwatchDisplay.classList.remove('active');
    clearInterval(stopwatchInterval);
    elapsedTime = 0;
    stopwatchDisplay.textContent = formatTime(elapsedTime);
});
