// 全局函数
// rest接口配置
var RestApi;
var attms;
if(localStorage.getItem('net_local') && localStorage.getItem('net_local') == '10.103.1.204'){
  RestApi = 'http://10.103.1.204/rest/index.php';
  attms = 'http://10.103.1.204/';
}else{
  RestApi = 'http://221.229.254.75:8080/rest/index.php';
  attms = 'http://221.229.254.75:8080/';
}
var Apistore = 'http://apistore.51daniu.cn/rest/index.php';
var currentVersion = "1.0.16120109";
// 获取是否是学员信息ID
var istea = localStorage.getItem('istea')?localStorage.getItem('istea'):1;
var z_userid = localStorage.getItem('userid');
var paihang_picker = [];

// 清除APP缓存
var shayCache = function(){
    window.cache.clear(function(){$.alert("缓存已清除",function(){$.alert("（设置-存储-应用-清除数据）","管理更多存储空间请打开")});},function(){});
};

// 系统升级检测
function updata_check(){
  $.post(RestApi, { c: 'index',a: 'updatecheck'}, function(response){
        console.log(response);
        var responseObj=$.parseJSON(response);
        if(responseObj.data.version && (responseObj.data.version != currentVersion)){
             setTimeout(function(){
                 $.confirm(responseObj.message, '升级提示', function () {
                      window.location.href = responseObj.data.android;
                 });
             },2000);
        }
  });
}

// 点击图形验证码切换
function tuxing_yanzheng(e){
    var n = parseInt(Math.random()*(9999999999-1000000000+1)+1000000000);
    $(e).attr('src','http://apistore.51daniu.cn/rest/index.php?c=index&a=checkcode&t='+n+'');
}

// 时间戳转日期
function getLocalTime(dateNum){
    var date=new Date(dateNum*1000);
    return date.getFullYear()+"-"+fixZero(date.getMonth()+1,2)+"-"+fixZero(date.getDate(),2);
    function fixZero(num,length){
        var str=""+num;
        var len=str.length;
        var s="";
        for(var i=length;i-- >len;){
            s+="0";
        }
        return s+str;
    }
}
//=====================enryStatusBar======Start===========================
var enryStatusBar = {
    Init:function(){
            document.addEventListener("deviceready", onDeviceReady, false);
            function onDeviceReady() {
                if(device.platform === 'Android')
                {
                  StatusBar.backgroundColorByHexString("#2b2a31");
                  StatusBar.show();
                }
            }
    }
};
// =====================enryStatusBar======Over===========================
// var intervalIDD = window.setInterval(function() { window.clearInterval(intervalIDD);enryStatusBar.Init();},1500);
window.setInterval(function() {enryStatusBar.Init();},1500);

// 首页红气泡
function index_red(){
    $.post(RestApi, { c: 'my',a: 'statistics'}, function(response){
        console.log(response);
        var responseObj = $.parseJSON(response);
        if(responseObj.code==200){
            if(responseObj.data != ''){
                if(responseObj.data.count_exam && responseObj.data.count_exam != 0){
                    if(Math.floor(responseObj.data.count_exam)>99){
                        $('#weikaoshi').html('99+').css('display','inline-block');
                    }else{
                        $('#weikaoshi').html(responseObj.data.count_exam).css('display','inline-block');
                    }
                }else{
                    $('#weikaoshi').html('0').css('display','none');
                }
                if(responseObj.data.count_course && responseObj.data.count_course != 0){
                    if(Math.floor(responseObj.data.count_course)>99){
                        $('#weikecheng').html('99+').css('display','inline-block');
                    }else{
                        $('#weikecheng').html(responseObj.data.count_course).css('display','inline-block');
                    }
                }else{
                    $('#weikecheng').html('0').css('display','none');
                }
                if(responseObj.data.count_questionnaire && responseObj.data.count_questionnaire != 0){
                    if(Math.floor(responseObj.data.count_questionnaire)>99){
                        $('#weidiaocha').html('99+').css('display','inline-block');
                    }else{
                        $('#weidiaocha').html(responseObj.data.count_questionnaire).css('display','inline-block');
                    }
                }else{
                    $('#weidiaocha').html('0').css('display','none');
                }
                if(responseObj.data.count_notice && responseObj.data.count_notice != 0){
                    if(Math.floor(responseObj.data.count_notice)>99){
                        $('#weitongzhi').html('99+').css('display','inline-block');
                    }else{
                        $('#weitongzhi').html(responseObj.data.count_notice).css('display','inline-block');
                    }
                }else{
                    $('#weitongzhi').html('0').css('display','none');
                }
            }
        }else if(responseObj.code==403){
            $.hidePreloader();
            $.alert(responseObj.message,function(){
                window.location.href = 'login.html';
            });
        }else{
            $.hidePreloader();
            $.alert(responseObj.message);
        }
    });
}

// 首页初始化
function index_init(){
    // 主页banner图
    $.post(RestApi, { c: 'cms',a: 'item'}, function(response){
        $.showPreloader('获取信息，请稍后...');
        console.log(response);
        var responseObj = $.parseJSON(response);
        if(responseObj.code==200){
            for(var i=0,item='';i<responseObj.data.length;i++){
                item += '<div class="swiper-slide"><div class="row"><a href="#index_banner_detail" class="no-transition" onclick="javascript:index_banner_detail('+responseObj.data[i].contentid+');"><img class="col-100" src="'+attms+responseObj.data[i].contentthumb+'" \/><\/a><\/div><\/div>';
            }
            $('.swiper-wrapper').html(item);
            $.hidePreloader();
        }else if(responseObj.code==403){
            window.location.href = 'login.html';
            $.hidePreloader();
        }else{
            $.hidePreloader();
            $.alert(responseObj.message);
        }
    });
}
// 课程页面初始化
function kecheng_init(){
    $.showPreloader('获取信息，请稍后...');
    $.post(RestApi, { c: 'course',a: 'course_cate'}, function(response){
        console.log(response);
        var responseObj = $.parseJSON(response);
        if(responseObj.code==200){
            for(var i=0,item='';i<responseObj.data.length;i++){
                item += '<div class="col-33">'+responseObj.data[i].catname+'<\/div>';
            }
            $('#kecheng_list').html('<div class="col-33 active">全<em><\/em>部<\/div>'+item);
            $.hidePreloader();
        }else if(responseObj.code==403){
            $.hidePreloader();
            $.alert(responseObj.message,function(){
                window.location.href = 'login.html';
            });
        }else{
            $.hidePreloader();
            $.alert(responseObj.message);
        }
    });
}
// 纯粹刷新课程页面分类菜单
function kecheng_list_shuaxin(){
    $.showPreloader('获取信息，请稍后...');
    $.post(RestApi, { c: 'course',a: 'course_cate'}, function(response){
        console.log(response);
        $.hidePreloader();
    });
}

// 课程筛选方法
function kecheng_choose(catname,orderby,tabs){
    if(catname && catname != ''){
        $('#shaixuan_title').html(catname);
    }else{
        $('#shaixuan_title').html('全部');
    }
    $('#kecheng_list div').each(function(){
        if($(this).html() == catname){
            $(this).addClass('active').siblings().removeClass('active');
        }
    });
    $.showPreloader('获取信息，请稍后...');
    $.post(RestApi, { c: 'course',a: 'course_list',catname:catname,orderby:orderby}, function(response){
        console.log(response);
        var responseObj = $.parseJSON(response);
        if(responseObj.code==200){
            if(responseObj.data != ''){
                for(var i=0,item='';i<responseObj.data.length;i++){
                    // item += '<a href="#page_index_del" class="no-transition" onclick="javascript:kecheng_list('+responseObj.data[i].csid+');"><img src="'+attms+responseObj.data[i].csthumb+'" \/><div><h1>'+responseObj.data[i].cstitle+'<\/h1><h2>'+responseObj.data[i].csdescribe+'<\/h2><h3><img src="img\/us.png" \/>已有<i>'+responseObj.data[i].download_num+'<\/i>人下载<\/h3><\/div><h1><\/h1><\/a>';
                    item += '<a href="#page_index_del" class="no-transition" onclick="javascript:kecheng_list('+responseObj.data[i].csid+');"><img src="'+attms+responseObj.data[i].csthumb+'" \/><div><h1>'+responseObj.data[i].cstitle+'<\/h1><h3><img src="img\/us.png" \/>已有<i>'+responseObj.data[i].download_num+'<\/i>人下载<\/h3><\/div><h1><\/h1><\/a>';
                }
                if(tabs == '' || tabs == null || tabs == undefined || tabs == 1){
                    $('#kecheng_list1').html(item);
                    $.hidePreloader();
                }else if(tabs == 2){
                    $('#kecheng_list2').html(item);
                    $.hidePreloader();
                }else if(tabs == 3){
                    $('#kecheng_list3').html(item);
                    $.hidePreloader();
                }
            }else{
                if(tabs == '' || tabs == null || tabs == undefined || tabs == 1){
                    $('#kecheng_list1').html('');
                    $.hidePreloader();
                }else if(tabs == 2){
                    $('#kecheng_list2').html('');
                    $.hidePreloader();
                }else if(tabs == 3){
                    $('#kecheng_list3').html('');
                    $.hidePreloader();
                }
                $.hidePreloader();
                $.toast(responseObj.message);
            }
        }else if(responseObj.code==403){
            $.hidePreloader();
            $.alert(responseObj.message,function(){
                window.location.href = 'login.html';
            });
        }else{
            $.hidePreloader();
            $.alert(responseObj.message);
        }
    });
}

// banner列表页
function index_banner_list(){
    $.showPreloader('获取信息，请稍后...');
    $.post(RestApi, { c: 'cms',a: 'cms_list'}, function(response){
        console.log(response);
        var responseObj = $.parseJSON(response);
        if(responseObj.code==200){
            for(var i=0,item='';i<responseObj.data.length;i++){
                item += '<a href="#index_banner_detail" class="no-transition" onclick="javascript:index_banner_detail('+responseObj.data[i].contentid+');"><h1>'+responseObj.data[i].contenttitle+'<\/h1><h2>'+responseObj.data[i].contentinputtime+'<\/h2><\/a>';
            }
            $('#banner_list').html(item);
            $.hidePreloader();
        }else if(responseObj.code==403){
            $.hidePreloader();
            $.alert(responseObj.message,function(){
                window.location.href = 'login.html';
            });
        }else{
            $.hidePreloader();
            $.alert(responseObj.message);
        }
    });
}
// banner 详情页
function index_banner_detail(id){
    $.showPreloader('获取信息，请稍后...');
    $.post(RestApi, { c: 'cms',a: 'cms_detail',contentid:id}, function(response){
        console.log(response);
        var responseObj = $.parseJSON(response);
        if(responseObj.code==200){
            $('#contenttitle').html(responseObj.data[0].contenttitle);
            $('#contentusername').html('发起人：'+responseObj.data[0].contentusername+'<i>'+responseObj.data[0].contentinputtime+'<\/i>');
            var re = new RegExp("\r\n", "g");
            $('#contenttext').html(responseObj.data[0].contenttext.replace(re,'<\/br><em style="text-indent:2em;display:inline-block;">&nbsp;<\/em>'));

            // 跳转链接
            if(responseObj.data[0].readlink && responseObj.data[0].readlink == 'course'){// 课程跳转
                $('#content_tiaozhuan').show().html('马上进入课程详情页&nbsp;&gt;&nbsp;&gt;').attr('onclick','javascript:kecheng_list('+responseObj.data[0].readlinkid+');').attr('href','#page_index_del');
            }else if(responseObj.data[0].readlink && responseObj.data[0].readlink == 'exam'){// 考试跳转
                $('#content_tiaozhuan').hide();
            }else if(responseObj.data[0].readlink && responseObj.data[0].readlink == 'quest'){// 问卷跳转
                $('#content_tiaozhuan').show().html('马上进入调查问卷&nbsp;&gt;&nbsp;&gt;').attr('onclick','javascript:diaochawenjuan_detail('+responseObj.data[0].readlinkid+');').attr('href','#index_diaocha_detail');
            }else{
                $('#content_tiaozhuan').hide();
            }
            $.hidePreloader();
        }else if(responseObj.code==403){
            $.hidePreloader();
            $.alert(responseObj.message,function(){
                window.location.href = 'login.html';
            });
        }else{
            $.hidePreloader();
            $.alert(responseObj.message);
        }
    });
}
// 课程详情页
function kecheng_list(id,huifu){
    if(huifu && huifu == 1){
        $.showPreloader('获取信息，请稍后...');
        $.post(RestApi, { c: 'course',a: 'course_detail',csid:id}, function(response){
            console.log(response);
            var responseObj = $.parseJSON(response);
            if(responseObj.code==200){
                var collect = '';
                var cslink = responseObj.data.course_detail[0].cslink;
                if(responseObj.data.status && responseObj.data.status == 1){
                    collect = 'style="color:red;"';
                }else{
                    collect = '';
                }
                // 判断文件格式（mp4,ppt,doc,pdf）
                if(cslink && cslink.substr(cslink.length-3,cslink.length) == 'mp4' || cslink && (cslink.substr(cslink.length-3,cslink.length) == 'ppt' || cslink.substr(cslink.length-3,cslink.length) == 'pdf') || cslink.substr(cslink.length-3,cslink.length) == 'doc'){
                    $('#cslink').attr('onclick','javascript:open_file("'+attms+cslink+'",'+responseObj.data.course_detail[0].csid+',\''+cslink.substr(cslink.length-3,cslink.length)+'\');');
                    $('#xiazai').attr('onclick','javascript:open_file("'+attms+cslink+'",'+responseObj.data.course_detail[0].csid+',\''+cslink.substr(cslink.length-3,cslink.length)+'\');');
                }else if(cslink && (cslink.substr(cslink.length-4,cslink.length) == 'pptx' || cslink.substr(cslink.length-4,cslink.length) == 'pdfx') || cslink.substr(cslink.length-4,cslink.length) == 'docx'){
                    $('#cslink').attr('onclick','javascript:open_file("'+attms+cslink+'",'+responseObj.data.course_detail[0].csid+',\''+cslink.substr(cslink.length-4,cslink.length)+'\');');
                    $('#xiazai').attr('onclick','javascript:open_file("'+attms+cslink+'",'+responseObj.data.course_detail[0].csid+',\''+cslink.substr(cslink.length-4,cslink.length)+'\');');
                }else{
                    $('#cslink').attr('onclick','');
                    $('#xiazai').attr('onclick','');
                }

                $('#cslink').css('background-image','url('+attms+responseObj.data.course_detail[0].csthumb+')');
                $('#cstitle').html(responseObj.data.course_detail[0].cstitle);
                $('#cstitle1').html(responseObj.data.course_detail[0].cstitle+'<div class="collect_star" '+collect+' onclick="javascript:kecheng_collect('+responseObj.data.course_detail[0].collect_num+');"><a class="icon icon-star pull-left open-panel" '+collect+'><\/a><\/br>'+responseObj.data.course_detail[0].collect_num+'<\/div>');
                $('#csdescribe').html(responseObj.data.course_detail[0].csdescribe);
                $('#cun1').val(responseObj.data.course_detail[0].csid);
                for(var i=0,item='';i<responseObj.data.comments.length;i++){
                    var photo = responseObj.data.comments[i].photo;
                    if(photo.indexOf('http://cdn.51daniu.cn/') == -1){
                        photo = attms+responseObj.data.comments[i].photo;
                    }else{
                        photo = responseObj.data.comments[i].photo;
                    }
                    item += '<li><div class="left"><img src="'+photo+'" \/><\/div><div class="right"><h1>'+responseObj.data.comments[i].username+' <i>'+responseObj.data.comments[i].cmttime+'<\/i><\/h1><h2>'+responseObj.data.comments[i].cmtcontent+'<\/h2><\/div><h1><\/h1><\/li>';
                }
                $('#comments').html(item);
                $('.content')[0].scrollTop=$('.content')[0].scrollHeight;
                $.hidePreloader();
            }else if(responseObj.code==403){
                $.hidePreloader();
                $.alert(responseObj.message,function(){
                    window.location.href = 'login.html';
                });
            }else{
                $.hidePreloader();
                $.alert(responseObj.message);
            }
        });
    }else{
        $.showPreloader('获取信息，请稍后...');
        $.post(RestApi, { c: 'course',a: 'course_detail',csid:id}, function(response){
            console.log(response);
            var responseObj = $.parseJSON(response);
            if(responseObj.code==200){
                var collect = '';
                var cslink = responseObj.data.course_detail[0].cslink;
                if(responseObj.data.status && responseObj.data.status == 1){
                    collect = 'style="color:red;"';
                }else{
                    collect = '';
                }
                // 判断文件格式（mp4,ppt,doc,pdf）
                if(cslink && cslink.substr(cslink.length-3,cslink.length) == 'mp4' || cslink && (cslink.substr(cslink.length-3,cslink.length) == 'ppt' || cslink.substr(cslink.length-3,cslink.length) == 'pdf') || cslink.substr(cslink.length-3,cslink.length) == 'doc'){
                    $('#cslink').attr('onclick','javascript:open_file("'+attms+cslink+'",'+responseObj.data.course_detail[0].csid+',\''+cslink.substr(cslink.length-3,cslink.length)+'\');');
                    $('#xiazai').attr('onclick','javascript:open_file("'+attms+cslink+'",'+responseObj.data.course_detail[0].csid+',\''+cslink.substr(cslink.length-3,cslink.length)+'\');');
                }else if(cslink && (cslink.substr(cslink.length-4,cslink.length) == 'pptx' || cslink.substr(cslink.length-4,cslink.length) == 'pdfx') || cslink.substr(cslink.length-4,cslink.length) == 'docx'){
                    $('#cslink').attr('onclick','javascript:open_file("'+attms+cslink+'",'+responseObj.data.course_detail[0].csid+',\''+cslink.substr(cslink.length-4,cslink.length)+'\');');
                    $('#xiazai').attr('onclick','javascript:open_file("'+attms+cslink+'",'+responseObj.data.course_detail[0].csid+',\''+cslink.substr(cslink.length-4,cslink.length)+'\');');
                }else{
                    $('#cslink').attr('onclick','');
                    $('#xiazai').attr('onclick','');
                }
                $('#cslink').css('background-image','url('+attms+responseObj.data.course_detail[0].csthumb+')');
                $('#cstitle').html(responseObj.data.course_detail[0].cstitle);
                $('#cstitle1').html(responseObj.data.course_detail[0].cstitle+'<div class="collect_star" '+collect+' onclick="javascript:kecheng_collect('+responseObj.data.course_detail[0].collect_num+');"><a class="icon icon-star pull-left open-panel" '+collect+'><\/a><\/br>'+responseObj.data.course_detail[0].collect_num+'<\/div>');
                $('#csdescribe').html(responseObj.data.course_detail[0].csdescribe);
                $('#cun1').val(responseObj.data.course_detail[0].csid);
                for(var i=0,item='';i<responseObj.data.comments.length;i++){
                    var photo = responseObj.data.comments[i].photo;
                    if(photo.indexOf('http://cdn.51daniu.cn/') == -1){
                        photo = attms+responseObj.data.comments[i].photo;
                    }else{
                        photo = responseObj.data.comments[i].photo;
                    }
                    item += '<li><div class="left"><img src="'+photo+'" \/><\/div><div class="right"><h1>'+responseObj.data.comments[i].username+' <i>'+responseObj.data.comments[i].cmttime+'<\/i><\/h1><h2>'+responseObj.data.comments[i].cmtcontent+'<\/h2><\/div><h1><\/h1><\/li>';
                }
                $('#comments').html(item);
                $.hidePreloader();
            }else if(responseObj.code==403){
                $.hidePreloader();
                $.alert(responseObj.message,function(){
                    window.location.href = 'login.html';
                });
            }else{
                $.hidePreloader();
                $.alert(responseObj.message);
            }
        });
    }
}
// 课程详情页评论
function kecheng_pinglun(){
    if($('#kecheng_pl').val() != '' && $('#kecheng_pl').val() != ' '){
        $.showPreloader('正在提交，请稍后...');
        $.post(RestApi, { c: 'course',a: 'comment',csid:$('#cun1').val(),cmtcontent:$('#kecheng_pl').val()}, function(response){
            console.log(response);
            var responseObj = $.parseJSON(response);
            if(responseObj.code==200){
                $.toast(responseObj.message);
                kecheng_list($('#cun1').val(),1);
                $.hidePreloader();
            }else if(responseObj.code==403){
                $.hidePreloader();
                $.alert(responseObj.message,function(){
                    window.location.href = 'login.html';
                });
            }else{
                $.hidePreloader();
                $.alert(responseObj.message);
            }
        });
    }else{
        $.alert('输入内容不能为空');
    }
}
// 课程详情页收藏
function kecheng_collect(num){
    $.post(RestApi, { c: 'course',a: 'collect',csid:$('#cun1').val()}, function(response){
        console.log(response);
        var responseObj = $.parseJSON(response);
        if(responseObj.code==200){
            $.toast(responseObj.message);
            if(responseObj.message == '收藏成功'){
                $('.collect_star').html('<a style="color:red;" class="icon icon-star pull-left open-panel"><\/a><\/br>'+parseInt(num+1)).css('color','red');
            }
        }else if(responseObj.code==403){
            $.hidePreloader();
            $.alert(responseObj.message,function(){
                window.location.href = 'login.html';
            });
        }else{
            $.alert(responseObj.message);
        }
    });
}
// 调查问卷列表
function diaochawenjuan_list(){
    $.showPreloader('获取信息，请稍后...');
    $.post(RestApi, { c: 'questionnaire',a: 'questionnaire_list'}, function(response){
        console.log(response);
        var responseObj = $.parseJSON(response);
        if(responseObj.code==200){
            if(responseObj.data != ''){
                for(var i=0,item='',zhuangtai='',tiaozhuan='',xiangqing='';i<responseObj.data.length;i++){
                    if(responseObj.data[i].status == '已结束' || responseObj.data[i].status == '已参与'){
                        zhuangtai = ' class="active"';
                        tiaozhuan = '#';
                        xiangqing = '';
                    }else{
                        zhuangtai = '';
                        tiaozhuan = '#index_diaocha_detail';
                        xiangqing = 'diaochawenjuan_detail('+responseObj.data[i].subjectid+')';
                    }
                    item += '<li><h1>'+responseObj.data[i].subject+'<i'+zhuangtai+'>'+responseObj.data[i].status+'<\/i><\/h1><h2>截止日期 '+responseObj.data[i].etime+'<a href="'+tiaozhuan+'"'+zhuangtai+' onclick="javascript:'+xiangqing+';" class="no-transition">参与调查<\/a><\/h2><\/li>';
                }
                $('#wenjuan_list').html(item);
            }else{
                $('#wenjuan_list').html('<h1 style="text-align:center;font-size:0.8rem;padding:1rem;">'+responseObj.message+'<\/h1>');
            }
            $.hidePreloader();
        }else if(responseObj.code==403){
            $.hidePreloader();
            $.alert(responseObj.message,function(){
                window.location.href = 'login.html';
            });
        }else{
            $.hidePreloader();
            $.alert(responseObj.message);
        }
    });
}
// 调查问卷详情页
function diaochawenjuan_detail(id){
    $.showPreloader('获取信息，请稍后...');
    $.post(RestApi, { c: 'questionnaire',a: 'questionnaire_detail',subjectid:id}, function(response){
        console.log(response);
        var responseObj = $.parseJSON(response);
        if(responseObj.code==200){
            $('#wenjuan_detail_name').html(responseObj.data.title.subject);
            $('#wenjuan_detail_time').html('截止日期'+responseObj.data.title.etime);
            $('#wenjuan_detail_sub').attr('onclick','javascript:diaochawenjuan_sub('+responseObj.data.title.subjectid+','+responseObj.data.detail.length+');');
            for(var i=0,item='';i<responseObj.data.detail.length;i++){
                var question = responseObj.data.detail[i].questionselect;
                question = question.split('\r\n');
                var duoxuan = '';
                if(responseObj.data.detail[i].question.indexOf('可多选') == -1){
                    duoxuan = 'radio';
                }else{
                    duoxuan = 'checkbox';
                }
                for(var n=0,item_que='';n<question.length;n++){
                    if(question[n] != ''){
                        item_que += '<li><label class="label-checkbox item-content"><input class="radio_diaocha_list" type="'+duoxuan+'" name="radio_diaocha_list'+id+i+'" value="'+responseObj.data.detail[i].questionid+'"><div class="item-media"><i class="icon icon-form-checkbox"><\/i>'+question[n]+'<\/div><\/label><\/li>';
                    }
                }
                item += '<h2>'+parseInt(i+1)+'、'+responseObj.data.detail[i].question+'<\/h2><ul>'+item_que+'<\/ul>';
            }
            $('#wenjuan_detail_question').html(item);
            $.hidePreloader();
        }else if(responseObj.code==403){
            $.hidePreloader();
            $.alert(responseObj.message,function(){
                window.location.href = 'login.html';
            });
        }else{
            $.hidePreloader();
            $.alert(responseObj.message);
        }
    });
}
// 调查问卷提交
function diaochawenjuan_sub(id,n){
    // 获取选中项
    var arr = [];
    $('.radio_diaocha_list:checked').each(function(){
        arr.push($(this).val()+$(this).siblings(".item-media").html().replace('<i class="icon icon-form-checkbox"><\/i>','').substring(0,1));
    });
    // 获取选中项结束
    $.showPreloader('正在提交，请稍后...');
    $.post(RestApi, { c: 'questionnaire',a: 'commit_questionnaire',subjectid:id,answers:arr.join(',')}, function(response){
        console.log(response);
        var responseObj = $.parseJSON(response);
        if(responseObj.code==200){
            $.hidePreloader();
            $.alert(responseObj.message,function(){
                $.router.back();
                $.pullToRefreshTrigger('.pull-to-refresh-content-wenjuan');
            });
        }else if(responseObj.code==403){
            $.hidePreloader();
            $.alert(responseObj.message,function(){
                window.location.href = 'login.html';
            });
        }else{
            $.hidePreloader();
            $.alert(responseObj.message);
        }
    });
}

// 业务导师列表
function daoshi_list(){
    $.showPreloader('获取信息，请稍后...');
    $.post(RestApi, { c: 'course',a: 'tech_list'}, function(response){
        console.log(response);
        var responseObj = $.parseJSON(response);
        if(responseObj.code==200){
            if(responseObj.data != ''){
                for(var i=0,item='';i<responseObj.data.length;i++){
                    var photo = responseObj.data[i].photo;
                    if(photo.indexOf('http://cdn.51daniu.cn/') == -1){
                        photo = attms+responseObj.data[i].photo;
                    }else{
                        photo = responseObj.data[i].photo;
                    }
                    item += '<li><img src="'+photo+'" \/><div><h1>'+responseObj.data[i].username+'<a href="#index_zaixian_detail" class="no-transition" onclick="javascript:daoshi_detail('+responseObj.data[i].userid+');">在线交流<\/a><\/h1><h2>'+responseObj.data[i].userdescribe+'<\/h2><h3><img src="img\/us.png" \/>已有'+responseObj.data[i].quiz_num+'人提问<\/h3><\/div><h1><\/h1><\/li>';
                }
                $('#daoshi_list').html(item);
            }else{
                $('#daoshi_list').html('<h1 style="text-align:center;font-size:0.8rem;padding:1rem;">'+responseObj.message+'<\/h1>');
            }
            $.hidePreloader();
        }else if(responseObj.code==403){
            $.hidePreloader();
            $.alert(responseObj.message,function(){
                window.location.href = 'login.html';
            });
        }else{
            $.hidePreloader();
            $.alert(responseObj.message);
        }
    });
}
// 业务导师详情页
function daoshi_detail(id){
    daoshi_detail_my(id);
    $.showPreloader('获取信息，请稍后...');
    $.post(RestApi, { c: 'course',a: 'chat_list_all',userid:id}, function(response){
        console.log(response);
        var responseObj = $.parseJSON(response);
        if(responseObj.code==200){
            var photo = responseObj.data.teacher[0].photo;
            if(photo.indexOf('http://cdn.51daniu.cn/') == -1){
                photo = attms+responseObj.data.teacher[0].photo;
            }else{
                photo = responseObj.data.teacher[0].photo;
            }
            $('#chat_list_all_username').html(responseObj.data.teacher[0].username+'<a href="#">在线交流<\/a>');
            $('#chat_list_all_photo').attr('src',photo);
            $('#chat_list_all_userdescribe').html(responseObj.data.teacher[0].userdescribe);
            $('#chat_list_all_quiz_num').html(responseObj.data.teacher[0].quiz_num);
            $('#jiaoliu_my').attr('onclick','javascript:daoshi_detail_my('+id+');');
            $('#jiaoliu_all').attr('onclick','javascript:daoshi_detail('+id+');');
            $('#cun_daoshi_id').val(responseObj.data.teacher[0].userid);

            // 所有交流
            if(responseObj.data.chat != ''){
                for(var i=0,item='';i<responseObj.data.chat.length;i++){
                    var photo = responseObj.data.chat[i].photo;
                    var reply = responseObj.data.chat[i].reply;
                    if(photo.indexOf('http://cdn.51daniu.cn/') == -1){
                        photo = attms+responseObj.data.chat[i].photo;
                    }else{
                        photo = responseObj.data.chat[i].photo;
                    }
                    if(reply != ''){
                        reply = '<h3><i>['+reply.replyusername+'回复]:<\/i>'+reply.replycontent+'<\/h3>';
                    }else{
                        reply = '';
                    }
                    item += '<li><div class="left"><img src="'+photo+'" \/><\/div><div class="right"><h1>'+responseObj.data.chat[i].username+' <i>'+responseObj.data.chat[i].answertime+'<\/i><\/h1><h2>'+responseObj.data.chat[i].answercontent+'<\/h2>'+reply+'<\/div><h1><\/h1><\/li>';
                }
                $('#daoshi_detail_all').html(item);
                $.hidePreloader();
            }else{
                $('#daoshi_detail_all').html('<h1 style="text-align:center;font-size:0.8rem;padding:1rem;">暂无交流<\/h1>');
                $.hidePreloader();
            }
        }else if(responseObj.code==403){
            $.hidePreloader();
            $.alert(responseObj.message,function(){
                window.location.href = 'login.html';
            });
        }else{
            $.hidePreloader();
            $.alert(responseObj.message);
        }
    });
}
// 业务导师我的交流列表
function daoshi_detail_my(id){
    $('#daoshi_detail_mychat').attr('onclick','javascript:daoshi_detail_mychat('+id+');');
    $.showPreloader('获取信息，请稍后...');
    $.post(RestApi, { c: 'course',a: 'chat_list_my',userid:id}, function(response){
        console.log(response);
        var responseObj = $.parseJSON(response);
        if(responseObj.code==200){
            if(responseObj.data.chat != ''){
                for(var i=0,item='';i<responseObj.data.chat.length;i++){
                    var photo = responseObj.data.chat[i].photo;
                    var reply =  responseObj.data.chat[i].reply;
                    if(photo.indexOf('http://cdn.51daniu.cn/') == -1){
                        photo = attms+responseObj.data.chat[i].photo;
                    }else{
                        photo = responseObj.data.chat[i].photo;
                    }
                    if(reply != ''){
                        reply = '<h3><i>['+reply.replyusername+'回复]:<\/i>'+reply.replycontent+'<\/h3>';
                    }else{
                        reply = '';
                    }
                    item += '<li><div class="left"><img src="'+photo+'" \/><\/div><div class="right"><h1>'+responseObj.data.chat[i].username+' <i>'+responseObj.data.chat[i].answertime+'<\/i><\/h1><h2>'+responseObj.data.chat[i].answercontent+'<\/h2>'+reply+'<\/div><h1><\/h1><\/li>';
                }
                $('#daoshi_detail_my').html(item);
                $('.content')[2].scrollTop=$('.content')[2].scrollHeight;
                $.hidePreloader();
            }else{
                $.hidePreloader();
                $('#daoshi_detail_my').html('<h1 style="text-align:center;font-size:0.8rem;padding:1rem;">暂无交流<\/h1>');
            }
        }else if(responseObj.code==403){
            $.hidePreloader();
            $.alert(responseObj.message,function(){
                window.location.href = 'login.html';
            });
        }else{
            $.hidePreloader();
            $.alert(responseObj.message);
        }
    });
}
// 业务导师我的交流 在线提问
function daoshi_detail_mychat(id){
    if($('#daoshi_detail_mychat_con').val() != ''){
        $.showPreloader('正在提交，请稍后...');
        $.post(RestApi, { c: 'course',a: 'chat_online',userid:id,answercontent:$('#daoshi_detail_mychat_con').val()}, function(response){
            console.log(response);
            var responseObj = $.parseJSON(response);
            if(responseObj.code==200){
                $.hidePreloader();
                $.toast(responseObj.message);
                $('#daoshi_detail_mychat_con').val('');
                daoshi_detail_my(id);
            }else if(responseObj.code==403){
                $.hidePreloader();
                $.alert(responseObj.message,function(){
                    window.location.href = 'login.html';
                });
            }else{
                $.hidePreloader();
                $.alert(responseObj.message);
            }
        });
    }else{
        $.alert('请输入提问内容！');
    }
}
// 业务导师（我是导师）所有留言
function daoshi_detail_imtea(){
    $.showPreloader('获取信息，请稍后...');
    $.post(RestApi, { c: 'course',a: 'chat_list_all',userid:z_userid}, function(response){
        console.log(response);
        var responseObj = $.parseJSON(response);
        if(responseObj.code==200){
            // 所有交流
            if(responseObj.data.chat != ''){
                for(var i=0,item='';i<responseObj.data.chat.length;i++){
                    var photo = responseObj.data.chat[i].photo;
                    var reply = responseObj.data.chat[i].reply;
                    if(photo.indexOf('http://cdn.51daniu.cn/') == -1){
                        photo = attms+responseObj.data.chat[i].photo;
                    }else{
                        photo = responseObj.data.chat[i].photo;
                    }
                    if(reply != ''){
                        reply = '<h3><i>[我的回复]:<\/i>'+reply.replycontent+'<\/h3>';
                    }else{
                        reply = '';
                    }
                    item += '<a href="#index_zaixian_daoshi_huifu" class="no-transition" onclick="javascript:cundaoshi_huifuid('+responseObj.data.chat[i].answerid+');"><div class="left"><img src="'+photo+'" \/><\/div><div class="right"><h1>'+responseObj.data.chat[i].username+'<i>'+responseObj.data.chat[i].answertime+'<\/i><\/h1><h2>'+responseObj.data.chat[i].answercontent+'<\/h2>'+reply+'<\/div><h1><\/h1><\/a>';
                }
                $('#daoshi_imdaoshi').html(item);
                $.hidePreloader();
            }else{
                $('#daoshi_imdaoshi').html('<h1 style="text-align:center;font-size:0.8rem;padding:1rem;">暂无留言<\/h1>');
                $.hidePreloader();
            }
        }else if(responseObj.code==403){
            $.hidePreloader();
            $.alert(responseObj.message,function(){
                window.location.href = 'login.html';
            });
        }else{
            $.hidePreloader();
            $.toast(responseObj.message);
        }
    });
}
// 业务导师（我是导师）存回复ID
function cundaoshi_huifuid(id){
    $('#cun_daoshi_huifu_id').val(id);
}
// 业务导师（我是导师）回复
function daoshi_detail_imtea_huifu(){
    var content = $('#imdaoshi_huifu_con').val();
    var answerid = $('#cun_daoshi_huifu_id').val();
    if(content != ''){
        $.showPreloader('正在提交，请稍后...');
        $.post(RestApi, { c: 'course',a: 'reply_online',answerid:answerid,replycontent:content}, function(response){
            console.log(response);
            var responseObj = $.parseJSON(response);
            if(responseObj.code==200){
                $.hidePreloader();
                $.alert(responseObj.message,function(){
                    $('#imdaoshi_huifu_con').val('');
                    $.router.back();
                    $.pullToRefreshTrigger('.pull-to-refresh-content-imdaoshi');
                });
            }else if(responseObj.code==403){
                $.hidePreloader();
                $.alert(responseObj.message,function(){
                    window.location.href = 'login.html';
                });
            }else{
                $.hidePreloader();
                $.alert(responseObj.message);
            }
        });
    }else{
        $.alert('输入内容不能为空！');
    }
}

// 模式章节列表
function moshi_detail(id,name){
    $('.xuyaoshanchu').remove();
    $.showPreloader('获取信息，请稍后...');
    $.post(RestApi, { c: 'exam',a: 'exam_list',subject:id}, function(response){
        console.log(response);
        var responseObj = $.parseJSON(response);
        if(responseObj.code==200){
            $('#moshi_title').html(name);
            if(responseObj.data != ''){
                if(name == '考试模式'){
                    for(var i=0,item='',tiaozhuan='',lianjie='',status='';i<responseObj.data.length;i++){
                        if(responseObj.data[i].start && responseObj.data[i].start != ''){
                            tiaozhuan = 'panduan_time('+responseObj.data[i].start+','+responseObj.data[i].end+','+responseObj.data[i].examid+',\''+responseObj.data[i].exam+'\','+responseObj.data[i].basicid+',\''+responseObj.data[i].basic+'\')';
                            lianjie = '';
                        }else{
                            tiaozhuan = 'moshi_start(\''+id+'\','+responseObj.data[i].examid+',\''+name+'\',\''+responseObj.data[i].exam+'\','+responseObj.data[i].basicid+',\''+responseObj.data[i].basic+'\')';
                            lianjie = 'routers-index-3-1-1';
                        }
                        if(responseObj.data[i].status == '已参加'){
                            status = '（已参加）';
                        }else{
                            status = '';
                        }
                        item += '<li><a href="#'+lianjie+'" class="no-transition" onclick="javascript:'+tiaozhuan+';">'+responseObj.data[i].basic+status+'<i>'+responseObj.data[i].exam+'<\/i><\/a><\/li>';
                    }
                    $('#moshi_list_neirong').html(item);
                    $.hidePreloader();
                }else{
                    for(var i=0,item='';i<responseObj.data.length;i++){
                        item += '<li><a href="#routers-index-3-1-1" class="no-transition" onclick="javascript:moshi_start(\''+id+'\','+responseObj.data[i].examid+',\''+name+'\',\''+responseObj.data[i].exam+'\','+responseObj.data[i].basicid+',\''+responseObj.data[i].basic+'\');">'+responseObj.data[i].basic+'<i>'+responseObj.data[i].exam+'<\/i><\/a><\/li>';
                    }
                    $('#moshi_list_neirong').html(item);
                    $.hidePreloader();
                }
            }else{
                $('#moshi_list_neirong').html('');
                $.hidePreloader();
            }
        }else if(responseObj.code==403){
            $.hidePreloader();
            $.alert(responseObj.message,function(){
                window.location.href = 'login.html';
            });
        }else{
            $.hidePreloader();
            $.alert(responseObj.message);
        }
    });
}
// 模式开始答题页面
function moshi_start(subjectid,id,title,name,basicid,basic,is_jishi,is_jishi_s){
    $.showPreloader('获取信息，请稍后...');
    $.post(RestApi, { c: 'exam',a: 'start_exam',examid:id}, function(response){
        console.log(response);
        var responseObj = $.parseJSON(response);
        if(responseObj.code==200){
            $('#start_moshi_title').html(title);
            $('#start_moshi_name').html(basic+'<i>'+name+'<\/i>');
            $('#start_moshi_content').html(responseObj.data.examdescribe);
            if(subjectid == '练习'){
                $('#start_moshi_time').hide();
                $('#start_moshi_time_jishi').hide();
                $('#start_moshi_anniu').html('开始练习').attr('onclick','javascript:moshi_start_tiku('+id+',\''+title+'\',\''+subjectid+'\','+basicid+');');
            }else if(subjectid == '闯关'){
                $('#start_moshi_time').show().html('闯关时长：'+responseObj.data.examtime+'分钟');
                $('#start_moshi_anniu').html('开始闯关').attr('onclick','javascript:moshi_start_tiku('+id+',\''+title+'\',\''+subjectid+'\','+basicid+');');
            }else if(subjectid == '考试'){
                $('#start_moshi_time').show().html('考试时长：'+responseObj.data.examtime+'分钟');
                if(is_jishi){
                    $('#start_moshi_time_jishi').show().html('考试时间：'+getLocalTime(is_jishi_s)+'到'+getLocalTime(is_jishi));
                    $('#start_moshi_anniu').html('开始考试').attr('onclick','javascript:moshi_start_tiku('+id+',\''+title+'\',\''+subjectid+'\','+basicid+','+responseObj.data.examtime+','+is_jishi+');');
                }else{
                    $('#start_moshi_time_jishi').hide();
                    $('#start_moshi_anniu').html('开始考试').attr('onclick','javascript:moshi_start_tiku('+id+',\''+title+'\',\''+subjectid+'\','+basicid+','+responseObj.data.examtime+');');
                }
            }else{
                $('#start_moshi_time').hide();
                $('#start_moshi_time_jishi').hide();
            }
            $.hidePreloader();
        }else if(responseObj.code==403){
            $.hidePreloader();
            $.alert(responseObj.message,function(){
                window.location.href = 'login.html';
            });
        }else{
            $.hidePreloader();
            $.alert(responseObj.message);
        }
    });
}
// 模式开始答题(题库)
function moshi_start_tiku(id,title,subjectid,basicid,time,is_jishi){
    if(is_jishi){
        timer_jishi = setInterval(function(){
            var mydate = new Date();
            var now_time = Math.floor(mydate.getTime()/1000);
            if(now_time == is_jishi){
                clearInterval(timer);
                kaoshijiaojuan(id,Math.floor(time*60),now_time,basicid);
            }
        },1000);
    }
    $.showPreloader('获取信息，请稍后...');
    var mydate = new Date();
    var start_time = Math.floor(mydate.getTime()/1000);
    if(time){
        var maxtime = Math.floor(time*60);
        timer = setInterval(function(){
            if(maxtime>=0){
                hour = Math.floor(maxtime/3600);
                minutes = Math.floor(maxtime%3600/60);
                seconds = Math.floor(maxtime%60);
                $('#cun_kaoshi_time').val((Math.floor(hour*3600)+Math.floor(minutes*60)+Math.floor(seconds)));
                if(hour<10){
                  hour = '0'+hour;
                }
                if(minutes<10){
                  minutes = '0'+minutes;
                }
                if(seconds<10){
                  seconds = '0'+seconds;
                }
                $('.jishi').html(hour+':'+minutes+':'+seconds);
                maxtime--;
            }else{
                clearInterval(timer);
                if(timer_jishi){
                    clearInterval(timer_jishi);
                }
                $.toast('时间到！');
                setTimeout(function(){
                    kaoshijiaojuan(id,Math.floor(time*60),start_time,basicid);
                },2000);
            }
        },1000);
    }else{
        console.log('不存在');
    }
    $.post(RestApi, { c: 'exam',a: 'examall',examid:id,basicid:basicid}, function(response){
        console.log(response);
        var responseObj = $.parseJSON(response);
        if(responseObj.code==200){
            if(responseObj.data != '' && responseObj.data != null){
                if(responseObj.data.length > 1){
                    for(var xx=1,newdiv='',next_num='',last_tixing='',daojishi='',jiaojuan='';xx<responseObj.data.length;xx++){
                        var question = responseObj.data[xx].questionselect;
                        question = question.split('\r\n');
                        if(responseObj.data[xx].questype == '单选题'){
                            for(var bb=0,newdiv_choose='';bb<question.length;bb++){
                                if(question[bb] != ''){
                                    newdiv_choose += '<li><label class="label-checkbox item-content"><input class="shijuan'+id+'" value="'+responseObj.data[xx].questionid+'" type="radio" name="tiku-radio'+id+responseObj.data[xx].questionid+'"><div class="item-media"><i class="icon icon-form-checkbox"><\/i>'+question[bb]+'<\/div><\/label><\/li>';
                                }
                            }
                        }else if(responseObj.data[xx].questype == '判断题'){
                            newdiv_choose = '<li><label class="label-checkbox item-content"><input class="shijuan'+id+'" value="'+responseObj.data[xx].questionid+'" type="radio" name="tiku-radio'+id+responseObj.data[xx].questionid+'"><div class="item-media"><i class="icon icon-form-checkbox"><\/i>对<\/div><\/label><\/li><li><label class="label-checkbox item-content"><input class="shijuan'+id+'" value="'+responseObj.data[xx].questionid+'" type="radio" name="tiku-radio'+id+responseObj.data[xx].questionid+'"><div class="item-media"><i class="icon icon-form-checkbox"><\/i>错<\/div><\/label><\/li>';
                        }else if(responseObj.data[xx].questype == '多选题'){
                            for(var bb=0,newdiv_choose='';bb<question.length;bb++){
                                if(question[bb] != ''){
                                    newdiv_choose += '<li><label class="label-checkbox item-content"><input class="shijuan'+id+'" value="'+responseObj.data[xx].questionid+'" type="checkbox" name="tiku-radio'+id+responseObj.data[xx].questionid+'"><div class="item-media"><i class="icon icon-form-checkbox"><\/i>'+question[bb]+'<\/div><\/label><\/li>';
                                }
                            }
                        }
                        if(parseInt(xx+1) != responseObj.data.length){
                            next_num = 'routers-index-3-1-1-'+id+parseInt(xx+1);
                            last_tixing = '';
                        }else{
                            next_num = '';
                            last_tixing = 'onclick="javascript:$.toast(\'已经是最后一题了！\');"';
                        }
                        if(subjectid == '练习'){
                            jiaojuan = '';
                            daojishi = '<b onclick="javascript:see_answer(\''+responseObj.data[xx].questionanswer+'\');">查看本题答案<\/b>';
                            // $('#tiku_back').click(function(){
                            //     $.confirm('确认退出本次练习吗？', '提 醒', function () {
                            //           $.router.replacePage("#routers-index-3",true);
                            //           $('.xuyaoshanchu').remove();
                            //     });
                            // });
                        }else if(subjectid == '闯关'){
                            jiaojuan = '<span class="icon" style="color:#fff;font-size:0.65rem;" onclick="javascript:tiku_choose('+id+',\''+subjectid+'\','+time+');">交卷</span>';
                            daojishi = '<i><span class="icon icon-clock"><\/span>剩余：<strong class="jishi" style="margin-right:0.5rem"><\/strong><a href="#" class="begin" onclick="javascript:timer_pause(this,'+id+');">暂停<\/a><\/i>';
                            // $('#tiku_back').click(function(){
                            //     $.confirm('您还没有交卷，确认退出吗？', '提 醒', function () {
                            //           $.router.replacePage("#routers-index-3",true);
                            //           $('.xuyaoshanchu').remove();
                            //     });
                            // });
                        }else if(subjectid == '考试'){
                            jiaojuan = '<span class="icon" style="color:#fff;font-size:0.65rem;" onclick="javascript:tiku_choose('+id+',\''+subjectid+'\','+time+','+start_time+','+basicid+');">交卷</span>';
                            daojishi = '<i><span class="icon icon-clock"><\/span>剩余：<strong class="jishi" style="margin-right:0.5rem"><\/strong><a href="#" class="begin" onclick="javascript:timer_pause(this,'+id+','+time+','+start_time+','+basicid+');">暂停<\/a><\/i>';
                            // $('#tiku_back').click(function(){
                            //     $.confirm('您还没有交卷，确认退出吗？', '提 醒', function () {
                            //           $.router.replacePage("#routers-index-3",true);
                            //           $('.xuyaoshanchu').remove();
                            //           clear_timer();
                            //     });
                            // });
                        }
                        newdiv = '<div id="routers-index-3-1-1-'+id+xx+'" class="page lianxiti xuyaoshanchu" style="z-index:10000">'+
                            '<header class="bar bar-nav shay_bar_head">'+
                                '<a class="pull-left" href="#" onclick="javascript:tiku_back_true(\''+subjectid+'\');">'+
                                    '<span class="icon icon-left" style="color:#fff;"></span>'+
                                '</a>'+
                                '<h1 class="title">'+title+'</h1>'+
                                '<a class="pull-right" href="#">'+
                                    jiaojuan+
                                '</a>'+
                            '</header>'+
                            '<nav class="bar bar-tab">'+
                                '<a class="pull-left back" href="#">'+
                                    '<span class="icon icon-left"></span>上一题'+
                                '</a>'+
                                '<h1 class="title">'+parseInt(xx+1)+'\/'+responseObj.data.length+'</h1>'+
                                '<a class="pull-right no-transition" href="#'+next_num+'" '+last_tixing+'>'+
                                    '下一题<span class="icon icon-right"></span>'+
                                '</a>'+
                            '</nav>'+
                            '<div class="content">'+
                                '<h1><span>'+responseObj.data[xx].questype+'</span>'+daojishi+'</h1>'+
                                '<h2>'+responseObj.data[xx].question+'</h2>'+
                                '<ul>'+
                                newdiv_choose+
                                '</ul>'+
                            '</div>'+
                        '</div>';
                        $(document.body).append(newdiv);
                    }
                }

                $('#tiku_title').html(title);
                $('#tiku_back').click(function(){
                    tiku_back_true(''+subjectid+'');
                });
                if(subjectid == '练习'){
                    $('#jiaojuan').css('display','none');
                    $('#tiku_tixing').html('<span>'+responseObj.data[0].questype+'<\/span><b onclick="javascript:see_answer(\''+responseObj.data[0].questionanswer+'\');">查看本题答案<\/b>');
                }else if(subjectid == '闯关'){
                    $('#jiaojuan').css('display','block').attr('onclick','javascript:tiku_choose('+id+',\''+subjectid+'\','+time+');');
                    $('#tiku_tixing').html('<span>'+responseObj.data[0].questype+'<\/span><i><span class="icon icon-clock"><\/span>剩余：<strong class="jishi" style="margin-right:0.5rem"><\/strong><a href="#" class="begin" onclick="javascript:timer_pause(this,'+id+');">暂停<\/a><\/i>');
                }else if(subjectid == '考试'){
                    $('#jiaojuan').css('display','block').attr('onclick','javascript:tiku_choose('+id+',\''+subjectid+'\','+time+','+start_time+','+basicid+');');
                    $('#tiku_tixing').html('<span>'+responseObj.data[0].questype+'<\/span><i><span class="icon icon-clock"><\/span>剩余：<strong class="jishi" style="margin-right:0.5rem"><\/strong><a href="#" class="begin" onclick="javascript:timer_pause(this,'+id+','+time+','+start_time+','+basicid+');">暂停<\/a><\/i>');
                }
                $('#tiku_name').html(responseObj.data[0].question);
                $('#tiku_page').html('1\/'+responseObj.data.length);
                if(responseObj.data.length > 1){
                    $('#tiku_next').attr('href','#routers-index-3-1-1-'+id+'1');
                    $('#tiku_next').attr('onclick','');
                }else{
                    $('#tiku_next').attr('href','#');
                    $('#tiku_next').attr('onclick','$.toast(\'已经是最后一题了！\');');
                    // $('#tiku_back').click(function(){
                    //     $.confirm('您还没有交卷，确认退出吗？', '提 醒', function () {
                    //           $.router.back();
                    //     });
                    // });
                }
                var question = responseObj.data[0].questionselect;
                question = question.split('\r\n');
                if(responseObj.data[0].questype == '单选题'){
                    for(var i=0,item='';i<question.length;i++){
                        if(question[i] != ''){
                            item += '<li><label class="label-checkbox item-content"><input class="shijuan'+id+'" value="'+responseObj.data[0].questionid+'" type="radio" name="tiku-radio'+id+responseObj.data[0].questionid+'"><div class="item-media"><i class="icon icon-form-checkbox"><\/i>'+question[i]+'<\/div><\/label><\/li>';
                        }
                    }
                    $('#tiku_list').html(item);
                }else if(responseObj.data[0].questype == '判断题'){
                    var item = '<li><label class="label-checkbox item-content"><input class="shijuan'+id+'" value="'+responseObj.data[0].questionid+'" type="radio" name="tiku-radio'+id+responseObj.data[0].questionid+'"><div class="item-media"><i class="icon icon-form-checkbox"><\/i>对<\/div><\/label><\/li><li><label class="label-checkbox item-content"><input class="shijuan'+id+'" value="'+responseObj.data[0].questionid+'" type="radio" name="tiku-radio'+id+responseObj.data[0].questionid+'"><div class="item-media"><i class="icon icon-form-checkbox"><\/i>错<\/div><\/label><\/li>';
                    $('#tiku_list').html(item);
                }else if(responseObj.data[0].questype == '多选题'){
                    for(var i=0,item='';i<question.length;i++){
                        if(question[i] != ''){
                            item += '<li><label class="label-checkbox item-content"><input class="shijuan'+id+'" value="'+responseObj.data[0].questionid+'" type="checkbox" name="tiku-radio'+id+responseObj.data[0].questionid+'"><div class="item-media"><i class="icon icon-form-checkbox"><\/i>'+question[i]+'<\/div><\/label><\/li>';
                        }
                    }
                    $('#tiku_list').html(item);
                }
                $.hidePreloader();
            }else{
                $.hidePreloader();
                $.toast('没有试题，请联系管理员');
                setTimeout(function(){$.router.back();clear_timer();},1000);
            }
        }else if(responseObj.code==403){
            $.hidePreloader();
            $.alert(responseObj.message,function(){
                window.location.href = 'login.html';
            });
        }else{
            $.hidePreloader();
            $.alert(responseObj.message);
        }
    });
}

function tiku_choose(id,type,time,start_time,basicid){
    // 获取选中项
    var arr = [];
    $('.shijuan'+id+':checked').each(function(){
        arr.push($(this).val()+$(this).siblings(".item-media").html().replace('<i class="icon icon-form-checkbox"><\/i>','').substring(0,1));
    });

    $.confirm('您确认试卷提交？', '提 醒', function () {
        $.showPreloader('试卷提交，请稍后...');
        var ehtime = Math.floor(time*60-$('#cun_kaoshi_time').val());
        $.post(RestApi, { c: 'exam',a: 'save_answer',examid:id,ehuseranswer:arr.join(','),ehstarttime:start_time,ehtime:ehtime,basicid:basicid}, function(response){
            console.log(response);
            var responseObj = $.parseJSON(response);
            if(responseObj.code==200){
                $.hidePreloader();
                if(type == '练习'){
                    $.confirm('您的本次练习成绩：'+responseObj.data+'分', '<i style="color:red;font-style:normal;">'+responseObj.message+'<\/i>', function () {
                        $.router.replacePage("#routers-index-3",true);
                    });
                }else if(type == '闯关'){
                    $.confirm('您的本次闯关成绩：'+responseObj.data+'分', '<i style="color:red;font-style:normal;">'+responseObj.message+'<\/i>', function () {
                        $.router.replacePage("#routers-index-3",true);
                    });
                }else if(type == '考试'){
                    $.confirm('您的本次考试成绩：'+responseObj.data+'分', '<i style="color:red;font-style:normal;">'+responseObj.message+'<\/i>', function () {
                        $.router.replacePage("#routers-index-3",true);
                        clear_timer();
                    });
                }
            }else if(responseObj.code==403){
                $.hidePreloader();
                $.alert(responseObj.message,function(){
                    window.location.href = 'login.html';
                });
            }else{
                $.hidePreloader();
                $.alert(responseObj.message);
            }
        });
    });
}

// 查看练习题答案
function see_answer(ans){
    $.alert('本题正确答案是：'+ans);
}
// 题库中返回
function tiku_back_true(subjectid){
    if(subjectid == '练习'){
        $.confirm('确认退出本次练习吗？', '提 醒', function () {
              $.router.replacePage("#routers-index-3",true);
              $('.xuyaoshanchu').remove();
        });
    }else if(subjectid == '闯关'){
        $.confirm('您还没有交卷，确认退出吗？', '提 醒', function () {
              $.router.replacePage("#routers-index-3",true);
              $('.xuyaoshanchu').remove();
        });
    }else if(subjectid == '考试'){
        $.confirm('您还没有交卷，确认退出吗？', '提 醒', function () {
              $.router.replacePage("#routers-index-3",true);
              $('.xuyaoshanchu').remove();
              clear_timer();
        });
    }
}


// 我的页面初始化,我的个人资料初始化
function my_init(){
    $.showPreloader('获取信息，请稍后...');
    $.post(RestApi, { c: 'user',a: 'getinfo'}, function(response){
        console.log(response);
        var responseObj = $.parseJSON(response);
        if(responseObj.code==200){
            if(responseObj.data != '' && responseObj.data != null){
                var photo = responseObj.data.photo;
                if(photo.indexOf('http://cdn.51daniu.cn/') == -1){
                    photo = attms+responseObj.data.photo;
                }else{
                    photo = responseObj.data.photo;
                }
                $('#my_touxiang').attr('src',photo);
                var usergroupid = responseObj.data.usergroupid;
                var biaoqian1 = '';
                if(usergroupid && usergroupid == '9'){
                  biaoqian1 = '导师';
                }else{
                  biaoqian1 = '用户';
                }
                $('#my_name').html(responseObj.data.username+'<i>'+biaoqian1+'<\/i>');
                $('#my_collect_num').html(responseObj.data.collect_num);
                $('#my_download_num').html(responseObj.data.download_num);
                $('#my_data_touxiang').attr('src',photo);
                $('#my_data_name').val(responseObj.data.username);
                $('#my_data_phone').val(responseObj.data.phone);
                $('#my_data_email').val(responseObj.data.email);
                $('#my_data_wechat').val(responseObj.data.wechat);
                $('#my_data_qq').val(responseObj.data.qq);
                $.hidePreloader();
            }else{
                $.hidePreloader();
            }
        }else if(responseObj.code==403){
            $.hidePreloader();
            $.alert(responseObj.message,function(){
                window.location.href = 'login.html';
            });
        }else{
            $.hidePreloader();
            $.alert(responseObj.message);
        }
    });
}

// 纯粹刷新我的主页面收藏和下载
function coll_and_down(){
    $.showPreloader('获取信息，请稍后...');
    $.post(RestApi, { c: 'user',a: 'getinfo'}, function(response){
        console.log(response);
        var responseObj = $.parseJSON(response);
        if(responseObj.code==200){
            if(responseObj.data != '' && responseObj.data != null){
                $('#my_collect_num').html(responseObj.data.collect_num);
                $('#my_download_num').html(responseObj.data.download_num);
                $.hidePreloader();
            }else{
                $.hidePreloader();
            }
        }else if(responseObj.code==403){
            $.hidePreloader();
            $.alert(responseObj.message,function(){
                window.location.href = 'login.html';
            });
        }else{
            $.hidePreloader();
            $.alert(responseObj.message);
        }
    });
}

// 拍照上传头像方法
function headImg1(vgar,vgcls,vgid){
   var ret = 1;
   navigator.camera.getPicture(onSuccess, onFail, { quality: 10,destinationType: Camera.DestinationType.DATA_URL,allowEdit:true,targetWidth:768,targetHeight:768});
      function onSuccess(imageURI) {
         $.showIndicator();
         $.post(Apistore, { c: 'upfile',a:'img', img:encodeURIComponent("data:image/jpeg;base64,"+imageURI)}, function(response){
             console.log(response);
             var responseObj=$.parseJSON(response);
                 if(responseObj.code==200){
                     if(vgar=='attr')
                     {
                       $('#'+vgcls).attr("src",responseObj.data);
                       $('#'+vgid).val(responseObj.data);
                     }
                     else
                     {
                       $('#'+vgcls).val("照片已上传");
                       $('#'+vgid).val(responseObj.data);
                     }
                     $.hideIndicator();
                 }else {
                     $.hideIndicator();
                     $.alert(responseObj.message);
                     ret = 0;
                 }
         });
      }
      function onFail(message) {
         $.alert('获取失败：没有选取照片');
      }
     return ret ;
}

// 从相册选择照片上传头像方法
function headImg2(vgar,vgcls,vgid){
   var ret = 1;
   navigator.camera.getPicture(onSuccess, onFail, { quality: 10,destinationType: Camera.DestinationType.DATA_URL,sourceType : Camera.PictureSourceType.PHOTOLIBRARY,allowEdit:true,targetWidth:768,targetHeight:768});
      function onSuccess(imageURI) {
         $.showIndicator();
         $.post(Apistore, { c: 'upfile',a:'img', img:encodeURIComponent("data:image/jpeg;base64,"+imageURI)}, function(response){
             console.log(response);
             var responseObj=$.parseJSON(response);
                 if(responseObj.code==200){
                     if(vgar=='attr')
                     {
                       $('#'+vgcls).attr("src",responseObj.data);
                       $('#'+vgid).val(responseObj.data);
                     }
                     else
                     {
                       $('#'+vgcls).val("照片已上传");
                       $('#'+vgid).val(responseObj.data);
                     }
                     $.hideIndicator();
                 }else {
                     $.hideIndicator();
                     $.alert(responseObj.message);
                     ret = 0;
                 }
         });
      }
      function onFail(message) {
         $.alert('获取失败：没有选取照片');
      }
     return ret ;
}

// 保存个人资料
function my_data_baocun(){
    var photo = $('#cuntouxiang').val();
    var usertruename = $('#my_data_name').val();
    var email = $('#my_data_email').val();
    var wechat = $('#my_data_wechat').val();
    var qq = $('#my_data_qq').val();
    $.showPreloader('正在提交，请稍后...');
    $.post(RestApi, { c: 'user',a: 'userdata',photo:photo,usertruename:usertruename,email:email,wechat:wechat,qq:qq}, function(response){
        console.log(response);
        var responseObj = $.parseJSON(response);
        if(responseObj.code==200){
            $.alert(responseObj.message,function(){
                my_init();
                $.router.replacePage("#routers-index-4",true);
                $.hidePreloader();
            });
        }else if(responseObj.code==403){
            $.hidePreloader();
            $.alert(responseObj.message,function(){
                window.location.href = 'login.html';
            });
        }else{
            $.hidePreloader();
            $.alert(responseObj.message);
        }
    });
}

// 我的收藏
function my_collect(){
    $.showPreloader('获取信息，请稍后...');
    $.post(RestApi, { c: 'user',a: 'my_collects'}, function(response){
        console.log(response);
        var responseObj = $.parseJSON(response);
        if(responseObj.code==200){
            if(responseObj.data.collects && responseObj.data.collects != ''){
                for(var i=0,item='';i<responseObj.data.collects.length;i++){
                    item += '<a href="#page_index_del" class="no-transition" onclick="javascript:kecheng_list('+responseObj.data.collects[i].csid+');"><img src="'+attms+responseObj.data.collects[i].csthumb+'" \/><div><h1>'+responseObj.data.collects[i].cstitle+'<\/h1><h3><img src="img\/us.png" \/>已有<i>'+responseObj.data.collects[i].download_num+'<\/i>人下载<\/h3><\/div><h1><\/h1><\/a>';
                    // item += '<a href="#page_index_del" class="no-transition" onclick="javascript:kecheng_list('+responseObj.data.collects[i].csid+');"><img src="'+attms+responseObj.data.collects[i].csthumb+'" \/><div><h1>'+responseObj.data.collects[i].cstitle+'<\/h1><h2>'+responseObj.data.collects[i].csdescribe+'<\/h2><h3><img src="img\/us.png" \/>已有<i>'+responseObj.data.collects[i].download_num+'<\/i>人下载<\/h3><\/div><h1><\/h1><\/a>';
                }
                $('#my_collect').html(item);
            }else{
                $('#my_collect').html('<h1 style="text-align:center;font-size:0.8rem;padding:1rem;">暂无收藏<\/h1>');
            }
            $.hidePreloader();
        }else if(responseObj.code==403){
            $.hidePreloader();
            $.alert(responseObj.message,function(){
                window.location.href = 'login.html';
            });
        }else{
            $.hidePreloader();
            $.alert(responseObj.message);
        }
    });
}

// 我的下载
function my_download(){
    $.showPreloader('获取信息，请稍后...');
    $.post(RestApi, { c: 'user',a: 'my_downloads'}, function(response){
        console.log(response);
        var responseObj = $.parseJSON(response);
        if(responseObj.code==200){
            if(responseObj.data.downloads && responseObj.data.downloads != ''){
                for(var i=0,item='';i<responseObj.data.downloads.length;i++){
                    item += '<a href="#"><img src="'+attms+responseObj.data.downloads[i].csthumb+'" \/><div><h1>'+responseObj.data.downloads[i].cstitle+'<\/h1><h3><b onclick="javascript:open_file_downloads(\''+attms+responseObj.data.downloads[i].cslink+'\');">打开<\/b><\/h3><\/div><h1><\/h1><\/a>';
                    // item += '<a href="#"><img src="'+attms+responseObj.data.downloads[i].csthumb+'" \/><div><h1>'+responseObj.data.downloads[i].cstitle+'<\/h1><h2>'+responseObj.data.downloads[i].csdescribe+'<\/h2><h3><b onclick="javascript:open_file_downloads(\''+attms+responseObj.data.downloads[i].cslink+'\');">打开<\/b><\/h3><\/div><h1><\/h1><\/a>';
                }
                $('#my_download').html(item);
            }else{
                $('#my_download').html('<h1 style="text-align:center;font-size:0.8rem;padding:1rem;">暂无下载<\/h1>');
            }
            $.hidePreloader();
        }else if(responseObj.code==403){
            $.hidePreloader();
            $.alert(responseObj.message,function(){
                window.location.href = 'login.html';
            });
        }else{
            $.hidePreloader();
            $.alert(responseObj.message);
        }
    });
}

// 排行榜
// 排行考试列表
function paihang_list(){
    $.showPreloader('获取信息，请稍后...');
    $.post(RestApi, { c: 'exam',a: 'ranking_list'}, function(response){
        console.log(response);
        var responseObj = $.parseJSON(response);
        if(responseObj.code==200){
            if(responseObj.data != ''){
                for(var i=0;i<responseObj.data.length;i++){
                    paihang_picker.push(responseObj.data[i].exam);
                }
                paihang(paihang_picker[0]);
            }
            $.hidePreloader();
        }else if(responseObj.code==403){
            $.hidePreloader();
            $.alert(responseObj.message,function(){
                window.location.href = 'login.html';
            });
        }else{
            $.hidePreloader();
            $.toast(responseObj.message);
        }
    });
}
// 纯粹列表刷新
function paihang_list_shuaxin(){
    $.post(RestApi, { c: 'exam',a: 'ranking_list'}, function(response){
        console.log(response);
        var responseObj = $.parseJSON(response);
        if(responseObj.code==200){
            if(responseObj.data != ''){
                paihang_picker = [];
                for(var i=0;i<responseObj.data.length;i++){
                    paihang_picker.push(responseObj.data[i].exam);
                }
            }
            $.hidePreloader();
        }else if(responseObj.code==403){
            $.hidePreloader();
            $.alert(responseObj.message,function(){
                window.location.href = 'login.html';
            });
        }else{
            $.hidePreloader();
            $.toast(responseObj.message);
        }
    });
}
// 各考试成绩排行筛选
function paihang(val){
    $.showPreloader('获取信息，请稍后...');
    $.post(RestApi, { c: 'exam',a: 'ranking_list',exam:val}, function(response){
        console.log(response);
        var responseObj = $.parseJSON(response);
        if(responseObj.code==200){
            if(responseObj.data != ''){
                $('#zanwupaihang').show();
                $('#paihang_zongfen').show().html('试卷总分（'+responseObj.data.score+'分）');
                $('#zanwupaihang_1').hide();
                $('#lianxi_no1_defen').html(responseObj.data.rank[0].ehscore);
                var no1_photo = responseObj.data.rank[0].photo;
                if(no1_photo.indexOf('http://cdn.51daniu.cn/') == -1){
                    no1_photo = attms+responseObj.data.rank[0].photo;
                }else{
                    no1_photo = responseObj.data.rank[0].photo;
                }
                $('#lianxi_no1_touxiang').attr('src',no1_photo);
                $('#lianxi_no1_name').html(responseObj.data.rank[0].ehusername);
                for(var i=1,item='';i<responseObj.data.rank.length;i++){
                    var photo = responseObj.data.rank[i].photo;
                    if(photo.indexOf('http://cdn.51daniu.cn/') == -1){
                        photo = attms+responseObj.data.rank[i].photo;
                    }else{
                        photo = responseObj.data.rank[i].photo;
                    }
                    item += '<li><i>NO. '+parseInt(i+1)+'<\/i><img src="'+photo+'" \/>'+responseObj.data.rank[i].ehusername+'<b>'+responseObj.data.rank[i].ehscore+'<\/b><\/li>';
                }
                $('#lianxi_list').html(item);
            }else{
                $('#zanwupaihang').hide();
                $('#paihang_zongfen').hide();
                $('#zanwupaihang_1').show();
            }
            $.hidePreloader();
        }else if(responseObj.code==403){
            $.hidePreloader();
            $.alert(responseObj.message,function(){
                window.location.href = 'login.html';
            });
        }else{
            $.hidePreloader();
            $.toast(responseObj.message);
        }
    });
}

// 备忘录列表
function memorandumlist(){
    $.showPreloader('获取信息，请稍后...');
    $.post(RestApi, { c: 'my',a: 'memorandumlist'}, function(response){
        console.log(response);
        var responseObj = $.parseJSON(response);
        if(responseObj.code==200){
            if(responseObj.data != ''){
                for(var i=0,item='';i<responseObj.data.length;i++){
                    item += '<a class="no-transition" href="#routers-index-4-2-1" onclick="javascript:memorandumdetail('+responseObj.data[i].memid+');"><h1>'+responseObj.data[i].memtitle+'<\/h1><h2>'+responseObj.data[i].addtime+'<\/h2><\/a>';
                }
                $.hidePreloader();
                $('#memorandumlist').html(item);
            }else{
                $.hidePreloader();
                $('#memorandumlist').html('<h1 style="text-align:center;font-size:0.8rem;padding:1rem;">您还没有添加备忘录<\/h1>');
            }
        }else if(responseObj.code==403){
            $.hidePreloader();
            $.alert(responseObj.message,function(){
                window.location.href = "login.html";
            });
        }else{
            $.hidePreloader();
            $.alert(responseObj.message);
        }
    });
}
// 备忘录详情
function memorandumdetail(id){
    $.showPreloader('获取信息，请稍后...');
    $.post(RestApi, { c: 'my',a: 'memorandumdetail',memid:id}, function(response){
        console.log(response);
        var responseObj = $.parseJSON(response);
        if(responseObj.code==200){
            $('#memdetitle').val(responseObj.data.memtitle);
            $('#memdecontent').html(responseObj.data.memcontent);
            $('#datetime-picker1').val(responseObj.data.remindtime);
            if(responseObj.data.is_remind == 0){
                $('#tixingfangshi1').html('不提醒');
            }else if(responseObj.data.is_remind == 1){
                $('#tixingfangshi1').html('需要提醒（以短信方式）');
            }
            $('#memdebaocun').attr('onclick','javascript:replacememorandum('+id+');');
            $.hidePreloader();
        }else if(responseObj.code==403){
            $.hidePreloader();
            $.alert(responseObj.message,function(){
                window.location.href = 'login.html';
            });
        }else{
            $.alert(responseObj.message);
            $.hidePreloader();
        }
    });
}
// 编辑备忘录
function replacememorandum(id){
    var yntixing = $('#tixingfangshi1').html();
    var is_remind = 0;
    if(yntixing == '需要提醒（以短信方式）'){
        is_remind = 1;
    }else if(yntixing == '不提醒'){
        is_remind = 0;
    }
    if($('#memdetitle').val() != '' && $('#memdecontent').val() != ''){
        $.showPreloader('正在提交，请稍后...');
        $.post(RestApi, { c: 'my',a: 'memorandumedit',memid:id,memtitle:$('#memdetitle').val(),memcontent:$('#memdecontent').html(),remindtime:$('#datetime-picker1').val(),is_remind:is_remind}, function(response){
            console.log(response);
            var responseObj = $.parseJSON(response);
            if(responseObj.code==200){
                $.hidePreloader();
                $.alert(responseObj.message,function(){
                    $.router.back();
                    $.pullToRefreshTrigger('.pull-to-refresh-content-beiwang');
                });
            }else if(responseObj.code==403){
                $.hidePreloader();
                $.alert(responseObj.message,function(){
                    window.location.href = 'login.html';
                });
            }else{
                $.hidePreloader();
                $.alert(responseObj.message);
            }
        });
    }else{
        $.alert('请输入标题和内容！');
    }
}
// 新增备忘录
function addmemorandum(){
    var yntixing = $('#tixingfangshi').html();
    var is_remind = 0;
    if(yntixing == '需要提醒（以短信方式）'){
        is_remind = 1;
    }else if(yntixing == '不提醒'){
        is_remind = 0;
    }
    if($('#memtitle').val() != '' && $('#memcontent').val() != ''){
        $.showPreloader('正在提交，请稍后...');
        $.post(RestApi, { c: 'my',a: 'memorandumadd',memtitle:$('#memtitle').val(),memcontent:$('#memcontent').val(),remindtime:$('#datetime-picker').val(),is_remind:is_remind}, function(response){
            console.log(response);
            var responseObj = $.parseJSON(response);
            if(responseObj.code==200){
                $.hidePreloader();
                $('#memtitle').val('');
                $('#memcontent').val('');
                $('#tixingfangshi').html('需要提醒（以短信方式）');
                $.alert(responseObj.message,function(){
                    $.router.back();
                    $.pullToRefreshTrigger('.pull-to-refresh-content-beiwang');
                });
            }else if(responseObj.code==403){
                $.hidePreloader();
                $.alert(responseObj.message,function(){
                    window.location.href = 'login.html';
                });
            }else{
                $.hidePreloader();
                $.alert(responseObj.message);
            }
        });
    }else{
        $.alert('请输入标题和内容！');
    }
}

// 我的成绩
function my_grades(){
    $.showPreloader('获取信息，请稍后...');
    $.post(RestApi, { c: 'my',a: 'grades'}, function(response){
        console.log(response);
        var responseObj = $.parseJSON(response);
        if(responseObj.code==200){
            $.hidePreloader();
            if(responseObj.data != ''){
                for(var i=0,item='';i<responseObj.data.length;i++){
                    item += '<li><div class="item-content"><div class="item-inner"><div class="item-title-row"><div class="item-title">'+responseObj.data[i].ehexam+'<\/div><\/div><div class="item-subtitle">'+responseObj.data[i].ehstarttime+'<\/div><\/div><div class="right">'+responseObj.data[i].ehscore+'分<\/div><\/div><\/li>';
                }
                $('#my_grades').html(item);
            }else{
                $('#my_grades').html('<h1 style="text-align:center;font-size:0.8rem;padding:1rem;">暂无成绩列表<\/h1>');
            }
        }else if(responseObj.code==403){
            $.hidePreloader();
            $.alert(responseObj.message,function(){
                window.location.href = 'login.html';
            });
        }else{
            $.hidePreloader();
            $.alert(responseObj.message);
        }
    });
}

// PPT,PDF,DOC文件查看
function open_file(url,csid,type){
    $.post(RestApi, { c: 'course',a: 'download',csid:csid}, function(response){
        console.log(response);
        var responseObj = $.parseJSON(response);
        if(responseObj.code==200){
            $.toast('下载完成后自动打开');
            var onSuccess = function(data) {
                if(data.message == 'successfull downloading and openning'){
                    $.toast(responseObj.message+'，正在打开请稍后');
                }else{
                    $.alert(data.message);
                }
            };

            function onError(error) {
                if(error.message == 'Failed to open the file, no reader found'){
                    if(type == 'ppt' || type == 'pptx'){
                        $.popup('.popup-ppt');
                    }else if(type == 'pdf' || type == 'pdfx'){
                        $.popup('.popup-pdf');
                    }else if(type == 'doc' || type == 'docx'){
                        $.popup('.popup-doc');
                    }
                }else{
                    $.alert(error.message);
                }
            }
            window.cordova.plugins.FileOpener.openFile(url, onSuccess, onError);
        }else if(responseObj.code==403){
            $.alert(responseObj.message,function(){
                window.location.href = 'login.html';
            });
        }else{
            $.alert(responseObj.message);
        }
    });
}

// 在我的下载中打开一系列文件
function open_file_downloads(url){
    $.toast('正在下载文案，请稍后');
    var onSuccess = function(data) {
        if(data.message == 'successfull downloading and openning'){
            $.toast('正在打开，请稍后');
        }else{
            $.alert(data.message);
        }
    };

    function onError(error) {
        if(error.message == 'Failed to open the file, no reader found'){
            if(url.substr(url.length-3,url.length) == 'ppt' || url.substr(url.length-4,url.length) == 'pptx'){
                $.popup('.popup-ppt');
            }else if(url.substr(url.length-3,url.length) == 'pdf' || url.substr(url.length-4,url.length) == 'pdfx'){
                $.popup('.popup-pdf');
            }else if(url.substr(url.length-3,url.length) == 'doc' || url.substr(url.length-4,url.length) == 'docx'){
                $.popup('.popup-doc');
            }
        }else{
            $.alert(error.message);
        }
    }
    window.cordova.plugins.FileOpener.openFile(url, onSuccess, onError);
}

// 提示安装office应用打开文件
function tishianzhuang(){
    $.toast('正在下载，请稍后');
    var onSuccess = function(data) {
        if(data.message == 'successfull downloading and openning'){
            $.toast('您已成功下载，正在打开');
        }else{
            $.toast(data.message);
        }
    };

    function onError(error) {
        $.toast(error.message);
    }
    window.cordova.plugins.FileOpener.openFile(
      'http://cdn.51daniu.cn/quickoffice_v1.apk', onSuccess, onError);
}


// 倒计时清除
function clear_timer(){
    clearInterval(timer);
    if(timer_jishi){
        clearInterval(timer_jishi);
    }
}
// 倒计时暂停与开启
function timer_pause(e,id,time,start_time,basicid){
    if($(e).html() == '暂停'){
        clearInterval(timer);
        $('#zanting_zhezhao').show();
        localStorage.setItem('shijuan_id',id);
        localStorage.setItem('shijuan_time',time);
        localStorage.setItem('shijuan_start_time',start_time);
        localStorage.setItem('shijuan_basicid',basicid);
    }
}
// 遮罩层点击
function zhezhaodianji(e){
    $(e).hide();
    var maxtime = Math.floor($('#cun_kaoshi_time').val());
    timer = setInterval(function(){
        if(maxtime>=0){
            hour = Math.floor(maxtime/3600);
            minutes = Math.floor(maxtime%3600/60);
            seconds = Math.floor(maxtime%60);
            $('#cun_kaoshi_time').val((Math.floor(hour*3600)+Math.floor(minutes*60)+Math.floor(seconds)));
            if(hour<10){
              hour = '0'+hour;
            }
            if(minutes<10){
              minutes = '0'+minutes;
            }
            if(seconds<10){
              seconds = '0'+seconds;
            }
            $('.jishi').html(hour+':'+minutes+':'+seconds);
            --maxtime;
        }else{
            clearInterval(timer);
            if(timer_jishi){
                clearInterval(timer_jishi);
            }
            $.toast('时间到！');
            setTimeout(function(){
                kaoshijiaojuan(localStorage.getItem('shijuan_id'),Math.floor(localStorage.getItem('shijuan_time')*60),localStorage.getItem('shijuan_start_time'),localStorage.getItem('shijuan_basicid'));
            },2000);
        }
    },1000);
}


// 考试模式（时间到，自动交卷）
function kaoshijiaojuan(id,time,start_time,basicid){
    var arr = [];
    $('.shijuan'+id+':checked').each(function(){
        arr.push($(this).val()+$(this).siblings(".item-media").html().replace('<i class="icon icon-form-checkbox"><\/i>','').substring(0,1));
    });
    $.post(RestApi, { c: 'exam',a: 'save_answer',examid:id,ehuseranswer:arr.join(','),ehstarttime:start_time,ehtime:time,basicid:basicid}, function(response){
        console.log(response);
        var responseObj = $.parseJSON(response);
        if(responseObj.code==200){
            $.hidePreloader();
            localStorage.setItem('shijuan_id','');
            localStorage.setItem('shijuan_time','');
            localStorage.setItem('shijuan_start_time','');
            localStorage.setItem('shijuan_basicid','');
            $.alert('您的本次考试成绩：'+responseObj.data+'分', '<i style="color:red;font-style:normal;">'+responseObj.message+'<\/i>');
            setTimeout(function () {
                $.router.replacePage("#routers-index-3",true);
            },2000);
        }else if(responseObj.code==403){
            $.hidePreloader();
            $.alert(responseObj.message,function(){
                window.location.href = 'login.html';
            });
        }else{
            $.hidePreloader();
            $.alert(responseObj.message);
        }
    });
}

// 判断考试是否开始 或 已结束
function panduan_time(start,end,id,exam,basicid,basic){
    var mydate = new Date();
    var now = Math.floor(mydate.getTime()/1000);
    if(now>Math.floor(end)){
        $.alert('考试已结束');
    }else if(now<Math.floor(start)){
        $.alert('考试还未开始');
    }else{
        $.alert('进入考试',function(){
            moshi_start('考试',id,'考试模式',exam,basicid,basic,end,start);
            $.router.replacePage("#routers-index-3-1-1",true);
        });
    }
}

// 清空功能
// 清空备忘录
function clear_beiwang(){
    if($('#memorandumlist').html() == '<h1 style="text-align:center;font-size:0.8rem;padding:1rem;">您还没有添加备忘录</h1>'){
        $.toast('您的备忘录列表是空的');
    }else{
        $.confirm('确认清空您的备忘录吗？', '清空提醒', function () {
            $.showPreloader('正在清理，请稍后...');
            $.post(RestApi, { c: 'my',a: 'del_memorandum'}, function(response){
                console.log(response);
                var responseObj = $.parseJSON(response);
                if(responseObj.code==200){
                    $.hidePreloader();
                    memorandumlist();
                }else if(responseObj.code==403){
                    $.hidePreloader();
                    $.alert(responseObj.message,function(){
                        window.location.href = 'login.html';
                    });
                }else{
                    $.hidePreloader();
                    $.alert(responseObj.message);
                }
            });
        });
    }
}
// 清空我的收藏
function clear_shoucang(){
    if($('#my_collect').html() == '<h1 style="text-align:center;font-size:0.8rem;padding:1rem;">暂无收藏</h1>'){
        $.toast('您的收藏列表是空的');
    }else{
        $.confirm('确认清空收藏列表吗？', '清空提醒', function () {
            $.showPreloader('正在清理，请稍后...');
            $.post(RestApi, { c: 'user',a: 'del_collects'}, function(response){
                console.log(response);
                var responseObj = $.parseJSON(response);
                if(responseObj.code==200){
                    $.hidePreloader();
                    my_collect();
                }else if(responseObj.code==403){
                    $.hidePreloader();
                    $.alert(responseObj.message,function(){
                        window.location.href = 'login.html';
                    });
                }else{
                    $.hidePreloader();
                    $.alert(responseObj.message);
                }
            });
        });
    }
}
// 清空我的下载
function clear_xiazai(){
    if($('#my_download').html() == '<h1 style="text-align:center;font-size:0.8rem;padding:1rem;">暂无下载</h1>'){
        $.toast('您的下载列表是空的');
    }else{
        $.confirm('确认清空下载列表吗？', '清空提醒', function () {
            $.showPreloader('正在清理，请稍后...');
            $.post(RestApi, { c: 'user',a: 'del_downloads'}, function(response){
                console.log(response);
                var responseObj = $.parseJSON(response);
                if(responseObj.code==200){
                    $.hidePreloader();
                    my_download();
                }else if(responseObj.code==403){
                    $.hidePreloader();
                    $.alert(responseObj.message,function(){
                        window.location.href = 'login.html';
                    });
                }else{
                    $.hidePreloader();
                    $.alert(responseObj.message);
                }
            });
        });
    }
}
// 清空我的成绩
function clear_chengji(){
    if($('#my_grades').html() == '<h1 style="text-align:center;font-size:0.8rem;padding:1rem;">暂无成绩列表</h1>'){
        $.toast('您的成绩列表是空的');
    }else{
        $.confirm('确认清空成绩列表吗？', '清空提醒', function () {
            $.showPreloader('正在清理，请稍后...');
            $.post(RestApi, { c: 'my',a: 'del_grade'}, function(response){
                console.log(response);
                var responseObj = $.parseJSON(response);
                if(responseObj.code==200){
                    $.hidePreloader();
                    my_grades();
                }else if(responseObj.code==403){
                    $.hidePreloader();
                    $.alert(responseObj.message,function(){
                        window.location.href = 'login.html';
                    });
                }else{
                    $.hidePreloader();
                    $.alert(responseObj.message);
                }
            });
        });
    }
}

// 进入我的收藏刷新
function jin_shoucang(){
    my_collect();
}
// 进入我的下载刷新
function jin_xiazai(){
    my_download();
}
// 进入我的成绩刷新
function jin_chengji(){
    my_grades();
}

var shayjPush={
    listen:function(){
        document.addEventListener("deviceready",function(){
            window.plugins.jPushPlugin.init();
            window.plugins.jPushPlugin.getRegistrationID(function(id){
                //将获取到的id存入服务端
                //13065ffa4e0e72bc96b
                console.log(id);
                // document.getElementById('registrationid').value = id;
                localStorage.setItem('shebeiID',id);
            });
        });
    }
}
