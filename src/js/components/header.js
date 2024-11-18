import { addActive } from "../layout.js";

// URL에서 파일명을 추출하는 함수
function getPath() {
  const path = window.location.pathname; // 전체 경로 추출
  const fileName = path.substring(path.lastIndexOf("/") + 1); // 경로에서 마지막 부분 추출
  return fileName.split(".").slice(0, -1).join("."); // 확장자 제거
}

const currentFileName = getPath();
console.log(currentFileName);

// setTimeout으로 header nav에 active
const headNav = document.querySelector("header nav");

function checkForElement() {
  const className = headNav.querySelector(`.${currentFileName}`); // currentFileName 클래스 선택
  console.log(className);
  if (className) {
    addActive(className); // .active 클래스 추가
    console.log("현재 파일명:", className);
  } else {
    // 아직 해당 요소가 없으면 다시 시도
    console.log("요소를 찾지 못했습니다. 다시 시도합니다.");
    setTimeout(checkForElement, 100); // 100ms 후에 다시 확인
  }
}

// DOM 로드 후 처음 확인
checkForElement();
