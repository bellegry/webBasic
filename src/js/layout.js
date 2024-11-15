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

// tag안에 html넣어주고 스크립트 불러오는 함수
export function loadComponent(key, selector) {
  const resource = resources[key];
  if (!resource) {
    console.error(`리소스 키 못찾음: ${key}`);
    return Promise.reject(`리소스 키 못찾음: ${key}`);
  }

  return fetch(resource.html)
    .then((response) => {
      return response.text();
    })
    .then((html) => {
      document.querySelector(selector).innerHTML = html;
      loadScript(resource.js);
    })
    .catch((error) => {
      console.log(`로드 실패: ${key}`, error);
    });
}

// JavaScript 파일을 동적으로 로드하는 함수
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.type = "module";
    script.onload = () => resolve(src);
    script.onerror = () => reject(new Error(`스크림트 로드 실패 : ${src}`));
    document.body.appendChild(script);
  });
}

// header와 footer를 모두 로드한 후에 JavaScript 파일을 순차적으로 로드
Promise.all([loadComponent("header", "header"), loadComponent("snb", ".snb"), loadComponent("footer", "footer")])
  .then(() => {
    console.log("컴포넌트 로드");
  })
  .catch((error) => {
    console.error("컴포넌트를 로드 오류:", error);
  });
