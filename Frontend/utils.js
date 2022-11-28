export const getFormFields = (idFields) => {
  const form = {};
  const formFields = document.querySelectorAll(idFields);
  const isNum = (field) => field.getAttribute("type") == "number";

  for (let field of formFields) {
    if (isNum(field)) {
      form[field.getAttribute("id")] = field.value * 1;
    } else {
      form[field.getAttribute("id")] = field.value;
    }
  }

  return form;
};

export const $ = document.querySelector.bind(document);

export const spinner = document.getElementById("spinner");
export const spinnerBg = document.getElementById("spinner-bg");

export function notification({ title, icon }) {
  Swal.fire({
    position: "center",
    icon,
    title,
    showConfirmButton: false,
    timer: 5000,
  });
}

export function showSpinner() {
  spinner.className = "show";
  spinnerBg.className = "show";
  setTimeout(() => {
    spinner.className = spinner.className.replace("show", "");
    spinnerBg.className = spinnerBg.className.replace("show", "");
  }, 7000);
}

export function hideSpinner() {
  spinner.className = spinner.className.replace("show", "");
  spinnerBg.className = spinnerBg.className.replace("show", "");
}

export function refreshPage() {
	setTimeout(() => {
		window.location.reload()
	},1500)
}
