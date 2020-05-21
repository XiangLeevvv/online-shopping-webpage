window.onload = function () {
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
    **轮播图js
    */
    //获取元素
    var container =  document.getElementById("container");
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
    container.style.left = (0.5 * curWidth - 250) + "px";

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
        if(index == spanNode.length){
            index = 0;
        }
        index ++;
        // console.log("索引index:"+index);
        animate(img.offsetWidth)
        showButton()
    }
    prev.onclick = function () {
        if(index == 1){
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
        play()
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

