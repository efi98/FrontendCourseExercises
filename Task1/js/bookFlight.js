document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const flightId = urlParams.get('flight_id');
    const flightName = urlParams.get('flight_name');
    const origin = urlParams.get('origin');
    const destination = urlParams.get('destination');
    const boardingDate = urlParams.get('boarding_date');
    const boardingTime = urlParams.get('boarding_time');
    const arrivalDate = urlParams.get('arrival_date');
    const arrivalTime = urlParams.get('arrival_time');
    const airportName = urlParams.get('airport_name');
    const airportWebsite = urlParams.get('airport_website');
    const imageUrl = urlParams.get('image_url');

    if (origin && destination) {
        document.getElementById('origin').textContent = origin;
        document.getElementById('destination').textContent = destination;
    }

    if (boardingDate && boardingTime) {
        document.getElementById('boarding_date').textContent = boardingDate;
        document.getElementById('boarding_time').textContent = boardingTime;
    }

    if (arrivalDate && arrivalTime) {
        document.getElementById('arrival_date').textContent = arrivalDate;
        document.getElementById('arrival_time').textContent = arrivalTime;
    }

    const bookBtn = document.getElementById('book-btn');
    const passengerFieldsContainer = document.getElementById('passenger-fields');
    const numPassengersInput = document.getElementById('num-passengers');

    const createPassengerFields = (numPassengers) => {
        passengerFieldsContainer.innerHTML = '';
        for (let i = 1; i <= numPassengers; i++) {
            const passengerDiv = document.createElement('div');
            passengerDiv.classList.add('passenger');

            passengerDiv.innerHTML = `
                <h3>Passenger ${i}</h3>
                <label for="passenger${i}-name">Full Name:</label>
                <input type="text" id="passenger${i}-name" name="passenger${i}-name" required>

                <label for="passenger${i}-passport">Passport Number:</label>
                <input type="text" id="passenger${i}-passport" name="passenger${i}-passport" required>
            `;
            passengerFieldsContainer.appendChild(passengerDiv);
        }
    };

    numPassengersInput.addEventListener('input', () => {
        const numPassengers = parseInt(numPassengersInput.value) || 1;
        createPassengerFields(numPassengers);
    });

    createPassengerFields(parseInt(numPassengersInput.value));


    bookBtn.addEventListener('click', () => {
        const numPassengers = parseInt(numPassengersInput.value);

        if (numPassengers < 1) {
            alert("Please enter a valid number of passengers.");
            return;
        }

        const bookingData = {
            flightId,
            flightName: flightName,
            origin: document.getElementById('origin').textContent,
            boardingDate: document.getElementById('boarding_date').textContent,
            boardingTime: document.getElementById('boarding_time').textContent,
            destination: document.getElementById('destination').textContent,
            arrivalDate: document.getElementById('arrival_date').textContent,
            arrivalTime: document.getElementById('arrival_time').textContent,
            numPassengers: numPassengers,
            imageUrl: urlParams.get('image_url')
        };

        const passengerData = [];
        for (let i = 1; i <= numPassengers; i++) {
            const name = document.getElementById(`passenger${i}-name`).value;
            const passport = document.getElementById(`passenger${i}-passport`).value;

            if (!name || !passport) {
                alert(`Please fill in the details for passenger ${i}`);
                return;
            }

            passengerData.push({ name, passport });
        }

        alert(`Booking ${numPassengers} passengers for flight ${flightName} to ${destination}`);
        localStorage.setItem('bookingData', JSON.stringify(bookingData));
        window.location.href = 'my-bookings.html';
    });
});
