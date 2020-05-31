/*
**获取订单信息
 */
function orderInfo() {
    var account = localStorage.getItem('userId');
    var data = {
        user_id: account
    }
    var jsonData = JSON.stringify(data);

    var xhr = new XMLHttpRequest();
    xhr.open('POST','http://localhost:5000/orderInfo', true);
    xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
    xhr.send(jsonData);

    xhr.onreadystatechange = function () {
        if(xhr.readyState == 4){
            if(xhr.status == 200){
                var res = JSON.parse(xhr.responseText);
                let total = 0;
                var order = document.getElementById('myOrder');
                for(let i = 0; i < res.length; i++){
                    total += parseInt(res[i]['itemPrice']);
                    var orderDetail = document.createElement("div");
                    var orderDetailPic = document.createElement("div");
                    var orderDetailText = document.createElement("div");
                    var orderDetailPrice = document.createElement("div");
                    var orderDetailNum = document.createElement("div");
                    var orderDetailTime = document.createElement("div");
                    var img = document.createElement("img");
                    var itemName = document.createElement("span");
                    var itemPrice = document.createElement("span");
                    var itemNum = document.createElement("span");
                    var itemTime = document.createElement("span");
                    var br = document.createElement("br");

                    orderDetail.className = "order-detail";
                    orderDetailPic.className = "order-detail-pic";
                    orderDetailText.className = "order-detail-text";
                    orderDetailPrice.className = "order-detail-price";
                    orderDetailNum.className = "order-detail-num";
                    orderDetailTime.className = "order-detail-time";
                    img.className = "item-pic";
                    img.src = res[i]['itemPicture'];
                    itemName.className = "item-name";
                    itemName.innerHTML = res[i]['itemName'];
                    itemPrice.className = "item-price";
                    itemPrice.innerHTML = "￥" + parseInt(res[i]['itemPrice']);
                    itemNum.className = "item-num";
                    itemNum.innerHTML = res[i]['quantity'];
                    itemTime.className = "item-time";
                    itemTime.innerHTML = res[i]['purchaseTime'];

                    orderDetailPic.appendChild(img);
                    orderDetailText.appendChild(itemName);
                    orderDetailText.appendChild(br);
                    orderDetailPrice.appendChild(itemPrice);
                    orderDetailNum.appendChild(itemNum);
                    orderDetailTime.appendChild(itemTime);
                    orderDetail.appendChild(orderDetailPic);
                    orderDetail.appendChild(orderDetailText);
                    orderDetail.appendChild(orderDetailPrice);
                    orderDetail.appendChild(orderDetailNum);
                    orderDetail.appendChild(orderDetailTime);
                    order.appendChild(orderDetail);
                }
            }
            else{
                console.log(xhr.status);
            }
        }
    }
}

window.onload = function () {
    orderInfo()
    /*
    **菜单点击显示/隐藏js
     */
    function getById(id) {
        return document.getElementById(id);
    }
    getById("setting").onclick = function () {
        // alert("run");
        var menuItem = getById("menu-list");
        if (menuItem.style.display == "block"){
            menuItem.style.display = "none";
        } else {
            menuItem.style.display = "block";
        }
    }

    /*
    **检测是否登录
    */
    var cart = document.getElementById("shopping-cart");
    var order = document.getElementById("orders");
    var login = document.getElementById("login");
    var logout = document.getElementById("logout");
    var userId = localStorage.getItem('userId');

    if(userId != "null" && userId != undefined){
        cart.style.display = "block";
        order.style.display = "block";
        logout.style.display = "block"
        login.style.display = "none";
    }
    else{
        cart.style.display = "none";
        order.style.display = "none";
        logout.style.display = "none";
        login.style.display = "block";
    }
}

/*
**退出
 */
function logout() {
    localStorage.removeItem('userId');
    var url = window.location.href;
    // alert(url);
    alert("已经退出!");
    window.location.replace(url);
}