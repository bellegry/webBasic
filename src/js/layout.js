// header와 footer를 로드하는 함수
function loadComponent(tag, path) {
  return fetch(path)
    .then((response) => response.text())
    .then((data) => {
      document.querySelector(tag).innerHTML = data;
    });
}

// header와 footer를 모두 로드한 후 CSS가 적용되도록 처리
Promise.all([
  loadComponent("header", "./components/header.html"),
  loadComponent("footer", "./components/footer.html"),
  loadComponent(".snb", "./components/snb.html"),
]).then(() => {
  // 모든 컴포넌트가 로드된 후 w3c.js를 동적으로 추가
  const script = document.createElement("script");
  script.type = "module";
  script.src = "../js/w3c.js";
  document.body.appendChild(script);
});
