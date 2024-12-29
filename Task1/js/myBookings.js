document.addEventListener('DOMContentLoaded', () => {
    const bookingData = JSON.parse(localStorage.getItem('bookingData'));

    if (bookingData) {
        const tableBody = document.getElementById('bookings-table-body');
        const row = tableBody.insertRow();
        
        const imageCell = row.insertCell(0);
        const image = document.createElement('img');
        image.src = bookingData.imageUrl;
        image.alt = bookingData.destination;
        image.width = 100;
        image.height = 100;
        imageCell.appendChild(image);

        const flightDetailsCell = row.insertCell(1);
        flightDetailsCell.innerHTML = `
            <p><strong>Origin:</strong> ${bookingData.origin} <strong> Boarding:</strong> ${bookingData.boardingDate} ${bookingData.boardingTime}</p>
            <p><strong>Destination:</strong> ${bookingData.destination} <strong> Landing:</strong> ${bookingData.arrivalDate} ${bookingData.arrivalTime}</p>
        `;
    } else {
        alert("No booking data found.");
    }
});
