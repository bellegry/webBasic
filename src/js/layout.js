// header와 footer를 로드하는 함수
function loadComponent(tag, path) {
  return fetch(path)
    .then((response) => response.text())
    .then((data) => {
      document.querySelector(tag).innerHTML = data;
    });
}

// JavaScript 파일을 동적으로 로드하는 함수
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.type = "module";
    script.onload = () => resolve(src);
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.body.appendChild(script);
  });
}

// header와 footer를 모두 로드한 후에 JavaScript 파일을 순차적으로 로드
Promise.all([
  loadComponent("header", "./components/header.html"),
  loadComponent("footer", "./components/footer.html"),
  loadComponent(".snb", "./components/snb.html"),
])
  .then(() => {
    // 모든 컴포넌트가 로드된 후 필요한 JavaScript 파일을 로드
    return loadScript("../js/active.js");
  })
  .then(() => {
    // `active.js`가 로드된 후 `w3c.js`를 로드
    return loadScript("../js/w3c.js");
  })
  .then(() => {
    console.log("All scripts loaded successfully.");
  })
  .catch((error) => {
    console.error("Error loading components or scripts:", error);
  });

// URL에서 파일명을 추출하는 함수
function getPath() {
  const path = window.location.pathname; // 전체 경로 추출
  const fileName = path.substring(path.lastIndexOf("/") + 1); // 경로에서 마지막 부분 추출
  return fileName.split(".").slice(0, -1).join("."); // 확장자 제거
}

const currentFileName = getPath();

// MutationObserver를 사용하여 header 내에서 동적으로 요소를 감지하고 active 추가
document.addEventListener("DOMContentLoaded", () => {
  const head = document.querySelector("header");

  // MutationObserver 설정
  const observer = new MutationObserver((mutationsList, observer) => {
    const className = head.querySelector(`.${currentFileName}`); // currentFileName 클래스 선택
    if (className) {
      className.classList.add("active"); // .active 클래스 추가
      observer.disconnect(); // 원하는 요소를 찾았으므로 감시 중지
    }
    console.log("현재 파일명:", className);
  });

  // header 내의 변화를 감지
  observer.observe(head, { childList: true, subtree: true });

  console.log("로드됨");
});
