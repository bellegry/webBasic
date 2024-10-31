// header load
fetch("./components/header.html")
  .then((response) => response.text())
  .then((data) => (document.getElementById("header").innerHTML = data));

// footer load
fetch("./components/footer.html")
  .then((response) => response.text())
  .then((data) => (document.getElementById("footer").innerHTML = data));
