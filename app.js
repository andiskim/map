function errorHandling() {
  alert("Google MAPS API failed");
}

menu.addEventListener('click', function(e) {
  drawer.classList.toggle('open');
  e.stopPropagation();
});
