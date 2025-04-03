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

    // Formatear la hora de finalización en formato ISO 8601
    const startDateTime = `${day}T${startTime}:00Z`;  // UTC
    const endDateTime = `${day}T${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}:00Z`;

    // Crear el objeto Appointment en formato FHIR
    const appointment = {
        resourceType: "Appointment",
        id: crypto.randomUUID(), // Generar un identificador único
        identifier: [
            {
                system: "https://hospital.com/appointments",
                value: crypto.randomUUID() // Otro ID único para la cita
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
        specialty: [
            {
                coding: [
                    {
                        system: "http://snomed.info/sct",
                        code: "394579002",  // Código para "Cardiología" (ejemplo)
                        display: specialty
                    }
                ]
            }
        ],
        serviceType: [
            {
                coding: [
                    {
                        system: "http://terminology.hl7.org/CodeSystem/service-type",
                        code: "57", // "General Practice"
                        display: "Consulta médica general"
                    }
                ]
            }
        ],
        reasonCode: [
            {
                coding: [
                    {
                        system: "http://snomed.info/sct",
                        code: "162673000", // "General examination"
                        display: "Consulta médica"
                    }
                ]
            }
        ],
        start: startDateTime,
        end: endDateTime
    };

    // Enviar los datos usando Fetch API
    fetch('https://agendarcita-backend.onrender.com/appointments', {
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

