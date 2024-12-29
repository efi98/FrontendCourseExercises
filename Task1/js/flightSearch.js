import { flightsData } from './flightsData.js';

document.addEventListener('DOMContentLoaded', () => {
    const originSelect = document.getElementById("origin");
    const destinationSelect = document.getElementById("destination");
    const flightsTableBody = document.getElementById("flightsTableBody");
    const uniqueOrigins = [...new Set(flightsData.map(flight => flight.origin))];
    const uniqueDestinations = [...new Set(flightsData.map(flight => flight.destination))];

    uniqueOrigins.forEach(origin => {
        const option = document.createElement("option");
        option.value = origin;
        option.textContent = origin;
        originSelect.appendChild(option);
    });

    uniqueDestinations.forEach(destination => {
        const option = document.createElement("option");
        option.value = destination;
        option.textContent = destination;
        destinationSelect.appendChild(option);
    });

    const flightSearchForm = document.getElementById("flight-search-form");
    flightSearchForm.addEventListener('submit', (e) => {
        e.preventDefault();
    
        const selectedOrigin = originSelect.value;
        const selectedDestination = destinationSelect.value;
        const filteredFlights = flightsData.filter(flight =>
            flight.origin === selectedOrigin && flight.destination === selectedDestination
        );

        flightsTableBody.innerHTML = '';
        if (filteredFlights.length === 0) {
            flightsTableBody.innerHTML = `<tr><td colspan="7">No flights found</td></tr>`;
        } else {
            filteredFlights.forEach(flight => {
                const row = flightsTableBody.insertRow();
                row.innerHTML = `
                    <td>${flight.flight_name}</td>
                    <td>${flight.origin}</td>
                    <td>${flight.destination}</td>
                    <td>${flight.boarding_time}</td>
                    <td>${flight.boarding_date}</td>
                    <td>${flight.arrival_time}</td>
                    <td>${flight.arrival_date}</td>
                    <td>${flight.airportName}</td>
                    <td><a href="${flight.airportWebsite}" target="_blank">${flight.airportWebsite}</a></td>
                    <td>
                        <a href="book-flight.html?flight_id=${flight.flight_id}&flight_name=${flight.flight_name}&origin=${flight.origin}&destination=${flight.destination}&boarding_date=${flight.boarding_date}&boarding_time=${flight.boarding_time}&arrival_date=${flight.arrival_date}&arrival_time=${flight.arrival_time}&airport_name=${flight.airportName}&airport_website=${flight.airportWebsite}&image_url=${encodeURIComponent(flight.image_url)}">
                            Book
                        </a>
                    </td>
                `;

            });
        }
    });

});
