# MyHomePage

## OverView
这是一个自定义的主页，目前支持搜索，自定义快速访问标签，本地音乐播放（？）

## Guide
主要逻辑在logic.js
133行函数指定分区及标签
213行指定本地音乐检索路径

## How to Deploy
需要安装npm包：require，browserify，brfs （npm install <package>）
使用如下命令生成：browserify -t brfs logic.js > bundle.js
