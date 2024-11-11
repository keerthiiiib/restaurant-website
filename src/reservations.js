export function setupReservationButton() {
    const reserveButton = document.getElementById("reserveBtn");
    reserveButton.addEventListener("click", async () => {
        const contact = prompt("Please enter your contact number:");

        if (contact) {
            try {
                const response = await fetch(`http://localhost:3000/reservations/${contact}`);
                const result = await response.json();

                const contentDiv = document.getElementById("content");

                if (response.ok) {
                    const reservationDetails = `
                        <div>
                            <h2>Reservation Details</h2>
                            <p>Name: ${result.name}</p>
                            <p>Contact: ${result.contact}</p>
                            <p>Date: ${result.date}</p>
                            <p>Seats: ${result.seats}</p>
                        </div>
                    `;
                    contentDiv.innerHTML = reservationDetails;
                } else {
                    contentDiv.innerHTML = `<p>${result.error}</p>`;
                }
            } catch (error) {
                console.error("Fetch error:", error);
                const contentDiv = document.getElementById("content");
                contentDiv.innerHTML = `<p>An error occurred: ${error.message}</p>`;
            }
        }
    });
}