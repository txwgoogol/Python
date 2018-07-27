//index.js
// 引用百度地图微信小程序JSAPI模块 
var bmap = require('../../libs/bmap-wx.js');
var config = require('../../libs/config.js');

Page({
  data: {
    weatherData: '',
    index: '',
    temp: '',
    pm25:'',
    share_title:''
  },
  onPullDownRefresh: function(){
    wx.showNavigationBarLoading() //在标题栏中显示加载
    //wx.startPullDownRefresh();
    var that = this;
    var ak = config.Config.ak;
    // 新建百度地图对象 
    var BMap = new bmap.BMapWX({ ak: ak });
    var fail = function (data) {
      console.log(data)
    };
    var success = function (data) {
      var weatherData = data.currentWeather[0];
      var index = data.originalData.results[0].index;
      var temp = weatherData.date;
      var pm25 = weatherData.pm25;
      temp = temp.substr(14, 3); //截取实时温度显示

      try {
        wx.setStorage({
          key: 'share_title',
          data: weatherData.currentCity + "  " + weatherData.weatherDesc + "  " + temp,
        });
      } catch (e) { }

      if (35 > pm25 && pm25 >= 0) {
        pm25 = '优';
      } else if (75 >= pm25 && pm25 > 35) {
        pm25 = '良';
      } else if (115 >= pm25 && pm25 > 75) {
        pm25 = '轻度污染';
      } else if (150 >= pm25 && pm25 > 115) {
        pm25 = '重度污染';
      } else if (250 >= pm25 && pm25 > 150) {
        pm25 = '重度污染';
      } else if (pm25 > 250) {
        pm25 = '严重污染';
      }

      that.setData({
        weatherData: weatherData,
        index: index,
        temp: temp,
        pm25: pm25,
        msgList: [
          // { url: "url", title: weatherData.weatherDesc },
          { url: "url", title: weatherData.wind },
          { url: "url", title: weatherData.temperature }
        ]
      });

      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh(); //停止下拉刷新
    }
    // 发起weather请求 
    BMap.weather({
      fail: fail,
      success: success
    });

  },
  onLoad: function () {
    var that = this;
    var ak = config.Config.ak;
    // 新建百度地图对象 
    var BMap = new bmap.BMapWX({ak: ak});
    var fail = function (data) {
      console.log(data)
    };
    var success = function (data) {
      var weatherData = data.currentWeather[0];
      var index = data.originalData.results[0].index;
      var temp = weatherData.date;
      var pm25 = weatherData.pm25;
      temp = temp.substr(14,3); //截取实时温度显示

      try {
        wx.setStorage({
          key: 'share_title',
          data: weatherData.currentCity + "  " + weatherData.weatherDesc + "  " + temp,
        });
      } catch (e) { }

      if(35 > pm25 && pm25 >= 0){
        pm25 = '优';
      } else if (75 >= pm25 && pm25 > 35){
        pm25 = '良';
      } else if (115 >= pm25 && pm25 > 75) {
        pm25 = '轻度污染';
      } else if (150 >= pm25 && pm25 > 115) {
        pm25 = '重度污染';
      } else if (250 >= pm25 && pm25 > 150) {
        pm25 = '重度污染';
      } else if ( pm25 > 250) {
        pm25 = '严重污染';
      }

      that.setData({
        weatherData: weatherData,
        index: index,
        temp: temp,
        pm25: pm25,
        msgList: [
          // { url: "url", title: weatherData.weatherDesc },
          { url: "url", title: weatherData.wind },
          { url: "url", title: weatherData.temperature }
          ]
      });
    }
    // 发起weather请求 
    BMap.weather({
      fail: fail,
      success: success
    });
  },onShareAppMessage:function(res){  
    var that = this;
    var share_title;

    // wx.getStorage({
    //   key: 'share_title',
    //   success: function (res) {
    //     share_title = res.data;
    //     console.log("=====" + share_title);
    //   },
    // })

    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }

    return {
      title: wx.getStorageSync('share_title'),
      path: 'pages/index/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})