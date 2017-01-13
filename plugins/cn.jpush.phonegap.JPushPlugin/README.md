l## cordova-jpush ##

    cordova plugin add  https://github.com/csbz17027/cordova-jpush.git --variable API_KEY=your_jpush_appkey

本插件根据 jpush-phonegap-plugin 为基础进行修改已符合自身项目更好的使用。
### API说明

插件的API集中在JPushPlugin.js文件中,这个文件的位置如下

*  android:[YOUR__ANDROID_PROJECT]/assets/www/plugins/cn.jpush.phonegap.JPushPlugin/www
*  iOS:[YOUR_iOS_PROJEcT]/www/plugins/cn.jpush.phonegap.JPushPlugin/www

具体的API请参考这里

#### iOS和adnroid通用API简介

+ 停止与恢复推送服务 API
		
		window.plugins.jPushPlugin.init()
		window.plugins.jPushPlugin.stopPush()
		window.plugins.jPushPlugin.resumePush()
		window.plugins.jPushPlugin.isPushStopped(callback)


+ 获取 RegistrationID API

		window.plugins.jPushPlugin.getRegistrationID(callback)
		
+ 别名与标签 API
	
		window.plugins.jPushPlugin.setTagsWithAlias(tags,alias)
		window.plugins.jPushPlugin.setTags(tags)
		window.plugins.jPushPlugin.setAlias(alias)
+ 获取点击通知内容
		
		event - jpush.openNotification
+ 获取通知内容
		
		event - jpush.receiveNotification

+ 获取自定义消息推送内容

		event - jpush.receiveMessage


[通用API详细说明](document/Common_detail_api.md)

#### iOS API简介

+ 获取自定义消息推送内容

		event - jpush.receiveMessage
		//推荐使用事件的方式传递，但同时保留了receiveMessageIniOSCallback的回调函数，兼容以前的代码
		window.plugins.jPushPlugin.receiveMessageIniOSCallback(data)
		
+ 页面的统计
	
		window.plugins.jPushPlugin.startLogPageView (pageName)
		window.plugins.jPushPlugin.stopLogPageView (pageName)
		window.plugins.jPushPlugin.beginLogPageView (pageName,duration)
+ 设置Badge

		window.plugins.jPushPlugin.setBadge(value)
		window.plugins.jPushPlugin.resetBadge()
		window.plugins.jPushPlugin.setApplicationIconBadgeNumber(badge)
+ 本地通知

	+ 后续版本加入
		
+ 日志等级设置
	
		window.plugins.jPushPlugin.setDebugModeFromIos ()
		window.plugins.jPushPlugin.setLogOFF()
		
		
[iOS API详细说明](document/iOS_detail_api.md)


#### adnroid API简介
		
+ 获取集成日志
		window.plugins.jPushPlugin.setDebugMode(mode)

+ 接收推送消息和点击通知
		
		//下面这两个api 是兼容旧有的代码
		window.plugins.jPushPlugin.receiveMessageInAndroidCallback(data)
		window.plugins.jPushPlugin.openNotificationInAndroidCallback(data)

+ 统计分析 API

		onResume / onPause(java api)
			
+ 清除通知 API

		window.plugins.jPushPlugin.clearAllNotification()

+ 通知栏样式定制 API

		window.plugins.jPushPlugin.setBasicPushNotificationBuilder = function()
		window.plugins.jPushPlugin.setCustomPushNotificationBuilder = function()

+ 设置保留最近通知条数 API
		
		window.plugins.jPushPlugin.setLatestNotificationNum(num)
		
+ 本地通知API
		
		window.plugins.jPushPlugin.addLocalNotification(builderId,
												    content,
												    title,
												    notificaitonID,
												    broadcastTime,
											 	    extras)
		window.plugins.jPushPlugin.removeLocalNotification(notificationID)
		window.plugins.jPushPlugin.clearLocalNotifications()

[Android API详细说明](document/Android_detail_api.md)

###更多
 [JPush官网文档](http://docs.jpush.io/)