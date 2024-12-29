document.addEventListener('DOMContentLoaded', () => {
    const flightsTableBody = document.querySelector("#flightsTableTbody");
    const flightsData = JSON.parse(localStorage.getItem('flightsData')) || []; 

    if (flightsData.length === 0) {
        console.error("No flights data found!");
        return;
    }

    flightsData.forEach(flight => {
        const row = flightsTableBody.insertRow();
        row.innerHTML = `
            <td>${flight.flight_name}</td>
            <td>${flight.origin}</td>
            <td>${flight.destination}</td>
            <td>${flight.boarding_date}</td>
            <td>${flight.boarding_time}</td>
            <td>${flight.arrival_date}</td>
            <td>${flight.arrival_time}</td>
        `;
    });
});
