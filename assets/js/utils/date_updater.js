function updateDateYear() {
  const currentYear = new Date().getFullYear();

  const copyrightElement = document.querySelector(".footer__year");

  if (copyrightElement) {
    copyrightElement.textContent = `Aniwa ${currentYear},`;
  }
}

export default updateDateYear;
