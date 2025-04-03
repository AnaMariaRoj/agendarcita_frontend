document.getElementById("appointmentForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const identifierValue = document.getElementById("identifierValue").value;
    const specialty = document.getElementById("specialty").value;
    const day = document.getElementById("day").value;
    const startTime = document.getElementById("startTime").value;

    const startDateTime = `${day}T${startTime}:00Z`;

    const appointment = {
        resourceType: "Appointment",
        identifier: [  // <-- Ahora es una lista
            {
                system: "https://hospital.com/appointments",
                value: crypto.randomUUID()
            }
        ],
        status: "booked",
        participant: [
            {
                actor: {
                    reference: `Patient/${identifierValue}`,
                    display: name
                },
                status: "accepted"
            }
        ],
        start: startDateTime
    };

    try {
        const response = await fetch("https://agendarcita-backend.onrender.com/appointment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(appointment)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${result.detail}`);
        }

        alert("Cita agendada con éxito. ID: " + result._id);
    } catch (error) {
        console.error("Error al agendar la cita:", error);
        alert("Error al agendar la cita: " + error.message);
    }
});






