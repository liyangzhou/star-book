$(function () {
    var url = 'http://localhost:1337/liyangzhou.tunnel.qydev.com/';
    var actorInfo = {};
    var params = parseURL(window.location.href);
    var totalLength = 0;
    var currentPage = params && params.currentPage || 1;
    var pageOpt = {
        offset: 0,
        limit: 10
    };
    var actorId = params.id || '';
    var worksList = [];
    var recommendStar = [];
    var recommendWorks = [];
    if (actorId) {
        getActorInfo();
        getWorks();
        getRecommendStar();
        getRecommendWorks();
    }

    // 解析url参数
    function parseURL(url){
        var halfUrl = url.split('?')[1];
        if (!halfUrl) { return; }
        var para = halfUrl.split('&');
        var len = para.length;
        var res = {};
        var arr = [];
        for(var i=0; i<len; i++){
            arr = para[i].split('=');
            res[arr[0]] = arr[1];
        }
        return res;
    }

    // 明星信息
    function getActorInfo() {
        $.ajax({
            type: 'GET',
            url: url + '/actor/' + actorId,
            dataType: 'json',
            success: function (result) {
                actorInfo = result || {};
                console.log('info', actorInfo);
                setActonInfo();
            }
        });
    }

    // 填充到页面中
    function setActonInfo() {
        var liItem = '<li class="long"><strong>英文名：</strong>' + actorInfo.enName + '</li>\n' +
            '                    <li><strong>作品数量：</strong>' + actorInfo.worksNumber + ' 部</li>\n' +
            '                    <li class="long"><strong>生日：</strong>' + actorInfo.birthDate + '</li>\n' +
            '                    <li><strong>出道：</strong>' + actorInfo.beActorDate + '</li>\n' +
            '                    <li class="long"><strong>星座：</strong>' + actorInfo.constellation + '</li>\n' +
            '                    <li><strong>肤色：</strong>' + actorInfo.skinColor + '</li>\n' +
            '                    <li class="long"><strong>国籍：</strong>' + actorInfo.country + '</li>\n' +
            '                    <li><strong>特点：</strong>' + actorInfo.characteristic + '</li>';
        $('.infosay .actor-name').text(actorInfo.name);
        $('.infosay .description').text(actorInfo.description);
        $('.infosay .base-info').append(liItem);
    }

    // 作品列表
    function getWorks() {
        pageOpt.offset = (currentPage - 1) * pageOpt.limit;
        $.ajax({
            type: 'GET',
            url: url + '/actor/work/' + actorId,
            data: {offset: pageOpt.offset, limit: pageOpt.limit},
            dataType: 'json',
            success: function (result) {
                worksList = result && result.list ? result.list : [];
                totalLength = result.totalLength || 0;
                setPagination();
                var liElem = '';
                worksList.forEach(function (item) {
                    if (item) {
                        liElem += '<li class="wow fadeInUp" style="visibility: visible; animation-name: fadeInUp;">\n' +
                            '                    <a class="thumb-img" target="_blank"><img alt="花木兰" src="' + item.albumUrls[0] + '"\n' +
                            '                                                                       original="http://img5.imgtn.bdimg.com/it/u=3066208800,2478771135&fm=27&gp=0.jpg"></a>\n' +
                            '                    <div class="article">\n' +
                            '                        <h3><a>' + item.title + '</a></h3>\n' +
                            '                        <p>' + item.description + '</p>\n' +
                            '                    </div>\n' +
                            '                    <div class="article-info">\n' +
                            '                        <span class="tag"></span>\n' +
                            '                        <span class="clock">' + item.date + '</span>\n' +
                            '                    </div>\n' +
                            '                </li>';
                    }
                });
                $('.works-list').append(liElem);
            }
        });
    }

    // 设置分页参数
    function setPagination() {
        // 分页 doc: https://flaviusmatis.github.io/simplePagination.js/#page-1
        $('.star-pagination').pagination({
            items: totalLength,             // 总页数
            itemsOnPage: pageOpt.limit,     // 每页条数
            currentPage: currentPage,       // 当前页数
            cssStyle: 'light-theme',
            prevText: '上一页',
            nextText: '下一页',
            displayedPages: 3,
            hrefTextPrefix: '?id=' + actorId +'&currentPage='
        });
    }

    // 明星推荐
    function getRecommendStar() {
        $.ajax({
            type: 'GET',
            url: url + '/actor/recommendation',
            data: {userId: 1},
            dataType: 'json',
            success: function (result) {
                recommendStar = result && result.list ? result.list : [];
                var liElem = '';
                recommendStar.forEach(function (item) {
                    if (item) {
                        liElem += '<li>\n' +
                            '                    <div class="hotimg"><a href="./work.html?id=' + item.id + '" target="_blank"><img\n' +
                            '                            src="' + item.albumUrls[0] + '" alt="' + item.name + '"></a></div>\n' +
                            '                    <p><a href="./work.html?id=' + item.id + '" target="_blank">' + item.name + '</a></p>\n' +
                            '                </li>';
                    }
                });
                $('.recommend-star').append(liElem);
            }
        });
    }

    // 作品推荐
    function getRecommendWorks() {
        $.ajax({
            type: 'GET',
            url: './assets/data/recommend-works.json',
            data: {id: actorId},
            dataType: 'json',
            success: function (result) {
                var data = result.data;
                var liElem = '';
                recommendWorks = data.items;
                recommendWorks.forEach(function (item) {
                    if (item) {
                        liElem += '<li>\n' +
                            '                    <a>\n' +
                            '                        <span class="thumbnail"><img src="' + item.image + '" alt="第三种爱情"></span>\n' +
                            '                        <span class="text">' + item.title + '</span>\n' +
                            '                    </a>\n' +
                            '                </li>';
                    }
                });
                $('.recommend-works').append(liElem);
            }
        });
    }
})