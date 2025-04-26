export function controlPaciente(req, res) {
  const { nombre, apellido, dni, fecha_nacimiento, telefono } = req.body;
  let errores = [];
  const regexName = /^[a-zA-Z\s]+$/;
  const regexDni = /^\d{7,8}$/;
  let bandera = false;
  if (!nombre || !apellido || !dni || !fecha_nacimiento || !telefono) {
    return res.status(400).json({ error: "Faltan datos" });
  }
  if (nombre.length < 3) {
    errores.push("El nombre debe tener al menos 3 caracteres");
  }
  if (apellido.length < 3) {
    errores.push("El apellido debe tener al menos 3 caracteres");
  }

  if (!regexName.test(nombre + apellido)) {
    errores.push("El nombre y apellido solo pueden contener letras y espacios");
  }
  if (!regexDni.test(dni)) {
    errores.push("El DNI debe tener entre 7 y 8 dígitos");
  }
  if (bandera) {
    return res.status(400).json({ error: errores });
  }
  return res.status(200).json({ message: "Paciente guardado correctamente" });

}