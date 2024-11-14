// 현재 파일명을 변수에 저장
const head = document.querySelector("header");

// URL에서 파일명을 추출하는 함수
function getPath() {
  const path = window.location.pathname; // 전체 경로 추출
  const fileName = path.substring(path.lastIndexOf("/") + 1); // 경로에서 마지막 부분 추출
  return fileName.split(".").slice(0, -1).join("."); // 확장자 제거;
}

document.addEventListener("DOMContentLoaded", () => {
  const currentFileName = getPath();
  const className = head.querySelector(`.${currentFileName}`);
  const findClass = () => {
    className.classList.add("active");
  };
  console.log("현재 파일명:", currentFileName);
  console.log("현재 파일명:", className);
  console.log("about.js 로드됨");
});
