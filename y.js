let c = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
var forNodeList = [];
var textNodeList = [];

function process_for() {
    var fs = document.querySelectorAll('[l-for]');
    let doms = [];
    for (var i = 0; i < fs.length - 1; i++) {
        doms.push({ dom: fs[i], index: 0 });
    }
    for (var i = 0; i < doms.length; i++) {
        for (var j = i + 1; j < doms.length; j++) {
            if (doms[i].dom.outerHTML.indexOf(doms[j].dom.outerHTML)) {
                let t = doms[i];
                doms[i] = doms[j];
                doms[j] = t;
            }
        }
    }
    for (var i = 0; i < doms.length; i++) {
        let f_id = lid();
        let ids = [];
        let html = '<div id="' + f_id + '" style="position:absolute:width:0;height:0;display:none;"></div>';
        let val = doms[i].dom.getAttribute('l-for');
        doms[i].dom.removeAttribute('l-for');
        if (window[val] != null) {
            for (let j = 0; j < window[val].length; j++) {
                let id = lid();
                doms[i].dom.setAttribute('id', id);
                html += doms[i].dom.outerHTML;
                ids.push(id);
            }
        }
        doms[i].dom.outerHTML = html;
        forNodeList.push({ dom: doms[i].dom, ids: ids, value: val, template: doms[i].dom.outerHTML });
    }

    return;
    for (var i = 0; i < fs.length; i++) {
        let f_id = lid();
        let ids = [];
        let html = '<div id="' + f_id + '" style="position:absolute;width:0;height:0;display:none;"></div>';
        let val = fs[i].getAttribute('l-for');

        fs[i].removeAttribute('l-for');
        if (window[val] != null) {
            for (let j = 0; j < window[val].length; j++) {
                let id = lid();
                fs[i].setAttribute('id', id);
                html += fs[i].outerHTML;
                ids.push(id);
            }
        }
        fs[i].outerHTML = html;

        forNodeList.push({ dom: document.getElementById(f_id), ids: ids, value: val, template: fs[i].outerHTML });
    }
}

var d = null;
function process_bind() {
    var clicks = document.querySelectorAll('[l-click]');
    for (var i = 0; i < clicks.length; i++) {
        let click_name = clicks[i].getAttribute('l-click');
        clicks[i].removeAttribute('l-click');
        clicks[i].onclick = function () {
            if (window[click_name] != null && window[click_name] != undefined && typeof window[click_name] == 'function') {
                window[click_name]();
            }
        }
    }
}

function process_text() {
    var ts = document.querySelectorAll('[l-t]');
    for (var i = 0; i < ts.length; i++) {
        let arr = _get_text(ts[i].textContent);
        for (var j = 0; j < arr.length; j++) {
            if(arr[j]!=''){
                
            }
        }
    }
}

function _update() {
    //更新for
    for (var i = 0; i < forNodeList.length; i++) {

    }
}


document.addEventListener('DOMContentLoaded', function () {
    process_for();
    process_bind();
    process_text();
});


//生成一个id
function lid() {
    let id = '';
    for (let i = 0; i < 10; i++) {
        id += c[parseInt(Math.random() * c.length)];
    }
    return id;
}


function _get_text(text) {
    let t_a = [];
    let temp = '';
    let begin = false;
    text = ' ' + text;
    for (var i = 0; i < text.length - 1; i++) {
        if (text[i] == ' ' && text[i + 1] == '.') {
            t_a.push(temp);
            temp = '';
            begin = true;
        }
        else if (text[i] == ' ' && begin) {
            t_a.push(temp);
            temp = '';
            begin = false;
        }
        else {
            temp += text[i];
        }
    }
    if (temp.length > 0) {
        t_a.push(temp);
    }
    return t_a;
}
