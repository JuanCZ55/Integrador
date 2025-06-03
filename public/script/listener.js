function button(idBoton, action, metodo) {
  const button = document.getElementById(idBoton);
  if (!button) {
    return console.error("el boton no existe o esta mal escrito: " + idBoton);
  }
  button.addEventListener("click", function () {
    const form = this.form;

    form.action = action;
    form.method = metodo;
    form.submit();
  });
}
button(
  "id_persona",
  `/admision/gestionarPaciente?id_persona=${
    document.getElementById(id_persona).value
  }`,
  "GET"
);
button(
  "dni",
  `/admision/gestionarPaciente?dni=${document.getElementById(dni).value}`,
  "GET"
);
button("modificar", "/admision/gestionarPaciente", "POST");
button("crear", "/admision/gestionarPaciente", "POST");
