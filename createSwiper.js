//변수
const swiper02Wrapper = document.querySelector(
  '.hotDealSwiper .swiper-wrapper'
);
const swiper01Wrapper = document.querySelector('.mainSwiper .swiper-wrapper');
const swiper04Wrapper = document.querySelector('.weekSwiper .swiper-wrapper');
const swiper05Wrapper = document.querySelector('.newSwiper .swiper-wrapper');
const swiper06Slide = document.querySelectorAll('.planSwiper .swiper-slide');

const swiper01 = new Swiper('.mainSwiper', {
  pagination: {
    el: '.swiper-pagination.pagination1',
    type: 'fraction',
  },

  autoplay: {
    delay: 2500,
  },
});
const swiper02 = new Swiper('.hotDealSwiper', {
  slidesPerView: 2.2,
  spaceBetween: 20,
});
const swiper03 = new Swiper('.adSwiper', {
  pagination: {
    el: '.swiper-pagination.pagination2',
    type: 'fraction',
  },
  autoplay: {
    delay: 2500,
  },
  loop: true,
});
const swiper04 = new Swiper('.weekSwiper', {
  slidesPerView: 1.3,
  spaceBetween: 20,
});
const swiper05 = new Swiper('.newSwiper', {
  slidesPerView: 2.2,
  spaceBetween: 20,
});
const swiper06 = new Swiper('.planSwiper', {
  slidesPerView: 1.3,
  spaceBetween: 20,
});
const swiper07 = new Swiper('.reviewSwiper', {
  slidesPerView: 1.4,
  spaceBetween: 20,
});
const swiper08 = new Swiper('.searchRecommendSwiper', {
  slidesPerView: 5,
  spaceBetween: 10,
});
const swiper09 = new Swiper('.adSwiper2', {
  pagination: {
    el: '.swiper-pagination.pagination2',
    type: 'fraction',
  },
  autoplay: {
    delay: 2500,
  },
  loop: true,
});
const swiper01Data = [
  {
    src: 'img/mainvisual1.png',
    p: '집에서 간편하게 즐기는',
    h101: '전국 팔도 엄선',
    h102: '간편 밀키트 할인',
    color: '#000',
  },
  {
    src: 'img/mainvisual2.png',
    p: '프리미엄 무항생제 한우',
    h101: '기분 저기압일 땐',
    h102: '고기 앞으로',
    color: '#fff',
  },
  {
    src: 'img/mainvisual3.png',
    p: '탱글탱글 오독오독 씹히는',
    h101: '올여름 보양식',
    h102: '신메뉴 두끼 물회',
    color: '#000',
  },
  {
    src: 'img/mainvisual4.png',
    p: '미리 세척하여 간편한',
    h101: '세척없이 바로먹는',
    h102: '식단관리 샐러드',
    color: '#000',
  },
];

//메인비주얼
function createSwiper01Elm() {
  let template = '';
  swiper01Data.forEach((a) => {
    template += `<div class="swiper-slide">
    <div class="imgWrap">
      <img src=${a.src} alt="" />
    </div>
    <div class="txt" style="color:${a.color}">
      <p>${a.p}</p>
      <h1>${a.h101}<br />${a.h102}</h1>
      <a class="learn-more" href="#none">자세히 보기</a>
    </div>
  </div>`;
  });
  swiper01Wrapper.innerHTML = template;
}
//핫딜
function createSwiper02Elm(data) {
  let template = '';
  let slice = [...data.slice(0, 3), data[0], data[0]];
  slice.forEach((a) => {
    template += `<div class="swiper-slide">
                  <div class="item">
                    ${returnItemChildElm(a)}
                  </div>
                </div>`;
  });
  swiper02Wrapper.innerHTML = template;
}

function createSwiper04Elm(data) {
  let template = '';
  let slice = [data[2], data[3], data[1], data[9]];
  slice.forEach((a) => {
    template += `<div class="swiper-slide">
                  <div class="item">
                    ${returnItemChildElm(a)}
                  </div>
                </div>`;
  });
  swiper04Wrapper.innerHTML = template;
}

//신상품
function createSwiper05Elm(data) {
  let template = '';
  let slice = [data[10], data[6], data[5], data[7]];
  slice.forEach((a) => {
    let discountStyle = '';
    let firstCostStyle = '';
    if (a.discountRate === 0 || a.discountShow === 0) {
      discountStyle = 'display:none';
      firstCostStyle = 'font-size:15px;color:#000;text-decoration:none;';
    }
    template += `<div class="swiper-slide">
                  <div class="item">
                    ${returnItemChildElm(a)}
                  </div>
                </div>`;
  });

  swiper05Wrapper.innerHTML = template;
}

//기획전
function createSwiper06Elm(data) {
  let brand1 = data.filter((a) => a.brand === '[쿡잇포차]');
  let brand2 = data.filter((a) => a.brand === '[쿡잇분식]');
  let brand3 = data.filter((a) => a.brand === '[전주밥상]');
  swiper06Template(brand1.slice(0, 2), 0);
  swiper06Template(brand2.slice(0, 2), 1);
  swiper06Template(brand3.slice(0, 2), 2);
}
function swiper06Template(arr, index) {
  let template = '';

  arr.forEach((a) => {
    template += `<div class="item">
                    ${returnItemChildElm(a)}
                  </div>`;
  });

  swiper06Slide[index].insertAdjacentHTML('beforeend', template);
}

//검색박스 추천 검색어

//후기

//함수실행
createSwiper01Elm();
fetchData('item.json', createSwiper02Elm);
fetchData('item.json', createSwiper04Elm);
fetchData('item.json', createSwiper05Elm);
fetchData('item.json', createSwiper06Elm);
