/**
 * Created by xuhang on 2016/11/16.
 */
$(function () {
    /*渲染标签列表*/
    var labels=$("#blogLabel");
    labels.html("");
    data.map(function (item) {
        labels.append('<li>' + item.label + '<span>(' + item.blogs.length + ')</span></li>');
    });

    /*查看标签下文章*/
    labels.find("li").click(function () {
        var num=$(this).find("span").text();
        num=parseInt(num.substring(1,num.length-1));
        if(num<=0){
            return false;
        }
        var text=$(this).text();
        var choData=data.find(function (item) {
            return text.indexOf(item.label)>=0;
        });
        if(choData==undefined){
            alert("该标签文章已被删除");
            return false;
        }
        $("#label-title").html(choData.label);
        var blogs=choData.blogs;
        $("#sub-menus").html("");

        blogs.map(function (item,index) {
            if(index==0){
                $("#pageNext").attr({"href": item.url,"data-label":choData.label,"data-num":index})
            }
            $("#sub-menus").append('<a href="' + item.url + '" data-type="page-transition" data-label="' + choData.label + '" data-num="' + index + '"><li>' + item.title + '</li></a>');
        });

        $(".my-info-index").addClass("open-sub-menus");
    });

    /*返回主视图*/
    $(".my-menu-back i").click(function () {
        $(".my-info-index").removeClass("open-sub-menus");
    })
});