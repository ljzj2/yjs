let c = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
var forNodeList = [];
var textNodeList = [];

function process_for() {
    var fs = document.querySelectorAll('[l-for]');
    let doms = [];
    for (var i = 0; i < fs.length; i++) {
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
        let html = '<div ' + f_id + ' ></div>';
        let val = doms[i].dom.getAttribute('l-for');
        let template = doms[i].dom.outerHTML;
        let template_dom = doms[i].dom;
        doms[i].dom.removeAttribute('l-for');
        if (window[val.split('#')[0]] != null) {
            for (let j = 0; j < window[val.split('#')[0]].length; j++) {
                let id = lid();
                doms[i].dom = template_dom;
                doms[i].dom.setAttribute(id, '');

                //for-text
                forNodesValue(doms[i].dom, window[val.split('#')[0]][j], val.split('#').length > 1 ? val.split('#')[1] : '');
                //for-text

                html += doms[i].dom.outerHTML;
                ids.push(id);
                doms[i].dom.removeAttribute(id);
            }
        }
        doms[i].dom.outerHTML = html;
        let _dom = document.createComment(f_id);
        document.querySelector('[' + f_id + ']').replaceWith(_dom);
        forNodeList.push({ dom: _dom, ids: ids, value: val, template: template, value: val, val: window[val.split('#')[0]] });
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

var to_add = [];
function process_text() {
    var ts = document.querySelectorAll('[l-t]');
    for (var i = 0; i < ts.length; i++) {
        ts[i].removeAttribute('l-t');
        getNodes(ts[i]);
    }

    for (var i = 0; i < to_add.length; i++) {
        to_add[i]._dom.parentElement.insertBefore(to_add[i].dom, to_add[i]._dom);
        if (to_add[i].value[0] == '.' || (to_add[i].value[0] == ' ' && to_add[i].value[1] == '.')) {
            textNodeList.push({ dom: to_add[i].dom, value: to_add[i].value.replace('\n', '') });
        }
    }
    for (var i = 0; i < to_add.length; i++) {
        if (to_add[i]._dom != null && to_add[i]._dom != undefined && to_add[i]._dom.parentElement != null) {
            to_add[i]._dom.parentElement.removeChild(to_add[i]._dom);
        }
    }
}

function _update() {
    //更新for
    for (var i = 0; i < forNodeList.length; i++) {
        if (!_arr_equal(window[forNodeList[i].value], forNodeList[i].val)) {
            if (forNodeList[i].ids != null && forNodeList[i].ids != undefined && forNodeList[i].ids.length > 0) {
                for (var j = 0; j < forNodeList[i].ids.length; j++) {
                    document.querySelectorAll('[' + forNodeList[i].ids[j] + ']').outerHTML = '';
                }
            }
            var its = window[forNodeList[i].value];
            for (var i = 0; i < its.length; i++) {
                var d = document.createElement('div');
                d.outerHTML = forNodeList[i].template;
                document.body.insertBefore(forNodeList[i].dom);
            }
        }
    }

    //更新text
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
        id += c[parseInt(Math.random() * (i == 0 ? c.length - 10 : c.length))];
    }
    return id;
}


function _get_text(text) {
    let t_a = [];
    let temp = '';
    let begin = false;
    text = ' ' + text;
    for (var i = 0; i < text.length; i++) {
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


function getNodes(d) {
    for (var i = 0; i < d.childNodes.length; i++) {
        if (d.childNodes[i].nodeType == 1) {
            getNodes(d.childNodes[i])
        }
        if (d.childNodes[i].nodeType == 3) {
            var content = ' ' + d.childNodes[i].textContent;

            content = content.replace(/\n/g, '');
            if (content.indexOf(' .') >= 0) {
                var arr = _get_text(content);
                for (var j = 0; j < arr.length; j++) {
                    let val = window;
                    if (arr[j][0] == '.' || (arr[j].length > 1 && arr[j][0] == ' ' && arr[j][1] == '.')) {
                        let x = arr[j].split('.');
                        for (var n = 0; n < x.length; n++) {
                            if (x[n] != null && x[n] != undefined && x[n] != '' && x[n] != ' ') {
                                if (val != null && val != undefined) {
                                    val = val[x[n]];
                                }
                                else {
                                    val = '';
                                }
                            }
                        }
                    }
                    else {
                        val = arr[j];
                    }
                    if (val == undefined || typeof val == 'object') {
                        val = '';
                    }
                    to_add.push({ _dom: d.childNodes[i], dom: document.createTextNode(val), value: arr[j] });
                }
            }
        }
    }
}

function forNodesValue(d, val, name) {
    if (name == null || name == '' || name == undefined) {
        return;
    }
    let fors = []; console.log(d.textContent);
    for (var i = 0; i < d.childNodes.length; i++) {
        if (d.childNodes[i].nodeType == 1) {
            forNodesValue(d.childNodes[i], val);
        }
        if (d.childNodes[i].nodeType == 3) {
            let arr = d.childNodes[i].textContent.split('.' + name + '.');
            for (var j = 0; j < arr.length; j++) {
                var v = arr[j].split(' ');
                for (var n = 0; n < v.length; n++) {
                    if (v[n] != '' && val[v[n]] != null && val[v[n]] != '' && val[v[n]] != undefined) {
                        d.childNodes[i].textContent = (d.childNodes[i].textContent + ' ').replace('.' + name + '.' + v[n] + ' ', val[v[n]] + ' '); console.log(val[v[n]]);
                    }
                }
            }
        }
    }
}

function _getValue(n) {
    let arr = n.split('.');
    if (arr.length <= 0) {
        return '';
    }
    if (arr.length == 1) {
        return window[arr[0]];
    }
    let val = window;
    for (var i = 0; i < arr.length; i++) {
        val = val[arr[i]];
        if (val == undefined || val == null) {
            return '';
        }
    }
}

function _arr_equal(a, b) {
    if (!a || !b) {
        return false;
    }
    if (a.length != b.length) {
        return false;
    }
    if (a === b) {
        return true;
    }
    for (var i = 0; i < a.length; i++) {
        if (a[i] instanceof Array && b[i] instanceof Array) {
            if (!_arr_equal(a[i], b[i])) {
                return false;
            }
        }
        else if (a[i] != b[i]) {
            return false;
        }
    }
    return true;
}