// // header load
// fetch("./components/header.html")
//   .then((response) => response.text())
//   .then((data) => (document.getElementById("header").innerHTML = data));

// // footer load
// fetch("./components/footer.html")
//   .then((response) => response.text())
//   .then((data) => (document.getElementById("footer").innerHTML = data));

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
  // 모든 컴포넌트 로드 후 CSS가 제대로 적용될 수 있도록 콜백 처리
  applyCSS();
});

// CSS 재적용 함수
function applyCSS() {
  // 필요시 스타일을 재적용하거나 추가 작업을 수행할 수 있습니다.
  console.log("헤더와 푸터가 로드 완료되었고, CSS가 적용되었습니다.");
}
