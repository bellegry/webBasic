import { resources } from "../js/components/resources.js";

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

// toggle 추가 함수
export const toggleActive = (el) => {
  el.classList.toggle("active");
};

// HTML을 로드하고 DOM에 삽입하는 함수
async function loadHTML(url, selector) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTML 로드 실패: ${url}`);
    }
    const html = await response.text();
    document.querySelector(selector).innerHTML = html;
    console.log("HTML 로드 및 DOM 삽입 완료:", url);
  } catch (error) {
    console.error(error);
  }
}

// 기존 동적으로 로드된 스크립트를 제거하는 함수
function removeDynamicScript() {
  const dynamicScript = document.getElementById("dynamic-script");
  if (dynamicScript) {
    console.log("기존 스크립트 제거:", dynamicScript.src);
    dynamicScript.remove();
  }
}

// JavaScript 파일을 로드하는 함수
function loadScript(src) {
  return new Promise((resolve, reject) => {
    removeDynamicScript(); // 기존 동적 스크립트 제거

    const script = document.createElement("script");
    script.id = "dynamic-script"; // 동적 스크립트의 고유 ID
    script.src = `${src}?t=${Date.now()}`; // 캐시 방지
    script.type = "module";
    script.defer = true; // 이 부분은 DOM 삽입 후 실행을 보장하기 위해 사용
    script.onload = () => {
      console.log("스크립트 로드 완료:", src);
      resolve();
    };
    script.onerror = () => {
      console.error("스크립트 로드 실패:", src);
      reject(new Error(`스크립트 로드 실패 : ${src}`));
    };
    document.body.appendChild(script);
  });
}

// HTML과 JS를 순차적으로 로드하는 함수
export async function loadComponent(key, selector) {
  const resource = resources[key];
  if (!resource) {
    console.error(`리소스 키 못찾음: ${key}`);
    throw new Error(`리소스 키 못찾음: ${key}`);
  }

  // HTML을 먼저 로드한 후, JavaScript를 로드
  await loadHTML(resource.html, selector);
  await loadScript(resource.js); // HTML이 DOM에 삽입된 후 JS를 로드
}

// 모든 컴포넌트를 순차적으로 로드하는 함수
async function loadAllComponents() {
  await loadComponent("header", "header");
  await loadComponent("snb", ".snb");
  await loadComponent("footer", "footer");
  console.log("모든 컴포넌트 로드 완료");
}

// 컴포넌트 로드를 시작
loadAllComponents().catch((error) => {
  console.error("컴포넌트 로드 오류:", error);
});
