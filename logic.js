"use strict"


var fs = require('fs');

// eng: search_eng
var search_eng = "百度";
var search_site = {
    "百度": "https://www.baidu.com/s?wd=",
    "必应": "https://cn.bing.com/search?q=",
    "雅虎": "https://search.yahoo.com/search?p=",
    "谷歌": "https://www.google.com.hk/search?q="
};

// 搜索建议回调函数
function handleResult(res) {
    $(".temp").remove();
    var result = res.g;
    if (!result) return;
    // 截取前n个搜索建议项
    var n = 7;
    if (result.length > n - 1) {
        result = result.slice(0, n)
    }
    if (!result) return;
    result.forEach(e => {
        var a = document.createElement("a");
        a.innerText = e.q;
        a.onclick = (e) => {
            var kwd = e.target.innerText;
            if (kwd.replace(/\s+/g, "") == "")
                return;
            $("#drop_sug").hide();
            $("#search").val(kwd);
            window.open(search_site[search_eng] + kwd, "_blank");
        };
        document.getElementById("drop_sug").appendChild(a);
    });
    $("#drop_sug").show();
}

// 更改设置
function set(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch (error) {
        console.log(error);
    }
}

// 获取设置
function get(key) {
    try {
        return localStorage.getItem(key);
    } catch (error) {
        console.log(error);
        return null;
    }
}

// 生成链接列表项
function generateLink(url, name, showicon) {
    var btn = document.createElement("button");
    btn.className = "btn_navi";
    btn.onclick = () => {
        window.open(url, "_blank");
    };

    if (showicon) {
        var img = document.createElement("img");
        img.className = "img_head";

        img.src = (url + "/favicon.ico").replace(/\/{2}(?=fav)/, "/");
        // 图片加载尝试数
        var i = 1;
        img.onerror = (e) => {
            if (i == 2) {
                img.style.display = "none";
                return;
            }
            i = 2;
            img.src = (url + "/favicon.ico").replace("///fav", "//fav");
        };
    }


    var a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.innerText = name;

    if (img) {
        if (btn) {
            btn.appendChild(img);
        }
    }
    btn.appendChild(a);
    return btn;
}

// 添加链接列表项
function addLink(url, name, pat = 1, showicon = true) {
    var item = generateLink(url, name, showicon);
    document.getElementById("c" + pat).appendChild(item);
}

// 初始化分区标题
function initPat(title, i) {
    var pat = document.getElementsByClassName("pat")[i];
    if (!pat) return;
    if (!title || title == "") return;

    var block = document.createElement("div");
    block.className = "blocktitle";
    block.innerText = title;
    pat.appendChild(block);
    var div = document.createElement("div");
    div.className = "list";
    div.id = "c" + (i + 1);
    pat.appendChild(div);
}

// 删除设置
function get(key) {
    try {
        return localStorage.getItem(key);
    } catch (error) {
        console.log(error);
        return null;
    }
}

$(function () {
    var title = ["划水", "学习"];
    for (var i = 1; i < title.length + 1; i++) {
        initPat(title[i - 1], i - 1);
    }


    addLink("https://www.ifeng.com/", "凤凰网");
    addLink("https://www.guancha.cn/", "观察者网");
    addLink("https://www.jitashe.org/", "吉他社");
    addLink("http://www.sobaidupan.com/", "度盘搜索");
    addLink("https://github.com/", "GitHub", 2);
    addLink("https://stackoverflow.com/", "StackOverflow", 2);
    addLink("http://www.runoob.com/", "菜鸟教程", 2);
    // 指定最后一个参数时，切记指定参数pat
    addLink("https://scholar.google.com.hk/?hl=zh-CN", "谷歌学术", 2, false);
    addLink("https://dict.hjenglish.com/", "多国词典", 2);
    var eng = get("eng");
    if (eng && eng != "") search_eng = eng;
    $(".dropbtn").text(search_eng);

    $(".dropbtn, #drop_eng").hover(
        () => { $("#drop_eng").show() },
        () => { $("#drop_eng").hide() }
    );

    $("#drop_sug").hover(
        () => { },
        () => { $("#drop_sug").hide() }
    );

    $(".combo_sear").click(function () {
        search_eng = this.firstChild.textContent;
        $(".dropbtn").text(search_eng);
        set("eng", search_eng);
        $("#drop_eng").hide();
    });

    function search() {
        var kwd = $("#search").val();
        if (kwd.replace(/\s+/g, "") == "")
            return;
        window.open(search_site[search_eng] + kwd, "_blank");
    };

    $(".btn_search").click(function () {
        search();
    });

    $("#search").keyup(function () {

        // 清除节点，简单粗暴
        document.getElementById("drop_sug").innerHTML = "";
        var kwd_tmp = $("#search").val();
        if (kwd_tmp.replace(/\s+/g, "") == "")
            return;
        var url = "https://www.baidu.com/sugrec?pre=1&p=3&ie=utf-8&json=1&prod=pc&from=pc_web&wd=" + kwd_tmp + "&req=2&bs=1&csor=1&cb=handleResult";

        // 跨域调用API
        var script = document.createElement("script");
        script.src = url;
        script.className = "temp";
        document.body.appendChild(script);

        // https://www.baidu.com/sugrec?pre=1&p=3&ie=utf-8&json=1&prod=pc&from=pc_web&wd=1&req=2&bs=1&csor=1&cb=fun&_=1555255427826
        // https://suggestqueries.google.com/complete/search?client=firefox&q=a&callback=__jp0
    });

    // 回车查询
    $("#search").keydown(function (event) {
        var e = event || window.event;
        var code = e.KeyCode || e.which;
        if (code == 13)
            search();
    });

    var playlist = document.getElementById("playlist");
    var player = document.getElementById("player");

    // 文件夹遍历
    fs.readdir("F:\\音乐", function (err, files) {
        if (err) {
            console.log(err);
            return;
        }
        console.log(files.length);
        files.forEach((f) => {
            if (f.indexOf(".mp3") > -1) {
                var a = document.createElement("a");
                a.className = "a_media";
                a.onclick = () => {
                    player.src = "F:\\音乐\\" + f;
                    player.play();
                };
                a.onmousedown = () => {
                    a.style.cssText = "background-color:gray;color:white";
                };
                a.onmouseup = () => {
                    a.style.cssText = "background-color:#f9f9f9;color:black";
                };
                a.innerText = f.replace(".mp3", "");
                playlist.appendChild(a);
            }
        });
    });
});