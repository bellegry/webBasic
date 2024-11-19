"use strict";

var CarouselPreviousNext = function (node, options) {
  // 전달된 옵션을 기본값과 병합
  options = Object.assign({ moreaccessible: false, paused: false, norotate: false }, options || {});

  // Prefers-Reduced-Motion 사용자 설정은 항상 자동 재생보다 우선 적용
  var hasReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (hasReducedMotion.matches) {
    options.paused = true;
  }

  /* DOM properties */
  this.domNode = node;

  this.carouselItemNodes = node.querySelectorAll(".carousel-item");

  this.containerNode = node.querySelector(".carousel-items");
  this.liveRegionNode = node.querySelector(".carousel-items");
  this.pausePlayButtonNode = null;
  this.previousButtonNode = null;
  this.nextButtonNode = null;

  this.playLabel = "Start automatic slide show";
  this.pauseLabel = "Stop automatic slide show";

  /* State properties */
  this.hasUserActivatedPlay = false; // 사용자가 재생/일시 정지 버튼을 활성화할 때 설정됩니다.
  this.isAutoRotationDisabled = options.norotate; // 자동 회전을 비활성화하는 속성입니다.
  this.isPlayingEnabled = !options.paused; // 이 속성은 updatePlaying 메소드에도 설정됩니다.
  this.timeInterval = 5000; // 슬라이드 회전 길이(ms)
  this.currentIndex = 0; // 현재 슬라이드의 인덱스
  this.slideTimeout = null; // setTimeout에 대한 참조 저장

  // Pause Button
  var elem = document.querySelector(".carousel .controls button.rotation");
  if (elem) {
    this.pausePlayButtonNode = elem;
    this.pausePlayButtonNode.addEventListener("click", this.handlePausePlayButtonClick.bind(this));
  }

  // Previous Button
  elem = document.querySelector(".carousel .controls button.previous");
  if (elem) {
    this.previousButtonNode = elem;
    this.previousButtonNode.addEventListener("click", this.handlePreviousButtonClick.bind(this));
    this.previousButtonNode.addEventListener("focus", this.handleFocusIn.bind(this));
    this.previousButtonNode.addEventListener("blur", this.handleFocusOut.bind(this));
  }

  // Next Button
  elem = document.querySelector(".carousel .controls button.next");
  if (elem) {
    this.nextButtonNode = elem;
    this.nextButtonNode.addEventListener("click", this.handleNextButtonClick.bind(this));
    this.nextButtonNode.addEventListener("focus", this.handleFocusIn.bind(this));
    this.nextButtonNode.addEventListener("blur", this.handleFocusOut.bind(this));
  }

  // Carousel item events
  for (var i = 0; i < this.carouselItemNodes.length; i++) {
    var carouselItemNode = this.carouselItemNodes[i];

    // 탭 패널에서 요소가 포커스를 받으면 회전 중지를 지원합니다.
    carouselItemNode.addEventListener("focusin", this.handleFocusIn.bind(this));
    carouselItemNode.addEventListener("focusout", this.handleFocusOut.bind(this));

    var imageLinkNode = carouselItemNode.querySelector(".carousel-image a");

    if (imageLinkNode) {
      imageLinkNode.addEventListener("focus", this.handleImageLinkFocus.bind(this));
      imageLinkNode.addEventListener("blur", this.handleImageLinkBlur.bind(this));
    }
  }

  // Handle hover events
  this.domNode.addEventListener("mouseover", this.handleMouseOver.bind(this));
  this.domNode.addEventListener("mouseout", this.handleMouseOut.bind(this));

  // 옵션에 따라 동작 초기화
  this.enableOrDisableAutoRotation(options.norotate);
  this.updatePlaying(!options.paused && !options.norotate);
  this.setAccessibleStyling(options.moreaccessible);
  this.rotateSlides();
};

/* 회전을 비활성화/활성화하고 거짓인 경우 일시 정지/재생 버튼을 숨기는 공개 기능 */
CarouselPreviousNext.prototype.enableOrDisableAutoRotation = function (disable) {
  this.isAutoRotationDisabled = disable;
  this.pausePlayButtonNode.hidden = disable;
};

/* 컨트롤/캡션 스타일을 업데이트하는 공개 기능 */
CarouselPreviousNext.prototype.setAccessibleStyling = function (accessible) {
  if (accessible) {
    this.domNode.classList.add("carousel-moreaccessible");
  } else {
    this.domNode.classList.remove("carousel-moreaccessible");
  }
};

CarouselPreviousNext.prototype.showCarouselItem = function (index) {
  this.currentIndex = index;

  for (var i = 0; i < this.carouselItemNodes.length; i++) {
    var carouselItemNode = this.carouselItemNodes[i];
    if (index === i) {
      carouselItemNode.classList.add("active");
    } else {
      carouselItemNode.classList.remove("active");
    }
  }
};

CarouselPreviousNext.prototype.previousCarouselItem = function () {
  var nextIndex = this.currentIndex - 1;
  if (nextIndex < 0) {
    nextIndex = this.carouselItemNodes.length - 1;
  }
  this.showCarouselItem(nextIndex);
};

CarouselPreviousNext.prototype.nextCarouselItem = function () {
  var nextIndex = this.currentIndex + 1;
  if (nextIndex >= this.carouselItemNodes.length) {
    nextIndex = 0;
  }
  this.showCarouselItem(nextIndex);
};

CarouselPreviousNext.prototype.rotateSlides = function () {
  if (!this.isAutoRotationDisabled) {
    if ((!this.hasFocus && !this.hasHover && this.isPlayingEnabled) || this.hasUserActivatedPlay) {
      this.nextCarouselItem();
    }
  }

  this.slideTimeout = setTimeout(this.rotateSlides.bind(this), this.timeInterval);
};

CarouselPreviousNext.prototype.updatePlaying = function (play) {
  this.isPlayingEnabled = play;

  if (play) {
    this.pausePlayButtonNode.setAttribute("aria-label", this.pauseLabel);
    this.pausePlayButtonNode.classList.remove("play");
    this.pausePlayButtonNode.classList.add("pause");
    this.liveRegionNode.setAttribute("aria-live", "off");
  } else {
    this.pausePlayButtonNode.setAttribute("aria-label", this.playLabel);
    this.pausePlayButtonNode.classList.remove("pause");
    this.pausePlayButtonNode.classList.add("play");
    this.liveRegionNode.setAttribute("aria-live", "polite");
  }
};

/* Event Handlers */
CarouselPreviousNext.prototype.handleImageLinkFocus = function () {
  this.liveRegionNode.classList.add("focus");
};

CarouselPreviousNext.prototype.handleImageLinkBlur = function () {
  this.liveRegionNode.classList.remove("focus");
};

CarouselPreviousNext.prototype.handleMouseOver = function (event) {
  if (!this.pausePlayButtonNode.contains(event.target)) {
    this.hasHover = true;
  }
};

CarouselPreviousNext.prototype.handleMouseOut = function () {
  this.hasHover = false;
};

/* EVENT HANDLERS */
CarouselPreviousNext.prototype.handlePausePlayButtonClick = function () {
  console.log("되는지 확인");
  this.hasUserActivatedPlay = !this.isPlayingEnabled;
  this.updatePlaying(!this.isPlayingEnabled);
};

CarouselPreviousNext.prototype.handlePreviousButtonClick = function () {
  this.previousCarouselItem();
};

CarouselPreviousNext.prototype.handleNextButtonClick = function () {
  this.nextCarouselItem();
};

/* Event Handlers for carousel items */
CarouselPreviousNext.prototype.handleFocusIn = function () {
  this.liveRegionNode.setAttribute("aria-live", "polite");
  this.hasFocus = true;
};

CarouselPreviousNext.prototype.handleFocusOut = function () {
  if (this.isPlayingEnabled) {
    this.liveRegionNode.setAttribute("aria-live", "off");
  }
  this.hasFocus = false;
};

/* Initialize(초기화) Carousel and options */
window.addEventListener(
  "load",
  function () {
    var carouselEls = document.querySelectorAll(".carousel");
    var carousels = [];

    // 다음을 기반으로 예제 동작 설정
    // URL의 확인란 및 매개변수의 기본 설정
    // 해당 URL 매개변수를 기반으로 확인란을 업데이트합니다.
    var checkboxes = document.querySelectorAll(".carousel-options input[type=checkbox]");
    var urlParams = new URLSearchParams(location.search);
    var carouselOptions = {};

    // 다음을 기반으로 예제 기능을 초기화합니다.
    // URL의 확인란 및 매개변수의 기본 설정
    // 해당 URL 매개변수를 기반으로 확인란을 업데이트합니다.
    checkboxes.forEach(function (checkbox) {
      var checked = checkbox.checked;

      if (urlParams.has(checkbox.value)) {
        var urlParam = urlParams.get(checkbox.value);
        if (typeof urlParam === "string") {
          checked = urlParam === "true";
          checkbox.checked = checked;
        }
      }

      carouselOptions[checkbox.value] = checkbox.checked;
    });

    carouselEls.forEach(function (node) {
      carousels.push(new CarouselPreviousNext(node, carouselOptions));
    });

    // add change event to checkboxes
    checkboxes.forEach(function (checkbox) {
      var updateEvent;
      switch (checkbox.value) {
        case "moreaccessible":
          updateEvent = "setAccessibleStyling";
          break;
        case "norotate":
          updateEvent = "enableOrDisableAutoRotation";
          break;
      }

      // 체크박스 상태가 변경되면 캐러셀 동작과 URL을 업데이트합니다.
      checkbox.addEventListener("change", function (event) {
        urlParams.set(event.target.value, event.target.checked + "");
        window.history.replaceState(null, "", window.location.pathname + "?" + urlParams);

        if (updateEvent) {
          carousels.forEach(function (carousel) {
            carousel[updateEvent](event.target.checked);
          });
        }
      });
    });
  },
  false
);
