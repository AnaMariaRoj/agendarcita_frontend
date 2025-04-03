document.getElementById('appointmentForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const identifierValue = document.getElementById('identifierValue').value;
    const specialtyCode = document.getElementById('specialty').value;
    const specialtyText = document.getElementById('specialty').options[document.getElementById('specialty').selectedIndex].text;
    const day = document.getElementById('day').value;
    const startTime = document.getElementById('startTime').value;
    const doctorId = document.getElementById('doctorId').value; // Asegúrate de tener un campo para seleccionar el médico

    let [hours, minutes] = startTime.split(':').map(Number);
    let endMinutes = minutes + 40;
    let endHours = hours;
    if (endMinutes >= 60) {
        endMinutes -= 60;
        endHours += 1;
    }

    const startDateTime = `${day}T${startTime}:00Z`;
    const endDateTime = `${day}T${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}:00Z`;

    const appointment = {
        resourceType: "Appointment",
        identifier: [
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
            },
            {
                actor: {
                    reference: `Practitioner/${doctorId}`, // Se agrega el médico
                    display: "Dr. Nombre Médico"
                },
                status: "accepted"
            }
        ],
        specialty: [
            {
                coding: [
                    {
                        system: "http://snomed.info/sct",
                        code: specialtyCode,
                        display: specialtyText
                    }
                ]
            }
        ],
        serviceType: [
            {
                coding: [
                    {
                        system: "http://terminology.hl7.org/CodeSystem/service-type",
                        code: "57",
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
                        code: "162673000",
                        display: "Consulta médica"
                    }
                ]
            }
        ],
        start: startDateTime,
        end: endDateTime
    };

    console.log("Cita a enviar:", JSON.stringify(appointment, null, 2));

    fetch('https://agendarcita-backend.onrender.com/appointment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(appointment)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Appointment creado:', data);
        return fetch('https://agendarcita-backend.onrender.com/slot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                resourceType: "Slot",
                schedule: {
                    reference: `Schedule/${doctorId}`
                },
                status: "busy",
                start: startDateTime,
                end: endDateTime
            })
        });
    })
    .then(response => response.json())
    .then(data => {
        console.log('Slot creado:', data);
        alert('Cita médica registrada exitosamente!');
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Hubo un error al registrar la cita.');
    });
});



