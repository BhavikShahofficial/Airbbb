(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();

// lower nav
document.addEventListener("DOMContentLoaded", () => {
  const taxSwitch = document.getElementById("flexSwitchCheckDefault");

  if (taxSwitch) {
    taxSwitch.addEventListener("click", () => {
      const taxToggle = document.getElementsByClassName("tax-info");

      // Toggle display for each element
      for (let info of taxToggle) {
        info.style.display =
          info.style.display === "inline" ? "none" : "inline";
      }
    });
  } else {
    console.error("Tax switch element not found!");
  }
});
