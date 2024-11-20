"use strict";

class Accordion {
  // 생성자
  constructor(domNode) {
    this.rootEl = domNode;
    this.buttonEl = this.rootEl.querySelector("button[aria-expanded]");

    const controlsId = this.buttonEl.getAttribute("aria-controls");
    this.contentEl = document.getElementById(controlsId);

    this.open = this.buttonEl.getAttribute("aria-expanded") === "true";

    // add event listeners
    this.buttonEl.addEventListener("click", this.onButtonClick.bind(this));
  }

  // 메서드
  onButtonClick() {
    this.toggle(!this.open);
  }

  toggle(open) {
    // 요청된 상태(open)와 현재 상태(this.open)가 같으면 아무 작업도 수행하지 않고 종료, 불필요한 DOM 업데이트를 방지
    if (open === this.open) {
      return;
    }

    // 내부 상태 업데이트
    this.open = open;

    // 버튼의 aria-expanded 속성을 업데이트하여 현재 상태를 DOM에 반영
    this.buttonEl.setAttribute("aria-expanded", `${open}`);
    if (open) {
      this.contentEl.removeAttribute("hidden");
    } else {
      this.contentEl.setAttribute("hidden", "");
    }
  }

  // 편의를 위해 public 열기 및 닫기 방법 추가
  open() {
    this.toggle(true);
  }

  close() {
    this.toggle(false);
  }
}

// init(초기화) accordions
const accordions = document.querySelectorAll(".accordion h4");
accordions.forEach((accordionEl) => {
  new Accordion(accordionEl);
});
