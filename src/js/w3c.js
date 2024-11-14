const snbNav = document.querySelector(".snb");
const w3cArray = snbNav.querySelectorAll("li");
let activeItem = snbNav.querySelector("li.active");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

// active 제거 함수
const removeActive = () => {
  activeItem = snbNav.querySelector("li.active");
  if (activeItem) {
    activeItem.classList.remove("active");
  }
};

// 페이지 로드 함수
const pageLoad = (el) => {
  const pageData = el.getAttribute("data-page");
  const url = `./w3c/${pageData}.html`;
  loadComponent(".pattern", url);
};

// < 버튼 클릭 이벤트
prevBtn.addEventListener("click", () => {
  activeItem = snbNav.querySelector("li.active");
  if (activeItem && activeItem.previousElementSibling) {
    const prevEl = activeItem.previousElementSibling;
    console.log(prevEl);
    updateActive(prevEl);
  } else {
    console.log("이놈이 첫번째야");
  }
});

// > 버튼 클릭 이벤트
nextBtn.addEventListener("click", () => {
  activeItem = snbNav.querySelector("li.active");
  if (activeItem && activeItem.nextElementSibling) {
    const nextEl = activeItem.nextElementSibling;
    updateActive(nextEl);
  } else {
    console.log("이놈이 제일 마지막임");
  }
});

// w3c.html 내용을 태그에 삽입
function loadComponent(tag, path) {
  const target = document.querySelector(tag);
  if (!target) {
    console.error(`Selector ${tag} not found.`);
    return;
  }
  return fetch(path)
    .then((response) => response.text())
    .then((data) => {
      target.innerHTML = data;
    })
    .catch((error) => console.error("Failed to load component:", error));
}

// active 업데이트 함수
const updateActive = (el) => {
  removeActive(); // 기존 active 제거
  el.classList.add("active"); // 새 active 추가
  pageLoad(el); // 페이지 로드
};

// snb 클릭했을 때 active 추가
snbNav.addEventListener("click", (event) => {
  const t = event.target;
  if (t.tagName === "LI") {
    updateActive(t);
  }
});
