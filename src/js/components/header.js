// URL에서 파일명을 추출하는 함수
function getPath() {
  const path = window.location.pathname; // 전체 경로 추출
  const fileName = path.substring(path.lastIndexOf("/") + 1); // 경로에서 마지막 부분 추출
  return fileName.split(".").slice(0, -1).join("."); // 확장자 제거
}

const currentFileName = getPath();
console.log(currentFileName);

// MutationObserver를 사용하여 header 내에서 동적으로 요소를 감지하고 active 추가
document.addEventListener("DOMContentLoaded", () => {
  const head = document.querySelector("header");

  // MutationObserver 설정
  const observer = new MutationObserver((mutationsList, observer) => {
    const className = head.querySelector(`.${currentFileName}`); // currentFileName 클래스 선택
    console.log(className);
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
