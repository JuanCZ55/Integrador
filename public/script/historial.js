// Referencias a elementos del DOM para Alergias
const contenedorAlergias = document.getElementById("contenedor-alergias");
const btnAgregarAlergia = document.getElementById("btn-agregar-alergia");
const idHistorialAlergias = contenedorAlergias.dataset.idHistorial;
const existingAlergias =
  parseInt(contenedorAlergias.dataset.existingAlergias) || 0;
let alergiaIndex = existingAlergias;

// Referencias a elementos del DOM para Enfermedades
const contenedorEnfermedades = document.getElementById(
  "contenedor-enfermedades"
);
const btnAgregarEnfermedad = document.getElementById("btn-agregar-enfermedad");
const idHistorialEnfermedades = contenedorEnfermedades.dataset.idHistorial;
const existingEnfermedades =
  parseInt(contenedorEnfermedades.dataset.existingEnfermedades) || 0;
let enfermedadIndex = existingEnfermedades;

// Referencias para Medicación Actual
const contenedorMedicacion = document.getElementById("contenedor-medicacion");
const btnAgregarMedicacion = document.getElementById("btn-agregar-medicacion");
const idHistorialMedicacion = contenedorMedicacion.dataset.idHistorial;
const existingMedicacion =
  parseInt(contenedorMedicacion.dataset.existingMedicacion) || 0;
let medicacionIndex = existingMedicacion;

// Referencias para Cirugías Previas
const contenedorCirugias = document.getElementById("contenedor-cirugias");
const btnAgregarCirugia = document.getElementById("btn-agregar-cirugia");
const idHistorialCirugias = contenedorCirugias.dataset.idHistorial;
const existingCirugias =
  parseInt(contenedorCirugias.dataset.existingCirugias) || 0;
let cirugiaIndex = existingCirugias;

// Referencias para Antecedentes Familiares
const contenedorAntecedentes = document.getElementById(
  "contenedor-antecedentes"
);
const btnAgregarAntecedente = document.getElementById(
  "btn-agregar-antecedente"
);
const idHistorialAntecedentes = contenedorAntecedentes.dataset.idHistorial;
const existingAntecedentes =
  parseInt(contenedorAntecedentes.dataset.existingAntecedentes) || 0;
let antecedenteIndex = existingAntecedentes;

let contador = 0; // Contador para IDs únicos (no usado actualmente, pero reservado para futuras expansiones)

// Función para crear una tarjeta de alergia
function crearTarjetaAlergia(placeholder = "Ej: Alergia") {
  const div = document.createElement("div");
  div.className = "card flex-shrink-0 shadow-sm position-relative";
  div.style.width = "280px";
  div.style.borderRadius = "15px";

  div.innerHTML = `
    <button type="button" class="btn btn-outline-danger btn-sm position-absolute top-0 end-0 m-1" onclick="this.closest('.card').remove()">&times;</button>
    <div class="card-body">
      <input type="hidden" name="alergias[${alergiaIndex}][id_alergia]" value="0" />
      <input type="hidden" name="alergias[${alergiaIndex}][id_historial]" value="${idHistorialAlergias}" />

      <div class="mb-2">
        <label class="form-label fw-bold small">Tipo de Alergia *</label>
        <input type="text" class="form-control form-control-sm" name="alergias[${alergiaIndex}][tipo]" placeholder="${placeholder}" required />
      </div>

      <div class="mb-2">
        <label class="form-label small">Gravedad</label>
        <select class="form-select form-select-sm" name="alergias[${alergiaIndex}][gravedad]">
          <option value="Leve">Leve</option>
          <option value="Moderada">Moderada</option>
          <option value="Grave">Grave</option>
          <option value="Muy Grave">Muy Grave</option>
        </select>
      </div>

      <div class="mb-0">
        <label class="form-label small">Observaciones</label>
        <textarea class="form-control form-control-sm" name="alergias[${alergiaIndex}][observaciones]" rows="3" placeholder="Detalles extra..."></textarea>
      </div>
    </div>
  `;

  alergiaIndex++;
  return div;
}

// Función para crear una tarjeta de enfermedad
function crearTarjetaEnfermedad(placeholder = "Ej: Gripe") {
  const div = document.createElement("div");
  div.className = "card flex-shrink-0 shadow-sm position-relative";
  div.style.width = "280px";
  div.style.borderRadius = "15px";

  div.innerHTML = `
    <button type="button" class="btn btn-outline-danger btn-sm position-absolute top-0 end-0 m-1" onclick="this.closest('.card').remove()">&times;</button>
    <div class="card-body">
      <input type="hidden" name="enfermedades[${enfermedadIndex}][id_enfermedad]" value="0" />
      <input type="hidden" name="enfermedades[${enfermedadIndex}][id_historial]" value="${idHistorialEnfermedades}" />

      <div class="mb-2">
        <label class="form-label fw-bold small">Nombre de la Enfermedad *</label>
        <input type="text" class="form-control form-control-sm" name="enfermedades[${enfermedadIndex}][nombre]" placeholder="${placeholder}" required />
      </div>

      <div class="mb-2">
        <label class="form-label small">¿Es Crónica?</label>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" name="enfermedades[${enfermedadIndex}][cronica]" value="true" />
          <label class="form-check-label small">Sí</label>
        </div>
      </div>

      <div class="mb-2">
        <label class="form-label small">Fecha de Diagnóstico</label>
        <input type="date" class="form-control form-control-sm" name="enfermedades[${enfermedadIndex}][fecha_diagnostico]" required />
      </div>

      <div class="mb-0">
        <label class="form-label small">Observaciones</label>
        <textarea class="form-control form-control-sm" name="enfermedades[${enfermedadIndex}][observaciones]" rows="3" placeholder="Detalles extra..."></textarea>
      </div>
    </div>
  `;

  enfermedadIndex++;
  return div;
}

// Función para crear una tarjeta de medicación actual
function crearTarjetaMedicacion(placeholder = "Ej: Paracetamol") {
  const div = document.createElement("div");
  div.className = "card flex-shrink-0 shadow-sm position-relative";
  div.style.width = "280px";
  div.style.borderRadius = "15px";

  div.innerHTML = `
    <button type="button" class="btn btn-outline-danger btn-sm position-absolute top-0 end-0 m-1" onclick="this.closest('.card').remove()">&times;</button>
    <div class="card-body">
      <input type="hidden" name="medicacion[${medicacionIndex}][id_medicacion]" value="0" />
      <input type="hidden" name="medicacion[${medicacionIndex}][id_historial]" value="${idHistorialMedicacion}" />

      <div class="mb-2">
        <label class="form-label fw-bold small">Nombre del Medicamento *</label>
        <input type="text" class="form-control form-control-sm" name="medicacion[${medicacionIndex}][nombre]" placeholder="${placeholder}" required />
      </div>

      <div class="mb-2">
        <label class="form-label small">Dosis</label>
        <input type="text" class="form-control form-control-sm" name="medicacion[${medicacionIndex}][dosis]" placeholder="Ej: 500mg" required />
      </div>

      <div class="mb-2">
        <label class="form-label small">Frecuencia</label>
        <input type="text" class="form-control form-control-sm" name="medicacion[${medicacionIndex}][frecuencia]" placeholder="Ej: Cada 8 horas" required />
      </div>

      <div class="mb-0">
        <label class="form-label small">Observaciones</label>
        <textarea class="form-control form-control-sm" name="medicacion[${medicacionIndex}][observaciones]" rows="3" placeholder="Detalles extra..."></textarea>
      </div>
    </div>
  `;

  medicacionIndex++;
  return div;
}

// Función para crear una tarjeta de cirugía previa
function crearTarjetaCirugia(placeholder = "Ej: Apendicectomía") {
  const div = document.createElement("div");
  div.className = "card flex-shrink-0 shadow-sm position-relative";
  div.style.width = "280px";
  div.style.borderRadius = "15px";

  div.innerHTML = `
    <button type="button" class="btn btn-outline-danger btn-sm position-absolute top-0 end-0 m-1" onclick="this.closest('.card').remove()">&times;</button>
    <div class="card-body">
      <input type="hidden" name="cirugias[${cirugiaIndex}][id_cirugia]" value="0" />
      <input type="hidden" name="cirugias[${cirugiaIndex}][id_historial]" value="${idHistorialCirugias}" />

      <div class="mb-2">
        <label class="form-label fw-bold small">Nombre de la Cirugía *</label>
        <input type="text" class="form-control form-control-sm" name="cirugias[${cirugiaIndex}][nombre]" placeholder="${placeholder}" required />
      </div>

      <div class="mb-2">
        <label class="form-label small">Fecha</label>
        <input type="date" class="form-control form-control-sm" name="cirugias[${cirugiaIndex}][fecha]" required />
      </div>

      <div class="mb-0">
        <label class="form-label small">Observaciones</label>
        <textarea class="form-control form-control-sm" name="cirugias[${cirugiaIndex}][observaciones]" rows="3" placeholder="Detalles extra..."></textarea>
      </div>
    </div>
  `;

  cirugiaIndex++;
  return div;
}

// Función para crear una tarjeta de antecedente familiar
function crearTarjetaAntecedente(
  placeholderFamiliar = "Ej: Padre",
  placeholderEnfermedad = "Ej: Diabetes"
) {
  const div = document.createElement("div");
  div.className = "card flex-shrink-0 shadow-sm position-relative";
  div.style.width = "280px";
  div.style.borderRadius = "15px";

  div.innerHTML = `
    <button type="button" class="btn btn-outline-danger btn-sm position-absolute top-0 end-0 m-1" onclick="this.closest('.card').remove()">&times;</button>
    <div class="card-body">
      <input type="hidden" name="antecedentes[${antecedenteIndex}][id_antecedente]" value="0" />
      <input type="hidden" name="antecedentes[${antecedenteIndex}][id_historial]" value="${idHistorialAntecedentes}" />

      <div class="mb-2">
        <label class="form-label fw-bold small">Familiar *</label>
        <input type="text" class="form-control form-control-sm" name="antecedentes[${antecedenteIndex}][familiar]" placeholder="${placeholderFamiliar}" required />
      </div>

      <div class="mb-2">
        <label class="form-label fw-bold small">Enfermedad *</label>
        <input type="text" class="form-control form-control-sm" name="antecedentes[${antecedenteIndex}][enfermedad]" placeholder="${placeholderEnfermedad}" required />
      </div>

      <div class="mb-0">
        <label class="form-label small">Observaciones</label>
        <textarea class="form-control form-control-sm" name="antecedentes[${antecedenteIndex}][observaciones]" rows="3" placeholder="Detalles extra..."></textarea>
      </div>
    </div>
  `;

  antecedenteIndex++;
  return div;
}

// Eventos para agregar tarjetas
btnAgregarAlergia.addEventListener("click", () => {
  contenedorAlergias.appendChild(crearTarjetaAlergia());
  const noDataMsg = contenedorAlergias.querySelector(".text-muted");
  if (noDataMsg) noDataMsg.remove();
});

btnAgregarEnfermedad.addEventListener("click", () => {
  contenedorEnfermedades.appendChild(crearTarjetaEnfermedad());
  const noDataMsg = contenedorEnfermedades.querySelector(".text-muted");
  if (noDataMsg) noDataMsg.remove();
});

btnAgregarMedicacion.addEventListener("click", () => {
  contenedorMedicacion.appendChild(crearTarjetaMedicacion());
  const noDataMsg = contenedorMedicacion.querySelector(".text-muted");
  if (noDataMsg) noDataMsg.remove();
});

btnAgregarCirugia.addEventListener("click", () => {
  contenedorCirugias.appendChild(crearTarjetaCirugia());
  const noDataMsg = contenedorCirugias.querySelector(".text-muted");
  if (noDataMsg) noDataMsg.remove();
});

btnAgregarAntecedente.addEventListener("click", () => {
  contenedorAntecedentes.appendChild(crearTarjetaAntecedente());
  const noDataMsg = contenedorAntecedentes.querySelector(".text-muted");
  if (noDataMsg) noDataMsg.remove();
});
