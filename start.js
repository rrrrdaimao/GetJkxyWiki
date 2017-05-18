
var http = require("http"); // http 模块
var cheerio = require("cheerio"); //html 解析
var fs = require('fs'); // fs 模块

fs.mkdirSync('./极客学院Wiki/');//同步模式创建"极客学院Wiki"目录，用来存放所有wiki。
console.log('创建"极客学院Wiki"目录成功。');




http.get('http://wiki.jikexueyuan.com/' , function(res){
    var html;
    res.setEncoding('utf8');
    res.on('data', function( data ) {
        html += data;
    });
    res.on('end',function(){
        var $ = cheerio.load( html );
        var list = $('#jdropdown li');
        list.each(function(i){
            var Title = $(this).find('.hd').children('a').text();
            var Href = 'http://wiki.jikexueyuan.com/' + $(this).find('.hd').children('a').attr('href');
            fs.mkdir( './极客学院Wiki/'+Title+'/' , function( err ){
               if (err) {
                   return console.error(err);
               }
                console.log("子目录'"+Title+"'创建成功。");
                getWikipage( Href , './极客学院Wiki/'+Title+'/' );
            });
        });
    });
});



function getWikipage( url , path ){
    http.get( url , function ( res ) {
        var html;
        res.setEncoding('utf8');
        res.on('data', function( data ) {
            html += data;
        });
        res.on('end',function(){
            var $ = cheerio.load( html );
            if($('#page-nav').text() != ''){//抓取分页
                var page = $('#page-nav').find('a').length - 2;
                for(var i = 1 ; i <= page ; i ++ ){
                    getWikiChapter(url + '?page='+i , path);
                }
            }else{
                getWikiChapter(url , path);
            };
        });
    }); 
}

function getWikiChapter( url , path ){
    http.get( url , function ( res ) {
        var html;
        res.setEncoding('utf8');
        res.on('data', function( data ) {
            html += data;
        });
        res.on('end' , function(){
            var $ = cheerio.load( html );
            var wikilist = $('.thumbnail .border li');
            wikilist.each(function(i){
                var wikiTitle = $(this).find('h4').text();
                var wikiContent = $(this).find('.desc').children('a').text();
                var wikiHref = $(this).find('.desc').children('a').attr('href');
                var TxtContent =  '【wiki介绍】：\r\n'+wikiContent+'\r\n【链接】：\r\n'+wikiHref+'';
                newTxt( wikiTitle , TxtContent , path );
            });
        });
    });
}


function newTxt(Title , Content , path ){
    fs.writeFile
    (
        path+Title+'.txt' ,
        Content ,
        function(err) {
            if(err) {
                return console.log(err);
            }
            console.log('创建  "'+Title+'.txt"  成功！');
        }
    );
}











