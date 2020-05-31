window.onload = function () {
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

    /*
    **轮播图js
    */
    //获取元素
    if (!getById("container-good")){
        var container =  document.getElementById("container");
    }
    else{
        var container =  document.getElementById("container-good");
    }
    var banner = document.getElementById("banner");
    var li = document.querySelectorAll("#banner li");
    var spanNode = document.querySelectorAll("#buttons span");
    var img = document.getElementsByClassName("roll-pic")[0];
    var curWidth = document.body.clientWidth;

    //前后按钮
    var prev = document.getElementById('prev');
    var next = document.getElementById('next');

    //索引
    var index = 1;

    //给 container 设置宽，高，以及overflow:hidder
    container.style.width = img.offsetWidth + "px";
    container.style.height = img.offsetHeight + "px";
    container.style.overflow = "hidden";
    if(!getById("container-good")){
        container.style.left = (0.5 * curWidth - 250) + "px";
    }
    else{
        container.style.left = 50 + "px";
    }

    //给banner 设置宽高
    banner.style.height = img.offsetHeight + "px";
    banner.style.width = img.offsetWidth * li.length + "px";
    banner.style.padding = 0;
    banner.style.margin = 0;
    banner.style.left = "-500px"; /*默认位移设置*/

    function animate(offset) {
        banner.style.transition = "0.5s";
        banner.style.left = -parseInt(offset )* index + "px";
    }
    next.onclick = function () {
        //点击下一页：移动
        if(index === spanNode.length){
            index = 0;
        }
        index ++;
        // console.log("索引index:"+index);
        animate(img.offsetWidth)
        showButton()
    }
    prev.onclick = function () {
        if(index === 1){
            index = li.length-1;
        }
        index--;
        animate(img.offsetWidth)
        showButton()
    }
    function showButton() {
        for (var i = 0; i< spanNode.length; i++){
            spanNode[i].className = '';
        }
        // console.log("小圆点的index值："+index);
        spanNode[index-1].className = "on";
    }

    //自动轮播
    function play() {
        timer = setInterval(function () {
            banner.style.transition = "none";
            setTimeout(function () {
                next.onclick();
            },200)
        },2000);
    }
    play();
    //当鼠标移动上去的时候:点击事件与轮播事件冲突
    container.onmouseover = function () {
        //清除定时器
        clearInterval(timer);
    }
    container.onmouseout = function () {
        play();
    }

    //鼠标点击对应小圆点：自动切换
    function ButtonImage() {
        for (var i = 0; i< spanNode.length; i++){
            spanNode[i].onclick = function () {
                var myIndex = parseInt(this.getAttribute('index'));
                index = myIndex;
                animate(img.offsetWidth);
                showButton();
            }
        }
    }
    ButtonImage()

}

/*
**注册
 */
function submit() {
    var account = document.getElementById("userName").value;
    var passWord = document.getElementById("passWord").value;
    var data = {
        user_id: account,
        password: passWord
    }
    var jsonData = JSON.stringify(data);

    var xhr = new XMLHttpRequest();
    xhr.open('POST','http://localhost:5000/register', true);
    xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
    xhr.send(jsonData);

    xhr.onreadystatechange = function () {
        if(xhr.readyState === 4){
            if(xhr.status === 200){
                var responsetext = xhr.responseText;
                var res = JSON.parse(responsetext);

                if(res['status'] === 'success'){
                    alert('success');
                    window.location.replace("login.html");
                }
                else{
                    alert(res['detail'])
                }
            }
            else{
                console.log(xhr.status);
            }
        }
    }
}

/*
**登录
 */
function login() {
    var account = document.getElementById("userName").value;
    var passWord = document.getElementById("passWord").value;
    var data = {
        user_id: account,
        password: passWord
    }
    var jsonData = JSON.stringify(data);

    var xhr = new XMLHttpRequest();
    xhr.open('POST','http://localhost:5000/login', true);
    xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
    xhr.send(jsonData);

    xhr.onreadystatechange = function () {
        if(xhr.readyState === 4){
            if(xhr.status === 200){
                var responsetext = xhr.responseText;
                var res = JSON.parse(responsetext);

                if(res['status'] === 'success'){
                    alert('登录成功！');
                    localStorage.setItem("userId", account);
                    window.location.replace("homepage.html");
                }
                else{
                    alert(res['detail'])
                }
            }
            else{
                console.log(xhr.status);
            }
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
**添加商品进入购物车
 */
function putIn() {
    var account = localStorage.getItem('userId');
    var Name = document.getElementById('goodName').innerHTML;
    var data = {
        user_id: account,
        itemName: Name
    }
    var jsonData = JSON.stringify(data);

    var xhr = new XMLHttpRequest();
    xhr.open('POST','http://localhost:5000/putInCart', true);
    xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
    xhr.send(jsonData);

    xhr.onreadystatechange = function () {
        if(xhr.readyState === 4){
            if(xhr.status === 200){
                var responsetext = xhr.responseText;
                var res = JSON.parse(responsetext);

                if(res['status'] === 'success'){
                    alert('success');
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

function addCart(itemId) {
    var userId = localStorage.getItem('userId');
    var item_id = itemId;
    var data = {
        user_id: userId,
        itemId: item_id
    }
    var jsonData = JSON.stringify(data);

    var xhr = new XMLHttpRequest();
    xhr.open('POST','http://localhost:5000/addCart', true);
    xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
    xhr.send(jsonData);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var responsetext = xhr.responseText;
                var res = JSON.parse(responsetext);

                if (res['status'] === 'success') {
                    alert('添加购物车成功');
                } else {
                    alert('添加购物车失败');
                }
            } else {
                console.log(xhr.status);
            }
        }
    }
}

/*
**验证密码js
*/
function validate() {
    var pw1 = document.getElementById("passWord").value;
    var pw2 = document.getElementById("passWord-check").value;
    var input = document.getElementById("passWord-check");
    var img = document.getElementById("warn");

    input.style.float = "left";
    img.style.float = "left";
    img.style.width = 25 + "px";
    img.style.height = 25 + "px";
    img.style.display = "none";

    if(pw1 === pw2){
        document.getElementById("submit").disable = false;
        img.src = "../source/对勾.png";
        img.style.display = "block";
    }
    else{
        img.src = "../source/叉号.png";
        document.getElementById("submit").disable = true;
        img.style.display = "block";
    }
}




