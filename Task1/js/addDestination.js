document.addEventListener('DOMContentLoaded', () => {
    const addDestinationForm = document.querySelector('form');
    let flightsData = JSON.parse(localStorage.getItem('flightsData')) || [];

    addDestinationForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const newDestination = {
            destinationCode: document.querySelector('[name="destination-code"]').value,
            destination: document.querySelector('[name="destination"]').value,
            airportName: document.querySelector('[name="airportName"]').value,
            airportWebsite: document.querySelector('[name="airportWebsite"]').value,
            imageUrl: document.querySelector('[name="image_url"]').value
        };

        flightsData.forEach(flight => {
            if (!flight.destination.includes(newDestination.destination)) {
                flight.destination = newDestination.destination;
            }
        });

        localStorage.setItem('flightsData', JSON.stringify(flightsData));

        alert('Destination added successfully!');

        window.location.href = 'manage-destinations.html';
    });
});
