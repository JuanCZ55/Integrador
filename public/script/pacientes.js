document.addEventListener("DOMContentLoaded", () => {
  const dniInput = document.getElementById("dni");
  const idPersonaInput = document.getElementById("id_persona");
  const alertContainer = document.querySelector(".w-75.container");
  const btnBuscar = document.getElementById("btnBuscar");
  const emergenciaCheckbox = document.getElementById("emergencia");

  async function buscarPaciente(dni) {
    if (!dni) return;
    try {
      const url = `/admision/api/busqueda?dni=${dni}`;
      const res = await fetch(url);
      if (!res.ok) {
        const errorData = await res.json();
        alertContainer.innerHTML = `
          <div class="alert alert-danger" role="alert">
            ${errorData.mensaje || errorData.error || "Paciente no encontrado"}
          </div>`;
        btnBuscar.classList.remove("btn-success");
        btnBuscar.classList.add("btn-danger");
        return;
      }
      const data = await res.json();
      cargarFormulario(data.paciente);
      alertContainer.innerHTML = "";
      btnBuscar.classList.remove("btn-danger");
      btnBuscar.classList.add("btn-success");
    } catch (e) {
      alertContainer.innerHTML = `
        <div class="alert alert-danger" role="alert">
          Error al conectar con el servidor
        </div>`;
      limpiarFormulario();
      btnBuscar.classList.remove("btn-success");
      btnBuscar.classList.add("btn-danger");
    }
  }

  function cargarFormulario(paciente) {
    if (!paciente) return limpiarFormulario();

    if (idPersonaInput) {
      idPersonaInput.value = paciente.id_persona || "";
    }
    dniInput.value = paciente.dni || "";
    document.getElementById("nombre").value = paciente.nombre || "";
    document.getElementById("apellido").value = paciente.apellido || "";
    document.getElementById("f_nacimiento").value = paciente.f_nacimiento || "";
    document.getElementById("genero").value = paciente.genero || "";
    document.getElementById("direccion").value = paciente.direccion || "";
    document.getElementById("telefono").value = paciente.telefono || "";
    document.getElementById("contacto").value = paciente.contacto || "";
    document.getElementById("mail").value = paciente.mail || "";
    document.getElementById("id_obra_social").value =
      paciente.id_obra_social || "";
    document.getElementById("cod_os").value = paciente.cod_os || "";
    document.getElementById("detalle").value = paciente.detalle || "";

    if (emergenciaCheckbox) emergenciaCheckbox.checked = false;
  }

  function limpiarFormulario() {
    if (idPersonaInput) {
      idPersonaInput.value = "";
    }
    dniInput.value = "";
    document.getElementById("nombre").value = "";
    document.getElementById("apellido").value = "";
    document.getElementById("f_nacimiento").value = "";
    document.getElementById("genero").value = "";
    document.getElementById("direccion").value = "";
    document.getElementById("telefono").value = "";
    document.getElementById("contacto").value = "";
    document.getElementById("mail").value = "";
    document.getElementById("id_obra_social").value = "";
    document.getElementById("cod_os").value = "";
    document.getElementById("detalle").value = "";
    if (emergenciaCheckbox) emergenciaCheckbox.checked = false;
  }

  btnBuscar.addEventListener("click", () => {
    const dni = dniInput.value.trim();
    if (!dni) {
      alertContainer.innerHTML = `
        <div class="alert alert-warning" role="alert">
          Por favor ingresa un DNI para buscar.
        </div>`;
      return;
    }
    buscarPaciente(dni);
  });
});
