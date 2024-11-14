const header = document.querySelector("header");
let activeItem = header.querySelector("button.active");

// active 제거 함수
export const removeActive = (el) => {
  if (el) {
    el.classList.remove("active");
  }
};

// active 추가 함수
export const addActive = (el) => {
  el.classList.add("active");
};

// class data 매칭
const pageLoad = (el) => {
  const pageData = el.getAttribute("data-page");
  window.location.href = `./${pageData}.html`;
  updateActive(t);
};

// active 업데이트 함수
const updateActive = (el) => {
  removeActive(activeItem); // 기존 active 제거
  addActive(el);
  activeItem = el; // activeItem 업데이트
};

header.addEventListener("click", (event) => {
  const t = event.target;
  if (t.tagName === "BUTTON") {
    pageLoad(t);
  }
});
