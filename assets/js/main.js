document.querySelectorAll('.js-current-year').forEach((el) => {
    el.textContent = String(new Date().getFullYear());
});
