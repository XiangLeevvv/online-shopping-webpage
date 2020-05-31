/*
**获取购物车信息
 */
function cartInfo() {
    var account = localStorage.getItem('userId');
    var data = {
        user_id: account
    }
    var jsonData = JSON.stringify(data);

    var xhr = new XMLHttpRequest();
    xhr.open('POST','http://localhost:5000/cartInfo', true);
    xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
    xhr.send(jsonData);

    xhr.onreadystatechange = function () {
        if(xhr.readyState === 4){
            if(xhr.status === 200){
                var res = JSON.parse(xhr.responseText);
                let total = 0;
                var cart = document.getElementById('myCart');
                for(let i = 0; i < res.length; i++){
                    // console.log(parseInt(res[i]['itemPrice']), parseInt(res[i]['quantity']));
                    total += parseInt(res[i]['itemPrice'])*parseInt(res[i]['quantity']);
                    var cartDetail = document.createElement("div");
                    var cartDetailPic = document.createElement("div");
                    var cartDetailText = document.createElement("div");
                    var cartDetailPrice = document.createElement("div");
                    var cartDetailNum = document.createElement("div");
                    var img = document.createElement("img");
                    var itemName = document.createElement("span");
                    var itemPrice = document.createElement("span");
                    var itemNum = document.createElement("span");
                    var br = document.createElement("br");

                    cartDetail.className = "cart-detail";
                    cartDetailPic.className = "cart-detail-pic";
                    cartDetailText.className = "cart-detail-text";
                    cartDetailPrice.className = "cart-detail-price";
                    cartDetailNum.className = "cart-detail-num";
                    img.className = "item-pic";
                    img.src = res[i]['itemPicture'];
                    itemName.className = "item-name";
                    itemName.innerHTML = res[i]['itemName'];
                    itemPrice.className = "item-price";
                    itemPrice.innerHTML = "￥" + parseInt(res[i]['itemPrice']);
                    itemNum.className = "item-num";
                    itemNum.innerHTML = res[i]['quantity'];

                    cartDetailPic.appendChild(img);
                    cartDetailText.appendChild(itemName);
                    cartDetailText.appendChild(br);
                    cartDetailPrice.appendChild(itemPrice);
                    cartDetailNum.appendChild(itemNum);
                    cartDetail.appendChild(cartDetailPic);
                    cartDetail.appendChild(cartDetailText);
                    cartDetail.appendChild(cartDetailPrice);
                    cartDetail.appendChild(cartDetailNum);
                    cart.appendChild(cartDetail);
                }
                var num = document.createElement("span");
                var totalPrice = document.getElementById('total');
                num.className = "total-price";
                num.innerHTML = "总价: ￥" + total;
                totalPrice.appendChild(num);
            }
            else{
                console.log(xhr.status);
            }
        }
    }
}

window.onload = function () {
    /*
    **检测是否登录
    */
    var cart = document.getElementById("shopping-cart");
    var order = document.getElementById("orders");
    var login = document.getElementById("login");
    var logout = document.getElementById("logout");
    var userId = localStorage.getItem('userId');
    var checkBtn = document.getElementById('checkBtn')

    if(userId !== "null" && userId !== undefined){
        cart.style.display = "block";
        order.style.display = "block";
        logout.style.display = "block"
        login.style.display = "none";
        checkBtn.style.display = "block";
        cartInfo();
    }
    else{
        cart.style.display = "none";
        order.style.display = "none";
        logout.style.display = "none";
        login.style.display = "block";
        checkBtn.style.display = "none";
        alert('您还未登录！');
    }

    /*
    **菜单点击显示/隐藏js
     */
    function getById(id) {
        return document.getElementById(id);
    }
    getById("setting").onclick = function () {
        // alert("run");
        var menuItem = getById("menu-list");
        if (menuItem.style.display === "block"){
            menuItem.style.display = "none";
        } else {
            menuItem.style.display = "block";
        }
    }
}

/*
**退出
 */
function logout() {
    localStorage.removeItem('userId');
    var url = window.location.href;
    alert("已经退出!");
    window.location.replace(url);
}

/*
**结算购物车
 */
function check() {
    var account = localStorage.getItem('userId');
    var data = {
        user_id: account
    }
    var jsonData = JSON.stringify(data);

    var xhr = new XMLHttpRequest();
    xhr.open('POST','http://localhost:5000/generateOrder', true);
    xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
    xhr.send(jsonData);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var responsetext = xhr.responseText;
                var res = JSON.parse(responsetext);

                if(res['status'] === 'success'){
                    alert('成功结算');
                    window.location.reload();
                }
                else{
                    alert('failed');
                }
            }
            else{
                console.log(xhr.status);
            }
        }
    }
}

/*
**清空购物车
 */
function clearCart() {
    var account = localStorage.getItem('userId');
    var data = {
        user_id: account
    }
    var jsonData = JSON.stringify(data);

    if (account !== "null" && account !== undefined){
        var xhr = new XMLHttpRequest();
        xhr.open('POST','http://localhost:5000/clearCart', true);
        xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
        xhr.send(jsonData);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var responsetext = xhr.responseText;
                    var res = JSON.parse(responsetext);
                    if(res['status'] === 'success'){
                        alert('已清空购物车');
                        window.location.reload();
                    }
                    else{
                        alert('failed');
                    }
                }
                else{
                    console.log(xhr.status);
                }
            }
        }
    }
    else{
        alert('您还未登录！');
    }

}
