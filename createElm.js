//변수
const mainCategoryUl = document.querySelector(".main-category>ul");
const closeCategoryBtn = document.querySelector(".close-category");
const timeDealUl = document.querySelector(".time_deal ul");
const bestList = document.querySelector(".best_seller .best_list");
const homeList = document.querySelector(".home .home-list");
const sideCategoryUl = document.querySelector(".aside-category>ul");
const cartLength = document.querySelector(".hdr-top .cartIcon .num");
const cartTapContent = document.querySelector(".cart-tap-content");
const cartItemTitle = document.querySelector(".cart-tap-content .cartTap-tit");

const selectAllBtn = document.querySelectorAll(
  ".cart-item-area .select-btnWrap button"
)[0];
const deleteSelectionBtn = document.querySelectorAll(
  ".cart-item-area .select-btnWrap button"
)[1];

//로컬 저장소에서 get
function getLocal(key) {
  return JSON.parse(localStorage.getItem(key));
}
//로컬 저장소에서 set
function setLocal(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

//페이지 로드 시 장바구니
let getCart = getLocal("cart");
if (getCart === null) {
  setLocal("cart", []);
} else {
  changeCartNum(getCart);
}
//페이지 로드 시 상품
fetchData("item.json", function (data) {
  let get = getLocal("data");
  if (get == null) {
    setLocal("data", data);
  }
});

//장바구니 클릭이벤트
function cartBtn(id) {
  event.stopPropagation();
  let includes = false;
  //상품데이터받아와서

  let get = getLocal("data");
  let find;
  //담을 상품id랑 일치하는 것을 찾음
  get.forEach((a) => {
    if (a.id === id) {
      find = a;
    }
  });

  get = getLocal("cart");

  //새로운 key 추가(상품개수)
  if (find.num === undefined) {
    find.num = 1;
  }
  //담을 상품을 원래 포함하고 있는지
  includes = get.some((a) => {
    return find.id === a.id;
  });
  //포함하고 있으면 num만 +1 포함하지 않으면 push
  if (includes === true) {
    get.forEach((a) => {
      if (a.id === find.id) {
        a.num = a.num + 1;
      }
    });
  } else {
    get.push(find);
  }

  changeCartNum(get);
  setLocal("cart", get);
}
//장바구니 아이콘 숫자

function changeCartNum(arr) {
  cartLength.textContent = arr.length;
}
//item의 자식 요소를 리턴하는 함수
function returnItemChildElm(a) {
  let discountStyle = "";
  let firstCostStyle = "";
  if (a.discountRate === 0 || a.discountShow === 0) {
    discountStyle = "display:none";
    firstCostStyle = "font-size:15px;color:#000;text-decoration:none;";
  }
  let itemChild = `<div href="#none" class="imgWrap" onclick="goTodetailPage(this)" data-id="${
    a.id
  }">
                      <a href="#none"><img src=${a.src} alt="" /></a>
                      <ul class="state1">
                      <li class="timeDeal" style="display:${
                        a.timeSale
                      }">타임딜</li>
                        <li class="limitedPrice" style="display:${
                          a.limitedPrice
                        }">한정특가</li>
                        <li class="best" style="display:${a.best}">베스트
                        </li>
                      </ul>
                      <ul class="state2">
                        
                        <li class="refrigerated" style="display:${
                          a.refrigerated
                        }">냉장<br/>상품</li>
                        <li class="timeSale" style="display:${
                          a.timeSale
                        }">타임<br/>세일</li>
                        
                        <li class="concentrate" style="display:${
                          a.concentrate
                        }">시선<br/>집중
                        
                      </ul>
                      <a href="#none" class="cart" onclick="cartBtn(${a.id})"
                        ><i class="fa-solid fa-cart-plus"></i
                      ></a>
                    </div>
                    <div class="txt">
                   
                      <a href="#none" onclick="goTodetailPage(this)" data-id="${
                        a.id
                      }">
                        <span class="brand">${a.brand}</span
                        ><span class="tit">${a.title}</span>
                      </a>
                      <p class="desc">${a.desc}</p>
                      <p style="${discountStyle}">
                        <span class="discountRate">${a.discountRate}%</span>
                        <span class="discountedPrice">${a.discountedPrice.toLocaleString()}원</span>
                      </p>
                      <span class="firstCost" style="${firstCostStyle}">${a.firstCost.toLocaleString()}원</span>
                    </div>`;

  return itemChild;
}
//상세페이지로 이동

function goTodetailPage(target) {
  showDetailPage();

  let get = getLocal("data");
  let find = get.find((a) => {
    return a.id == target.dataset.id;
  });

  let template = returnItemChildElm(find);
  document.querySelector(".detail-item .item").innerHTML = template;

  find = get.find((a) => a.id != target.dataset.id);
  template = returnItemChildElm(find);
  document.querySelector(".how-about .item").innerHTML = template;

  let findIdx = get.findIndex((a) => {
    return a.id == likeNum.nextElementSibling.children[0].dataset.id;
  });
  likeNum.children[0].textContent = `${get[findIdx].like}`;
}

//상세페이지 좋아요 버튼 누르면
const likeBtn = document.querySelector(
  ".detail_page-main .price-sum .btnWrap button:nth-child(1)"
);
const likeNum = document.querySelector(".detail_page-main .like-num");

likeBtn.addEventListener("click", likePlus);

function likePlus() {
  let get = getLocal("data");
  let findIdx = get.findIndex((a) => {
    return a.id == likeNum.nextElementSibling.children[0].dataset.id;
  });

  get[findIdx].like = get[findIdx].like + 1;
  likeNum.children[0].textContent = `${get[findIdx].like}`;

  setLocal("data", get);
}

//상세페이지 옵션1,옵션2 둘다 선택하면 상품 추가
const detailOption1 = document.querySelector("#detail-option1");
const detailOption2 = document.querySelectorAll("input[name=taste]");
const detailCartBtn = document.querySelector(
  ".detail_page-main .price-sum .btnWrap button:nth-child(2)"
);

detailOption1.addEventListener("change", function () {
  if (detailOption2[0].checked === true || detailOption2[1].checked === true) {
    let id = document.querySelector(".detail-item .imgWrap").dataset.id;
    detailCartBtn.setAttribute("data-id", `${id}`);
  }
});
detailOption2.forEach((a) => {
  a.addEventListener("change", function () {
    if (detailOption1.value !== "") {
      let id = document.querySelector(".detail-item .imgWrap").dataset.id;
      detailCartBtn.setAttribute("data-id", `${id}`);
    }
  });
});
//구매하기 버튼 클릭하면
detailCartBtn.nextElementSibling.addEventListener("click", function () {
  showLoginPage();
});

//장바구니 버튼 클릭하면(장바구니 담기)
detailCartBtn.addEventListener("click", function () {
  let getItem = getLocal("data");
  let findItem = getItem.find((a) => a.id == this.dataset.id);
  let getCart = getLocal("cart");
  let sumPrice = document.querySelector(
    ".detail_page-main .price-sum .price span:nth-child(2)"
  );

  if (findItem != undefined) {
    let includes = getCart.some((a) => findItem.id == a.id);

    if (includes) {
      let findIdx = getCart.findIndex((a) => {
        return a.id == findItem.id;
      });
      let answer = confirm(
        `장바구니에 이미 같은 상품이 ${getCart[findIdx].num}개 포함되어 있습니다. 추가하시겠습니까? 수량만 증가합니다.`
      );

      if (answer) {
        if (getCart[findIdx].num != undefined) {
          getCart[findIdx].num = getCart[findIdx].num + 1;
        } else {
          getCart[findIdx].num = 1;
        }
      }
    } else {
      let answer = confirm("장바구니에 상품을 추가하시겠습니까?");
      if (answer) {
        if (findItem.num != undefined) {
          findItem.num = findItem.num + 1;
        } else {
          findItem.num = 1;
        }
        getCart.push(findItem);
      }
      changeCartNum(getCart);
    }
    setLocal("cart", getCart);
  } else {
    alert(" 옵션을 선택해 주세요");
  }
});
//data 받아오는 함수
function fetchData(url, callback) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      callback(data);
    })
    .catch((err) => console.log("error :" + err));
}

fetchData("category.json", createCategoryElm);
fetchData("category.json", createSideCategoryElm);
fetchData("item.json", createTimeDealElm);
fetchData("item.json", createBestElm);
fetchData("item.json", createHomeElm);

//사이드 카테고리
function createSideCategoryElm(data) {
  let template = "";
  let slice = [...data.slice(0, 7), data[9]];

  slice.forEach((a) => {
    template += `<li>
          <a href="#none">
            <div class="imgWrap">
              <img src=${a.src} alt="" />
            </div>
            <p>${a.tit}</p>
          </a>
        </li>`;
  });
  sideCategoryUl.innerHTML = template;
}
//베스트셀러
function createBestElm(data) {
  let template = "";
  let slice = data.slice(5, 10);

  slice.forEach((a, i) => {
    template += `<li>
                <input id="bestseller${a.id}" type="radio" name="bestseller" />
                <label for="bestseller${a.id}">
                  <span class="order">${i + 1}</span
                  ><span class="brand">${a.brand}</span
                  > <span class="tit">${a.title}</span>
                  <span><i class="fa-solid fa-chevron-down"></i></span>
                </label>

                <div class="slideDown">
                  <div class="item">
                    ${returnItemChildElm(a)}
                  </div>
                </div>
              </li>`;
  });

  bestList.innerHTML = template;
}

//집에서 간편하게 준비

function createHomeElm(data) {
  let template = "";
  let slice = data.slice(6, 10);
  slice.forEach((a) => {
    template += `<li class="item">
${returnItemChildElm(a)}
</li>`;
  });
  homeList.innerHTML = template;
}

//카테고리
function createCategoryElm(data) {
  let template = "";
  const viewAll = `<li class="view_all" >
                <a href="#none" onclick="showMoreCategory();">
                  <div class="imgWrap">
                    <img src="img/category-list13.png" alt="" />
                  </div>
                  <p>전체보기</p>
                </a>
              </li>`;
  data.forEach((a) => {
    if (a.id < 8) {
      template += `<li>
          <a href="#none">
            <div class="imgWrap">
              <img src=${a.src} alt="" />
            </div>
            <p>${a.tit}</p>
          </a>
        </li>`;
    } else {
      template += `<li class="hide">
          <a href="#none">
            <div class="imgWrap">
              <img src=${a.src} alt="" />
            </div>
            <p>${a.tit}</p>
          </a>
        </li>`;
    }
  });
  mainCategoryUl.innerHTML = template + viewAll;
}

//타임딜
function createTimeDealElm(data) {
  let template = "";
  let filter = data.filter((a) => {
    return a.timeSale === "";
  });
  let newArr = [filter[2], filter[0]];

  newArr.forEach((a) => {
    template += `<li class="item ">
          ${returnItemChildElm(a)}
        </li>`;
  });

  timeDealUl.innerHTML = template;
}

//카테고리 전체보기 버튼 클릭했을 때
function showMoreCategory() {
  let liArr = [...mainCategoryUl.children];
  liArr.forEach((a) => {
    if (a.classList.contains("hide")) {
      a.classList.remove("hide");
    } else if (a.classList.contains("view_all")) {
      a.classList.add("hide");
    }
  });
  closeCategoryBtn.style.display = "block";
}
//카테고리 닫기버튼 클릭했을 때
closeCategoryBtn.addEventListener("click", function () {
  fetchData("category.json", createCategoryElm);
  this.style.display = "none";
});
//체크하면 결과창 html다시 만들어서 넣기
function createCartResultElm() {
  let firstCostSum = 0;
  let discountedPriceSum = 0;

  selectedArr.forEach((a) => {
    firstCostSum += a.firstCost * a.num;
    discountedPriceSum += (-1 * a.firstCost * a.discountRate * a.num) / 100;
  });
  let resultElm = "";

  if (cartTapContent.children.length > 1) {
    resultElm = document.querySelector(".cart-item-area .cart-result");
    if (resultElm.children[1].classList.contains("dropDown")) {
      selectedResultTemplate = `<h3>결과창 (클릭하세요)</h3>
    <div class="dropDown">
            <ul>
             <li>상품구매금액 <b>${firstCostSum.toLocaleString()}</b> + 배송비 <b>${0} (${"무료"})</b> - 상품할인금액 <b>${discountedPriceSum.toLocaleString()}</b> = </li>
            <li>합계 :<b> ${(
              firstCostSum + discountedPriceSum
            ).toLocaleString()}</b>원</li>
            </ul>
           </div>
            `;
    } else {
      selectedResultTemplate = `<h3>결과창 (클릭하세요)</h3>
    <div >
            <ul>
             <li>상품구매금액 <b>${firstCostSum.toLocaleString()}</b> + 배송비 <b>${0} (${"무료"})</b> - 상품할인금액 <b>${discountedPriceSum.toLocaleString()}</b> = </li>
            <li>합계 :<b> ${(
              firstCostSum + discountedPriceSum
            ).toLocaleString()}</b>원</li>
            </ul>
           </div>
            `;
    }

    resultElm.innerHTML = selectedResultTemplate;
  }
}
//장바구니 상품 체크
let selectedArr = [];

function cartItemCheck(target) {
  let selectedResultTemplate = "";

  //체크됨
  if (target.checked) {
    let get = getLocal("cart");
    let find = get.find((b) => b.id == target.dataset.id);
    let some = selectedArr.some((b) => b.id == target.dataset.id);
    if (some === true) {
      let findIdx = selectedArr.findIndex((b) => b.id == target.dataset.id);
      selectedArr[findIdx].num = selectedArr[findIdx].num + 1;
    } else {
      selectedArr.push(find);
    }
  }
  //체크안됨
  else {
    let get = getLocal("cart");
    let findIdx = selectedArr.findIndex((b) => b.id == target.dataset.id);
    selectedArr.splice(findIdx, 1);
  }
  createCartResultElm();
}

//장바구니 페이지 장바구니에 담긴 상품 보여주기
function createCartItemElm() {
  let get = getLocal("cart");

  let template = "";
  let resultTemplate = "";
  if (get.length != 0) {
    get.forEach((a, i) => {
      template += `
              <div class="cartItem" data-id="${a.id}">
              <input class="check" id="check${
                a.id
              }" type="checkbox" onchange="cartItemCheck(this)" data-id="${
        a.id
      }"><label for="check${a.id}">✓</label>
              <div class="cartItem-top">
                <div class="imgWrap" onclick="goTodetailPage(this)" data-id="${
                  a.id
                }" ><a href="#none"><img src="${a.src}" alt=""></a></div>
                <div class="txt">
                  <h3><span class="brand">${a.brand}</span><span class="tit">${
        a.title
      }</span></h3>
                  <p class="delivery">배송 : <span class="del-price">[무료]</span>/<span class="del-state">기본배송</span></p>
                  <p>상품구매금액 : <span class="cost">${(
                    a.num * a.firstCost
                  ).toLocaleString()}</span> 원</p>
                  <p class="discount"> 할인금액 : <span class="discount-price">${(
                    (-1 * a.firstCost * a.discountRate * a.num) /
                    100
                  ).toLocaleString()}</span> 원</p>
                  <div class="inputWrap"   ><button class="decrease" onclick="decreaseNum(this)" data-id="${
                    a.id
                  }">-</button><input disabled type="text" value="${
        a.num
      }" data-id="${a.id}"><button
                      class="increase" onclick="increaseNum(this)" data-id="${
                        a.id
                      }">+</button></div>
                </div>
              </div>
              <div class="cartItem-bottom">
                <p class="option"></p>
                <div class="btnWrap">
                  <button class="delete" onclick="cartItemDelete(this)" data-id="${
                    a.id
                  }">삭제</button>
                  <button class="order">주문하기</button>
                </div>
              </div>

            </div>`;
    });
    resultTemplate = `<div class="cart-result" onclick=" showCartResult(this);"><h3>결과창 (클릭하세요)</h3>
    <div>
            <ul>
             <li>상품구매금액  <b>0</b> + 배송비 <b>0 ("무료")</b> - 상품할인금액 <b>0</b> = </li>
            <li>합계 : <b>0</b> 원</li>
            </ul>
           </div>
            </div>`;
  } else {
    template = `<div class="empty-box">
              <img src="img/empty.svg" alt="" />
              <p>장바구니에 담은 상품 내역이 없습니다.</p>
            </div>`;
  }

  cartTapContent.innerHTML = template + resultTemplate;
}
//장바구니 상품 갯수 변경

function decreaseNum(target) {
  let value = target.nextElementSibling.value;
  let id = target.dataset.id;
  if (!isNaN(value)) {
    if (value > 1) {
      target.nextElementSibling.value = Number(value) - 1;
      let get = getLocal("cart");
      let findIdx = get.findIndex((b) => b.id == id);
      get[findIdx].num = get[findIdx].num - 1;

      setLocal("cart", get);
      let a = get[findIdx];
      let template = ` <h3><span class="brand">${
        a.brand
      }</span><span class="tit">${a.title}</span></h3>
                  <p class="delivery">배송 : <span class="del-price">[무료]</span>/<span class="del-state">기본배송</span></p>
                  <p>상품구매금액 : <span class="cost">${(
                    a.num * a.firstCost
                  ).toLocaleString()}</span> 원</p>
                  <p class="discount"> 할인금액 : <span class="discount-price">${(
                    (-1 * a.firstCost * a.discountRate * a.num) /
                    100
                  ).toLocaleString()}</span> 원</p>
                  <div class="inputWrap"   ><button class="decrease" onclick="decreaseNum(this)" data-id="${
                    a.id
                  }">-</button><input disabled type="text" value="${
        a.num
      }" data-id="${a.id}"><button
                      class="increase" onclick="increaseNum(this)" data-id="${
                        a.id
                      }">+</button></div>`;
      target.parentElement.parentElement.innerHTML = template;
      cartItemCheck(document.querySelector(`#check${id}`));
    }
  }
}
function increaseNum(target) {
  let value = target.previousElementSibling.value;
  let id = target.dataset.id;
  if (!isNaN(value)) {
    target.previousElementSibling.value = Number(value) + 1;
    let get = getLocal("cart");
    let findIdx = get.findIndex((b) => b.id == id);
    get[findIdx].num = get[findIdx].num + 1;
    setLocal("cart", get);
    let a = get[findIdx];
    let template = ` <h3><span class="brand">${
      a.brand
    }</span><span class="tit">${a.title}</span></h3>
                <p class="delivery">배송 : <span class="del-price">[무료]</span>/<span class="del-state">기본배송</span></p>
                <p>상품구매금액 : <span class="cost">${(
                  a.num * a.firstCost
                ).toLocaleString()}</span> 원</p>
                <p class="discount"> 할인금액 : <span class="discount-price">${(
                  (-1 * a.firstCost * a.discountRate * a.num) /
                  100
                ).toLocaleString()}</span> 원</p>
                <div class="inputWrap"   ><button class="decrease" onclick="decreaseNum(this)" data-id="${
                  a.id
                }">-</button><input disabled type="text" value="${
      a.num
    }" data-id="${a.id}"><button
                    class="increase" onclick="increaseNum(this)" data-id="${
                      a.id
                    }">+</button></div>`;
    target.parentElement.parentElement.innerHTML = template;
    cartItemCheck(document.querySelector(`#check${id}`));
  }
}
//장바구니 결과 드롭다운
function showCartResult(target) {
  target.children[1].classList.toggle("dropDown");
}
//장바구니페이지 상품 삭제 버튼 클릭
function cartItemDelete(target) {
  let id = target.dataset.id;
  let get = getLocal("cart");
  let findIdx = get.findIndex((a) => a.id == id);
  get.splice(findIdx, 1);
  setLocal("cart", get);

  findIdx = selectedArr.findIndex((a) => a.id == id);
  selectedArr.splice(findIdx, 1);
  changeCartNum(get);
  let cartItemAll = document.querySelectorAll(".cartItem");
  let copy = [...cartItemAll];
  if (cartItemAll.length > 0) {
    copy.forEach((a, i) => {
      if (a.dataset.id == id) {
        a.remove();
        copy.splice(i, 1);
      }
    });
  }

  if (copy.length === 0) {
    document.querySelector(".cart-item-area .cart-result").remove();
  }
  if (document.querySelectorAll(".cart-tap-content .cartItem").length === 0) {
    cartTapContent.innerHTML = `<div class="empty-box">
              <img src="img/empty.svg" alt="" />
              <p>장바구니에 담은 상품 내역이 없습니다.</p>
            </div>`;
  }

  createCartResultElm();
}
//장바구니페이지 상품 전체선택
selectAllBtn.addEventListener("click", selectAllCartItems);
function selectAllCartItems(e) {
  let get = getLocal("cart");
  selectedArr = get.map((a) => a);
  let template = "";
  let resultTemplate = "";
  let firstCostSum = 0;
  let discountedPriceSum = 0;
  if (selectedArr.length != 0) {
    selectedArr.forEach((a, i) => {
      firstCostSum += a.firstCost * a.num;
      discountedPriceSum += (-1 * a.firstCost * a.discountRate * a.num) / 100;
      template += `
              <div class="cartItem" data-id="${a.id}">
              <input checked class="check" id="check${
                a.id
              }" type="checkbox" onchange="cartItemCheck(this)" data-id="${
        a.id
      }"><label for="check${a.id}">✓</label>
              <div class="cartItem-top">
                <div class="imgWrap"><a href="#none"><img src="${
                  a.src
                }" alt=""></a></div>
                <div class="txt">
                  <h3><span class="brand">${a.brand}</span><span class="tit">${
        a.title
      }</span></h3>
                  <p class="delivery">배송 : <span class="del-price">[무료]</span>/<span class="del-state">기본배송</span></p>
                  <p>상품구매금액 : <span class="cost">${(
                    a.num * a.firstCost
                  ).toLocaleString()}</span> 원</p>
                  <p class="discount"> 할인금액 : <span class="discount-price">${(
                    (-1 * a.firstCost * a.discountRate * a.num) /
                    100
                  ).toLocaleString()}</span> 원</p>
                  <div class="inputWrap"   ><button class="decrease" onclick="decreaseNum(this)" data-id="${
                    a.id
                  }">-</button><input disabled type="text" value="${
        a.num
      }" data-id="${a.id}"><button
                      class="increase" onclick="increaseNum(this)" data-id="${
                        a.id
                      }">+</button></div>
                </div>
              </div>
              <div class="cartItem-bottom">
                <p class="option"></p>
                <div class="btnWrap">
                  <button class="delete" onclick="cartItemDelete(this)" data-id="${
                    a.id
                  }">삭제</button>
                  <button class="order">주문하기</button>
                </div>
              </div>

            </div>`;
    });

    let resultElm = document.querySelector(".cart-item-area .cart-result");

    if (resultElm.children[1].classList.contains("dropDown")) {
      resultTemplate = `<div class="cart-result" onclick=" showCartResult(this);"><h3>결과창 (클릭하세요)</h3>
    <div class="dropDown">
            <ul>
             <li>상품구매금액 <b>${firstCostSum.toLocaleString()}</b> + 배송비 <b>${0} (${"무료"})</b> - 상품할인금액 <b>${discountedPriceSum.toLocaleString()}</b> = </li>
            <li>합계 :<b> ${(
              firstCostSum + discountedPriceSum
            ).toLocaleString()}</b>원</li>
            </ul>
           </div>
            </div>`;
    } else {
      resultTemplate = `<div class="cart-result" onclick=" showCartResult(this);"><h3>결과창 (클릭하세요)</h3>
    <div class="">
            <ul>
             <li>상품구매금액 <b>${firstCostSum.toLocaleString()}</b> + 배송비 <b>${0} (${"무료"})</b> - 상품할인금액 <b>${discountedPriceSum.toLocaleString()}</b> = </li>
            <li>합계 :<b> ${(
              firstCostSum + discountedPriceSum
            ).toLocaleString()}</b>원</li>
            </ul>
           </div>
            </div>`;
    }
  } else {
    template = `<div class="empty-box">
              <img src="img/empty.svg" alt="" />
              <p>장바구니에 담은 상품 내역이 없습니다.</p>
            </div>`;
  }
  cartTapContent.innerHTML = template + resultTemplate;
}

//장바구니페이지 상품 선택한것 삭제
deleteSelectionBtn.addEventListener("click", deleteSelection);
function deleteSelection() {
  let dropDown = false;
  let get = getLocal("cart");
  let selectedId = selectedArr.map((a, i) => a.id);
  selectedId.forEach((a, i) => {
    get.forEach((b, j) => {
      if (b.id === a) {
        get.splice(j, 1);
      }
    });
  });
  setLocal("cart", get);

  let resultElm = document.querySelector(".cart-item-area .cart-result");

  if (document.querySelectorAll(".cart-tap-content .cartItem").length != 0) {
    if (resultElm.children[1].classList.contains("dropDown")) {
      dropDown = true;
    } else {
      dropDown = false;
    }
  }

  selectedArr = [];
  createCartItemElm();

  if (dropDown) {
    resultElm = document.querySelector(".cart-item-area .cart-result");
    resultElm.children[1].classList.add("dropDown");
  }
  get = getLocal("cart");
  changeCartNum(get);
}
//선택상품주문
const selectedOrder = document.querySelectorAll(
  ".cart_page-main .order-btn-wrap button"
)[0];
selectedOrder.addEventListener("click", function () {
  if (selectedArr.length === 0) {
    alert("선택된 상품이 없습니다");
  } else {
    showLoginPage();
  }
});

//전체상품주문
const AllOrder = document.querySelectorAll(
  ".cart_page-main .order-btn-wrap button"
)[1];
AllOrder.addEventListener("click", function () {
  showLoginPage();
});
