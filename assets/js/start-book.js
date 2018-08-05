

$(function () {
    var url = 'http://localhost:8080/';

    var href = window.location.href;
    var params = parseURL(href) || {
        currentPage: 1,
        offset: 0,
        limit: 30,
        keyword: ''
    };
    var starList = [];
    var totalLength = 0;
    var filters = [];
    var filterOpt = {
        offset: params.offset,
        limit: params.limit,
        keyword: params.keyword
    };
    getFilters();
    getStars();
    setFilterOpt();
    $('.search-area .search-text').val(filterOpt.keyword);
    function setFilterOpt () {
        for (var k in params) {
            if (filterOpt.hasOwnProperty(k)) {
                filterOpt[k] = params[k];
            }
        }
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

    // 普通搜索
    $('.search-area .search-btn').click(function () {
        filterOpt.keyword = $('.search-area .search-text').val();
        searchSubmit();
    });

    // 图片搜索
    $('.search-area .image-search').click(function () {
        $('#fileUpload').fileupload({
            url: 'upload_url',
            dataType: 'json',
            done: function (e, data) {
                // todo
            }
        })
    });

    // 获取筛选字段
    function getFilters() {
        $.ajax({
            type: 'GET',
            url: './assets/data/filter.json',
            data: {offset: params.offset, limit: params.limit},
            dataType: 'json',
            success: function (result) {
                var data = result.data;
                filters = data.items;
                var liElem = '';
                filters.forEach(function(item) {
                    var tagGroup = '<span  class="filter-item active" data-id="">全部</span>';
                    if (item && item.items) {
                        item.items.forEach(function (tag) {
                            tagGroup += '<span class="filter-item" data-id="' + tag.id + '">' + tag.name +'</span>'
                        });
                    }
                    if (item) {
                        liElem += '<li class="filter-category">\n' +
                            '                <span class="category-label" data-name="' + item.name + '">' + item.label + '：</span>\n' +
                            '                <p class="item-group">' + tagGroup + '</p>\n' +
                            '            </li>';
                    }
                })
                $('.advanced-search .search-content').append(liElem);
                $('.advanced-search .filter-item').each(function() {
                    var parent = $(this).parent();
                    var labelEl = parent.siblings('.category-label');
                    var label = labelEl.attr('data-name');
                    for (var k in params) {
                        if (label == k && $(this).attr('data-id') == params[k]) {
                            $(this).addClass('active').siblings().removeClass('active');
                        }
                    }
                });
                selectFilter();
            }
        })
    }

    // 选择筛选条件
    function selectFilter() {
        $('.advanced-search .filter-item').click(function () {
            var parent = $(this).parent();
            var labelEl = parent.siblings('.category-label');
            var label = labelEl.attr('data-name');
            var filterId = $(this).attr('data-id');
            filterOpt[label] = filterId;
            $(this).addClass('active').siblings().removeClass('active');

            searchSubmit();
        })
    }

    function searchSubmit() {
        params.offset = (params.currentPage - 1) * params.limit;
        window.location.href = href.substring(0, href.indexOf('?')) + getUrlQuery();
    }

    // 获取明星列表
    function getStars() {
        var page = (params.currentPage%2 == 0) ? 2 : 1;
        params.offset = (params.currentPage - 1) * params.limit;
        $.ajax({
            type: 'GET',
            url: url + 'actor/search',
            // url: './assets/data/star-list-' + page + '.json',
            data: {offset: params.offset, limit: params.limit},
            dataType: 'json',
            success: function (result) {
                var data = result;
                starList = data.list;
                totalLength = data.total;
                setPagination();
                var liElem = '';
                starList.forEach(function (item) {
                    if (item) {
                        liElem += '<li class="pos-r wow star-item" style="visibility: visible;">\n' +
                            '                <div class="opacity-el" id="' + item.id + '"></div>\n' +
                            '                <div class="img-wrap">\n' +
                            '                    <img src="'+ item.albumUrls[0] +'" alt="'+item.name+'" original="'+item.albumUrls[0]+'">\n' +
                            '                    <div class="ny-info pos-a">\n' +
                            '                        <h3>' + item.name +'</h3>\n' +
                            '                    </div>\n' +
                            // '                    <p class="avnum pos-a">已收录<strong>' + item.works +'</strong>部作品</p>\n' +
                            '                </div>\n' +
                            '            </li>'
                    }
                });
                $('#starList').append(liElem);
            }
        })
    }

    // 获取url参数
    function getUrlQuery() {
        var query = '?';
        for (var k in filterOpt) {
            console.log('filterOpt k', filterOpt);
            params[k] = filterOpt[k];
        }
        for (var key in params) {
            query += key + '=' + params[key] + '&';
        }
        var lastSymbol = query[query.length - 1];
        if (lastSymbol == '&') {
            query = query.substring(lastSymbol, query.length - 1);
        }
        return query;
    }

    // 设置分页参数
    function setPagination() {
        // 分页 doc: https://flaviusmatis.github.io/simplePagination.js/#page-1
        $('.star-pagination').pagination({
            items: totalLength,             // 总页数
            itemsOnPage: params.limit,     // 每页条数
            currentPage: params.currentPage,       // 当前页数
            cssStyle: 'light-theme',
            prevText: '上一页',
            nextText: '下一页',
            onPageClick: function (num) {
                params.currentPage = num;
                searchSubmit();
            }
        });
    }

    // 详情
    $('#starList').click(function(e) {
        var target = e.target || e.srcElement;
        if(target.nodeName.toLocaleLowerCase() == 'div'){
            window.open('./work.html?id=' + target.id)
            // window.location.href = './work.html?id=' + target.id;
        }
    })
})