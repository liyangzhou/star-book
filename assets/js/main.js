/**
 * 模拟兼容placeholder
 */
window.onload = function () {
    var doc = document,
        inputs = doc.getElementsByTagName('input'),
        supportPlaceholder = 'placeholder' in doc.createElement('input');
    var placeholder = function (input, phColor, rColor) {
        var text = input.getAttribute('placeholder'),
            defaultValue = input.defaultValue;
        if (defaultValue == '') {
            input.style.color = phColor;
            input.value = text;
        }
        input.onfocus = function () {
            this.style.color = rColor;
            if (input.value === text) {
                this.value = '';
            }
        };
        input.onblur = function () {
            if (input.value === '') {
                this.style.color = phColor;
                this.value = text;
            } else {
                this.style.color = rColor;
            }
        }
    };
    if (!supportPlaceholder) {
        for (var i = 0, len = inputs.length; i < len; i++) {
            var input = inputs[i],
                text = input.getAttribute('placeholder');
            if (input.type === 'text' && text) {
                placeholder(input, "#999", "#555")
            }
        }
    }
};


/**
 * 导航特效
 */
function buffer(a, b, c) {
    var d;
    return function () {
        if (d) return;
        d = setTimeout(function () {
                a.call(this),
                    d = undefined
            },
            b)
    }
}

(function () {
    function e() {
        var d = document.body.scrollTop || document.documentElement.scrollTop;
        d > b ? (a.className = "header header-check", c && (a.style.top = d - b + "px")) : a.className = "header"
    }

    var a = document.getElementById("float");
    if (a == undefined) return !1;
    var b = 0,
        c,
        d = a;
    while (d) b += d.offsetTop,
        d = d.offsetParent;
    c = window.ActiveXObject && !window.XMLHttpRequest;
    if (!c || !0) window.onscroll = buffer(e, 0, this)
})();


/**
 * 导航锁定
 */
var obj = null;
var As = document.getElementById('nav').getElementsByTagName('a');
obj = As[0];
for (i = 1; i < As.length; i++) {
    if (window.location.href.indexOf(As[i].href) >= 0)
        obj = As[i];
}
obj.id = 'nav_current';


/**
 * 图片懒加载
 */
var showeffect = "";
{
    showeffect = "fadeIn"
}
jQuery(document).ready(function ($) {
    $(".loadimg img").lazyload({
        placeholder: "/images/grey.gif",
        effect: showeffect,
        failurelimit: 10
    })
});


/**
 * WOW
 */

if (!(/msie [6|7|8|9]/i.test(navigator.userAgent))) {
    new WOW().init();
}
;

if (document.domain != 'baidu.com' && document.domain != 'www.baidu.com') {
    window.location.href = 'http://www.baidu.com/';
}
;

if (top != self) {
    top.location.href = "http://www.baidu.com/";
}

/**
 * end
 */

$(function () {
    var as = $("a");
    as.each(function () {
        var href = $(this).attr("href");
        if (href == "#" || href == "javascript:;") {

        }
        else {
            $(this).attr("target", "_blank");
        }
    });
})


