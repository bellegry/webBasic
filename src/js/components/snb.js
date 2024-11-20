import { addActive, removeActive, loadComponent } from "../layout.js";

const snbNav = document.querySelector(".snb");
// nodelist아니고 array로 변환해서 사용
let activeItem = snbNav.querySelector("li.active");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

// active 업데이트 함수
const updateActive = (el) => {
  removeActive(activeItem); // 기존 active 제거
  addActive(el);
  activeItem = el; // activeItem 업데이트
  console.log(el.getAttribute("data-page"));
  loadComponent(`${el.getAttribute("data-page")}`, `.patterns`); // 페이지 로드
};

// snb 클릭했을 때 active 추가
snbNav.addEventListener("click", (event) => {
  const t = event.target;
  if (t.tagName === "LI") {
    updateActive(t);
  }
});

// < 버튼 클릭 이벤트
prevBtn.addEventListener("click", () => {
  if (activeItem && activeItem.previousElementSibling) {
    const prevEl = activeItem.previousElementSibling;
    updateActive(prevEl);
  } else {
    console.log("이놈이 첫번째임");
    const prevEl = activeItem.parentElement.lastElementChild;
    updateActive(prevEl);
  }
});

// > 버튼 클릭 이벤트
nextBtn.addEventListener("click", () => {
  if (activeItem && activeItem.nextElementSibling) {
    const nextEl = activeItem.nextElementSibling;
    updateActive(nextEl);
  } else {
    console.log("이놈이 마지막임");
    const prevEl = activeItem.parentElement.firstElementChild;
    updateActive(prevEl);
  }
});

// scroll fixed
window.addEventListener("scroll", () => {
  console.log(window.scrollY);
  const header = document.querySelector("header");
  const snb = document.querySelector(".snb");
  const snbDisplay = window.getComputedStyle(snb).display;
  if (snbDisplay === "none") {
    if (window.scrollY > 0) {
      header.classList.add("fixed");
    } else {
      header.classList.remove("fixed");
    }
  } else {
    if (window.scrollY > 0) {
      header.classList.add("fixed");
      snb.classList.add("fixed");
      snb.style.top = "70px";
    } else {
      header.classList.remove("fixed");
      snb.classList.remove("fixed");
      snb.style.top = "0";
    }
  }
});
