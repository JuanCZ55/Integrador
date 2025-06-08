document.addEventListener("DOMContentLoaded", () => {
  const selectObraSocial = document.getElementById("id_obra_social");
  const inputCodOS = document.getElementById("cod_os");

  if (!selectObraSocial || !inputCodOS) return;

  function toggleCodOS() {
    if (selectObraSocial.value === "1") {
      inputCodOS.disabled = true;
      inputCodOS.value = "";
    } else {
      inputCodOS.disabled = false;
    }
  }

  toggleCodOS();

  selectObraSocial.addEventListener("change", toggleCodOS);
});
