async function listenerTurno(fecha) {
  try {
    const response = await fetch(`http://localhost:3000/api/turno/${fecha}`);
    if (!response.ok) throw new Error("Fallo en la respuesta");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

document.getElementById("fecha").addEventListener("change", async (event) => {
  const fecha = event.target.value;
  const horarios = await listenerTurno(fecha);

  const horarioSelect = document.getElementById("horario");
  horarioSelect.innerHTML = "";

  horarios.forEach((horario) => {
    const option = document.createElement("option");
    option.value = horario;
    option.textContent = horario;
    horarioSelect.appendChild(option);
  });
});
