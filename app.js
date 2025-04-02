document.getElementById('appointmentForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Obtener los valores del formulario
    const name = document.getElementById('name').value;
    const identifierValue = document.getElementById('identifierValue').value;
    const specialty = document.getElementById('specialty').value;
    const day = document.getElementById('day').value;
    const startTime = document.getElementById('startTime').value;

    // Convertir la hora de inicio a un objeto Date
    let [hours, minutes] = startTime.split(':').map(Number);
    let endMinutes = minutes + 40;
    let endHours = hours;

    if (endMinutes >= 60) {
        endMinutes -= 60;
        endHours += 1;
    }

    // Formatear la hora de finalización
    const endTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;

    // Crear el objeto Appointment en formato FHIR
    const appointment = {
        resourceType: "Appointment",
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
        specialty: [
            {
                text: specialty
            }
        ],
        start: `${day} ${startTime}`,
        end: `${day} ${endTime}`
    };

    // Enviar los datos usando Fetch API
    fetch('https://agendarcita-backend.onrender.com/appointment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(appointment)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        alert('Cita médica registrada exitosamente!');
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Hubo un error al registrar la cita.');
    });
});
