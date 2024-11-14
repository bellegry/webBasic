// active 함수 불러오기
import { removeActive, addActive } from "./active.js";

const snbNav = document.querySelector(".snb");
// nodelist아니고 array로 변환해서 사용
const w3cArray = Array.from(snbNav.querySelectorAll("li"));
let activeItem = snbNav.querySelector("li.active");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

// 페이지 로드 함수
const pageLoad = (el) => {
  const pageData = el.getAttribute("data-page");
  const url = `./w3c/${pageData}.html`;
  loadComponent(".pattern", url);
};

// < 버튼 클릭 이벤트
prevBtn.addEventListener("click", () => {
  if (activeItem && activeItem.previousElementSibling) {
    const prevEl = activeItem.previousElementSibling;
    updateActive(prevEl);
  } else {
    console.log("이놈이 첫번째임");
  }
});

// > 버튼 클릭 이벤트
nextBtn.addEventListener("click", () => {
  if (activeItem && activeItem.nextElementSibling) {
    const nextEl = activeItem.nextElementSibling;
    updateActive(nextEl);
  } else {
    console.log("이놈이 마지막임");
  }
});

// w3c.html 내용을 태그에 삽입
async function loadComponent(tag, path) {
  try {
    // 지정된 tag에 해당하는 요소를 찾음
    const target = document.querySelector(tag);
    if (!target) {
      throw new Error(`Selector ${tag} not found.`);
    }
    // fetch 요청을 보내고 응답을 텍스트로 변환
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${path}: ${response.statusText}`);
    }
    const data = await response.text();
    // target 요소의 innerHTML에 데이터 삽입
    target.innerHTML = data;
  } catch (error) {
    // 에러 발생 시 콘솔에 에러 메시지 출력
    console.error("Error loading component:", error);
  }
}

// active 업데이트 함수
const updateActive = (el) => {
  removeActive(activeItem); // 기존 active 제거
  addActive(el);
  activeItem = el; // activeItem 업데이트
  pageLoad(el); // 페이지 로드
};

// snb 클릭했을 때 active 추가
snbNav.addEventListener("click", (event) => {
  const t = event.target;
  if (t.tagName === "LI") {
    updateActive(t);
  }
});
