document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('appointmentForm').addEventListener('submit', function(event) {
        event.preventDefault();

        // Obtener los valores del formulario
        const name = document.getElementById('name').value;
        const identifierValue = document.getElementById('identifierValue').value;
        const specialtyCode = document.getElementById('specialty').value;
        const specialtyText = document.getElementById('specialty').options[document.getElementById('specialty').selectedIndex].text;
        const day = document.getElementById('day').value;
        const startTime = document.getElementById('startTime').value;

        // Validar que no haya campos vacíos
        if (!name || !identifierValue || !specialtyCode || !day || !startTime) {
            showMessage("Por favor, complete todos los campos.", "error");
            return;
        }

        // Convertir la hora de inicio y calcular la hora de finalización
        let [hours, minutes] = startTime.split(':').map(Number);
        let endMinutes = minutes + 40;
        let endHours = hours;

        if (endMinutes >= 60) {
            endMinutes -= 60;
            endHours += 1;
        }

        // Formatear fecha y hora en formato ISO 8601
        const startDateTime = `${day}T${startTime}:00Z`;
        const endDateTime = `${day}T${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}:00Z`;

        // Crear el objeto Appointment en formato FHIR
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

        // Mostrar en consola para verificar antes de enviar
        console.log("Cita a enviar:", JSON.stringify(appointment, null, 2));

        // Deshabilitar botón mientras se procesa la solicitud
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.disabled = true;

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
            showMessage('Cita médica registrada exitosamente!', "success");
        })
        .catch((error) => {
            console.error('Error:', error);
            showMessage('Hubo un error al registrar la cita.', "error");
        })
        .finally(() => {
            submitBtn.disabled = false; // Habilitar botón después del proceso
        });
    });

    // Función para mostrar mensajes de error o éxito
    function showMessage(message, type) {
        const messageDiv = document.getElementById('message');
        messageDiv.innerText = message;
        messageDiv.style.display = "block";
        messageDiv.style.color = type === "error" ? "red" : "green";
    }
});




