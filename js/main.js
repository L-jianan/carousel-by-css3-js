// 保证等图片加载完，能获取到li的高度
window.onload = function(){
    // 获取所需元素
    var box = document.getElementById('box');
    var ul = document.getElementById('ulList');
    var ulList = ul.children;
    var ol = document.getElementById('olList');

    // 给ul设置高度  这样主容器box才有高度
    ul.style.height = ulList[0].offsetHeight + 'px';

    // 获取html文档的宽度 用于初始化图片位置
    var screenWidth = document.documentElement.offsetWidth;

    // 根据ul li的个数 动态创建ol li 
    for(var i = 0; i < ulList.length; i++){
        var li = document.createElement('li');
        if(i == 0){
            li.className = 'current';
        }
        ol.appendChild(li);
    }

    var olList = ol.children;

    // 视图大小改变，重新获取li的高度，html文档的高度
    window.onresize = function(){
        ul.style.height = ulList[0].offsetHeight + 'px';
        screenWidth = document.documentElement.offsetWidth;
    }

    // 定义三个容器
    var center = 0,
        right = 1,
        left = ulList.length - 1;

    // 初始化图片位置
    ulList[center].style.transform = 'translateX(0px)';
    ulList[right].style.transform = 'translateX('+ screenWidth +'px)';
    ulList[left].style.transform = 'translateX('+ (-screenWidth) +'px)';

    // touch事件
    box.addEventListener('touchstart',touchStartHandle);
    box.addEventListener('touchmove',touchMoveHandle);
    box.addEventListener('touchend',touchEndHandle);

    var timer;
    var startX,distance,startTime,endTime;

    function touchStartHandle(e){

        clearInterval(timer);

        setTransition(false,false,false);

        // 获取初始位置
        startX = e.touches[0].pageX;

        // 获取初始时间
        startTime = new Date();


    }

    function touchMoveHandle(e){
        
        distance = e.touches[0].pageX - startX;

        setTranslateX(distance);
    }

    function touchEndHandle(e){

        distance = e.changedTouches[0].pageX -startX;

        endTime = new Date() - startTime;

        if((distance < -screenWidth/3) ||　(endTime < 500 && distance < -30)){
            nextShow();
            timer = setInterval(function(){
                nextShow();
            },1500);
        }else if((distance > screenWidth/3) || (endTime < 500 && distance > 30)){
            prevShow();
            timer = setInterval(function(){
                nextShow();
            },1500);
        }else{
            setTransition(true,true,true);   
            timer = setInterval(function(){
                nextShow();
            },1500);
        }
    }

    // 设置page-control
    function setPoint(){
        for(var i = 0; i < olList.length; i++){
            olList[i].className = '';
        }
        olList[center].className = 'current';
    }

    // 设置每个位置的过度动画
    function setTransition(l,c,r){
        if(l){
            ulList[left].className = 'transition';
        }else{
            ulList[left].className = '';
        }
        if(c){
            ulList[center].className = 'transition';
        }else{
            ulList[center].className = '';
        }
        if(r){
            ulList[right].className = 'transition';
        }else{
            ulList[right].className = '';
        }
    }

    // 设置位置的函数
    function setTranslateX(dis){
        dis = dis || 0;
        ulList[center].style.transform = 'translateX('+(0+dis)+'px)';
        ulList[right].style.transform = 'translateX('+ (screenWidth + dis) +'px)';
        ulList[left].style.transform = 'translateX('+ (-screenWidth + dis) +'px)';
    }

    // 下一张
    function nextShow(){
        left = center;
        center = right;
        right++;

        if(right == ulList.length){
            right = 0;
        }

        setTransition(true,true,false);

        setTranslateX();

        setPoint();
    }

    // 上一张
    function prevShow(){
        right = center;
        center = left;
        left--;

        if(left == -1){
            left = ulList.length - 1;
        }

        setTransition(false,true,true);

        setTranslateX();

        setPoint();
    }

    // 自动轮播
    timer = setInterval(function(){
        nextShow();
    },1500);
}