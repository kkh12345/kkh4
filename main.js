const yTop = document.querySelector(".y-top");
const hdrElm = {
  header: document.querySelector("header"),
  hdrBottom: document.querySelector(".hdr-bottom"),
  hamburger: document.querySelector(".hdr-top .fa-bars"),
  searchIcon: document.querySelector(".hdr-top .fa-magnifying-glass"),
  cartIcon: document.querySelector(".hdr-top .fa-cart-shopping"),
};
const bottomMenuElm = {
  bottomMenu: document.querySelector(".bottom-menu"),
  bottomMenuSearch: document.querySelector(".bottom-menu li:nth-child(3)>a"),
  bottomMenuCategory: document.querySelector(".bottom-menu li:nth-child(2)>a"),
  bottomMenuCart: document.querySelector(".bottom-menu li:nth-child(4)>a"),
};
const asideElm = {
  asideCloseBtn: document.querySelector(".aside .fa-xmark "),
  asideLoginTit: document.querySelector(".login .aside-tit>a"),
};
const searchBoxElm = {
  searchBox: document.querySelector(".search-box"),
  searchBoxCloseBtn: document.querySelector(".search-top .fa-arrow-left"),
  searchBoxSearchBtn: document.querySelector(".search-top .search-btn"),
  searchPopularList: document.querySelectorAll(".popular-searches ul > li"),
  searchInput: document.querySelector(".search-top input"),
  resetBtn: document.querySelector(".search-top .fa-xmark"),
};
const cartPageElm = {
  cartPageMain: document.querySelector(".cart_page-main"),
  cartCloseBtn: document.querySelector(".cart_page-tit fa-chevron-left"),
};
const searchPageElm = {
  searchPageMain: document.querySelector(".search_page-main"),
  searchPageInput: document.querySelector(
    ".search_page-search-inputWrap input"
  ),
  searchPageSearchBtn: document.querySelector(
    ".search_page-searchArea input + div + button"
  ),
  resetBtn: document.querySelector(".search_page-search-inputWrap .fa-xmark"),
  searchResultUl: document.querySelector(".search_result-item >ul"),
  select: document.querySelector(".search_result-info select"),
  resultNum: document.querySelector(".search_result-info .result-num"),
  resultNum2: document.querySelector(".search_page-searchArea p > .result-num"),
};
const loginPageElm = {
  loginPageMain: document.querySelector("login_page-main"),
};

//마지막 스크롤 위치
let lastScrollY = 0;
window.addEventListener("scroll", scrollFixed);

//고정되는것들
function scrollFixed() {
  if (hdrElm.header.classList.contains("fixed")) {
    if (
      this.scrollY <
      hdrElm.header.offsetTop +
        yTop.offsetHeight +
        hdrElm.header.offsetHeight * 0.5
    ) {
      if (hdrElm.header.classList.contains("fixed")) {
        hdrElm.header.classList.remove("fixed");
        bottomMenuElm.bottomMenu.classList.remove("fixed");
      }
    } else {
      if (lastScrollY > this.scrollY) {
        if (hdrElm.hdrBottom.classList.contains("hide")) {
          hdrElm.hdrBottom.classList.remove("hide");
          bottomMenuElm.bottomMenu.classList.remove("hide");
        }
      } else {
        if (!hdrElm.hdrBottom.classList.contains("hide")) {
          hdrElm.hdrBottom.classList.add("hide");
          bottomMenuElm.bottomMenu.classList.add("hide");
        }
      }
    }
  } else {
    if (
      this.scrollY >=
      hdrElm.header.offsetTop +
        yTop.offsetHeight +
        hdrElm.header.offsetHeight * 0.5
    ) {
      hdrElm.header.classList.add("fixed");
      hdrElm.hdrBottom.classList.add("hide");
      bottomMenuElm.bottomMenu.classList.add("fixed");
      bottomMenuElm.bottomMenu.classList.add("hide");
    }
  }

  lastScrollY = this.scrollY;
}
//사이드 닫기 버튼
asideElm.asideCloseBtn.addEventListener("click", closeAside);
function closeAside() {
  document.body.classList.remove("showAside");
}
//사이드바 열기
hdrElm.hamburger.addEventListener("click", showAside);
bottomMenuElm.bottomMenuCategory.addEventListener("click", showAside);
function showAside() {
  document.body.classList.add("showAside");
}
//검색창 열기
hdrElm.searchIcon.addEventListener("click", showSearchBox);
bottomMenuElm.bottomMenuSearch.addEventListener("click", showSearchBox);
function showSearchBox() {
  document.body.classList.add("searchShow");
  searchBoxElm.searchPopularList.forEach((a) => {
    a.classList.add("popular");
  });
}
//검색창 닫기
searchBoxElm.searchBoxCloseBtn.addEventListener("click", closeSearchBox);
function closeSearchBox() {
  document.body.classList.remove("searchShow");
  searchBoxElm.searchPopularList.forEach((a) => {
    a.classList.remove("popular");
  });
}

//검색페이지 열기
searchBoxElm.searchBoxSearchBtn.addEventListener("click", showSearchPage);
function showSearchPage() {
  document.body.classList.remove("detailPage");
  document.body.classList.add("searchPage");
  document.body.classList.remove("loginPage");
  document.body.classList.remove("searchShow");
  document.body.classList.remove("cartPage");
}
//상세페이지 열기

function showDetailPage() {
  document.body.classList.add("detailPage");
  document.body.classList.remove("searchPage");
  document.body.classList.remove("loginPage");
  document.body.classList.remove("searchShow");
  document.body.classList.remove("cartPage");
}
//로그인페이지 열기
asideElm.asideLoginTit.addEventListener("click", showLoginPage);
function showLoginPage() {
  document.body.classList.remove("detailPage");
  document.body.classList.remove("searchPage");
  document.body.classList.add("loginPage");
  document.body.classList.remove("showAside");
  document.body.classList.remove("cartPage");
}
//장바구니 페이지 열기
hdrElm.cartIcon.addEventListener("click", showCartPage);
bottomMenuElm.bottomMenuCart.addEventListener("click", showCartPage);
function showCartPage() {
  document.body.classList.remove("detailPage");
  document.body.classList.remove("searchPage");
  document.body.classList.remove("loginPage");
  document.body.classList.add("cartPage");
  selectedArr = [];
  createCartItemElm();
}

//검색어 입력하고 검색버튼 누르면 검색결과 가져와서 보여주기
let userInput = "";
let filter = "";
searchBoxElm.searchInput.addEventListener("change", getSearchValue);
searchPageElm.searchPageInput.addEventListener("change", getSearchValue);
searchBoxElm.searchBoxSearchBtn.addEventListener("click", getSearchData);
searchPageElm.searchPageSearchBtn.addEventListener("click", getSearchData);
function getSearchValue() {
  userInput = this.value.split(" ").join("");
}
function getSearchData() {
  searchPageElm.select.value = "";
  if (userInput.length === 0) {
    alert("검색어를 입력하세요");
    createSearchResultElm([]);
  } else {
    fetchData("item.json", createSearchResultElm);
  }
}
function createSearchResultElm(data) {
  let copy = [...data];
  let template = "";
  filter = copy.filter((a) => {
    return a.brand.includes(userInput) || a.title.includes(userInput);
  });
  filter.forEach((a) => {
    template += `<li class="item">${returnItemChildElm(a)}</li>`;
  });
  searchPageElm.searchResultUl.innerHTML = template;
  searchPageElm.resultNum.textContent = `${filter.length}`;
  searchPageElm.resultNum2.textContent = `${filter.length}`;
  searchPageElm.searchPageInput.value = userInput;
}
//검색 초기화 버튼
searchBoxElm.resetBtn.addEventListener("click", function () {
  searchBoxElm.searchInput.value = "";
});
searchPageElm.resetBtn.addEventListener("click", function () {
  searchPageElm.searchPageInput.value = "";
});

//검색 후 select
searchPageElm.select.addEventListener("change", getSelectValue);
function getSelectValue() {
  let template = "";
  let sort = "";
  if (this.value === "가격 높은순") {
    let copy = [...filter];
    copy.forEach((a) => {
      if (a.discountedPrice > 0) {
        a.totalPrice = a.discountedPrice;
      } else {
        a.totalPrice = a.firstCost;
      }
      sort = copy.sort((a, b) => {
        if (a.totalPrice - b.totalPrice < 0) {
          return 1;
        } else if (a.totalPrice - b.totalPrice === 0) {
          return 0;
        } else {
          return -1;
        }
      });
    });
  } else if (this.value === "가격 낮은순") {
    let copy = [...filter];
    copy.forEach((a) => {
      if (a.discountedPrice > 0) {
        a.totalPrice = a.discountedPrice;
      } else {
        a.totalPrice = a.firstCost;
      }
      sort = copy.sort((a, b) => {
        if (a.totalPrice - b.totalPrice < 0) {
          return -1;
        } else if (a.totalPrice - b.totalPrice === 0) {
          return 0;
        } else {
          return 1;
        }
      });
    });
  } else if (this.value == "상품명") {
    let copy = [...filter];
    sort = copy.sort((a, b) => {
      if (a.brand === b.brand) {
        return 0;
      } else if (a.brand < b.brand) {
        return -1;
      } else {
        return 1;
      }
    });
  }

  sort.forEach((a) => {
    template += `<li class="item">${returnItemChildElm(a)}</li>`;
    searchPageElm.searchResultUl.innerHTML = template;
  });
}
