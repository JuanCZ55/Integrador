async function obtenerHabitacionesLibres(id_sector, genero) {
  const response = await fetch(
    `/admision/api/habitaciones?id_sector=${id_sector}&genero=${genero}`
  );
  if (!response.ok) throw new Error("Error en la respuesta");
  return await response.json();
}

async function obtenerCamasLibres(id_habitacion) {
  const response = await fetch(
    `/admision/api/camas?id_habitacion=${id_habitacion}`
  );
  if (!response.ok) throw new Error("Error en la respuesta");
  return await response.json();
}

function selects(genero) {
  const sector = document.getElementById("selectSector");
  const habitacion = document.getElementById("selectHabitacion");
  const camas = document.getElementById("selectCama");
  sector.addEventListener("change", async function () {
    const sectorValor = sector.value;
    habitacion.innerHTML = "";
    camas.innerHTML = "";

    const array = await obtenerHabitacionesLibres(sectorValor, genero);
    array.forEach((a) => {
      const option = document.createElement("option");
      option.value = a.id_habitacion;
      option.text = a.numero + " " + a.sector.nombre;
      habitacion.appendChild(option);
    });

    if (habitacion.value) habitacion.dispatchEvent(new Event("change"));
  });

  habitacion.addEventListener("change", async function () {
    const habitacionValor = habitacion.value;
    camas.innerHTML = "";

    const array = await obtenerCamasLibres(habitacionValor);
    array.forEach((a) => {
      const option = document.createElement("option");
      option.value = a.id_cama;
      option.text = `Cama: ${a.n_cama}`;
      camas.appendChild(option);
    });
  });

  document.addEventListener("DOMContentLoaded", async () => {
    if (sector && sector.value) {
      sector.dispatchEvent(new Event("change"));
    }
  });
}
