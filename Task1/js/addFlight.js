let flightsData = JSON.parse(localStorage.getItem('flightsData')) || [];

document.addEventListener('DOMContentLoaded', function () {
    const flightNoInput = document.getElementById('flight_name')
    const originSelect = document.getElementById('origin');
    console.log("originSelect:", originSelect);

    if (originSelect) {
        console.log("Element #origin is available.");
    } else {
        console.error("Element #origin not found.");
    }

    const destinationSelect = document.getElementById('destination');
    const boardingDateInput = document.getElementById('boarding_date');
    const boardingTimeInput = document.getElementById('boarding_time');
    const arrivalDateInput = document.getElementById('arrival_date');
    const arrivalTimeInput = document.getElementById('arrival_time');
    const seatsInput = document.getElementById('seats');

    const origins = [...new Set(flightsData.map(flight => flight.origin))];
    const destinations = flightsData.map(flight => flight.destination);

    console.log("Origins array:", origins);
    origins.forEach(origin => {
        const originOption = document.createElement('option');
        originOption.value = origin;
        originOption.textContent = origin;
        originSelect.appendChild(originOption);
    });

    originSelect.addEventListener('change', function () {
        destinationSelect.innerHTML = '';

        const destinationOption = document.createElement('option');
        destinationOption.value = "";
        destinationOption.textContent = "Select destination";
        destinationSelect.appendChild(destinationOption);

        const selectedOrigin = originSelect.value;
        const availableDestinations = flightsData.filter(flight => flight.origin === selectedOrigin).map(flight => flight.destination);

        availableDestinations.forEach(destination => {
            const destinationOption = document.createElement('option');
            destinationOption.value = destination;
            destinationOption.textContent = destination;
            destinationSelect.appendChild(destinationOption);
        });
    });

    const today = new Date().toISOString().split('T')[0];
    boardingDateInput.min = today;

    boardingDateInput.addEventListener('change', function () {
        arrivalDateInput.min = boardingDateInput.value;
    });

    boardingTimeInput.addEventListener('change', function () {
        if (boardingDateInput.value === today) {
            const now = new Date();
            const currentTime = now.toISOString().split('T')[1].slice(0, 5);
            boardingTimeInput.min = currentTime;
        }
    });

    arrivalTimeInput.addEventListener('change', function () {
        if (arrivalDateInput.value === boardingDateInput.value) {
            arrivalTimeInput.min = boardingTimeInput.value;
        }
    });

    addFlightForm.addEventListener('submit', function (e) {
        e.preventDefault();
    
        const newFlight = {
            flight_id: flightsData.length + 1,
            flight_name: document.getElementById('flight_name').value,
            boarding_date: document.getElementById('boarding_date').value,
            boarding_time: document.getElementById('boarding_time').value,
            origin: document.getElementById('origin').value,
            destination: document.getElementById('destination').value,
            arrival_date: document.getElementById('arrival_date').value,
            arrival_time: document.getElementById('arrival_time').value,
            seats: parseInt(document.getElementById('seats').value, 10),
            link: "book-flight.html"
        };

        flightsData.push(newFlight);

        localStorage.setItem('flightsData', JSON.stringify(flightsData));

        alert('Flight added successfully!');

        window.location.href = '../manageFlights.html';
    });
});
