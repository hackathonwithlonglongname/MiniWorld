// 定义数据格式

/***
 * 
 * "searchData":{
 *  configconfig:{
 *    style: "searchNormal"
 *  },
 *  view:{
 *    hidden: true,
 *    searchbarHeght: 20
 *  }
 *  keys:[],//自定义热门搜索
 *  his:[]//历史搜索关键字
 *  value
 * }
 * 
 * 
 */
const cloud = wx.cloud
cloud.init()
const db = cloud.database()

var __keysColor = [];
var __mindKeys = [];

function initColors(colors) {
  __keysColor = colors;
}

function initMindKeys(keys) {
  __mindKeys: keys;
}

function init(that, barHeight, keys, isShowKey, isShowHis, callBack) {
  var temData = {};
  var view = {
    barHeight: barHeight,
    isShow: false
  }

  if (typeof(isShowKey) == 'undefined') {
    view.isShowSearchKey = true;
  } else {
    view.isShowSearchKey = isShowKey;
  }

  if (typeof(isShowHis) == 'undefined') {
    view.isShowSearchHistory = true;
  } else {
    view.isShowSearchHistory = isShowHis;
  }
  temData.keys = keys;

  wx.getSystemInfo({
    success: function(res) {
      var wHeight = res.windowHeight;
      view.seachHeight = wHeight - barHeight;
      temData.view = view;
      that.setData({
        searchData: temData
      });
    }
  })

  if (typeof(callBack) == "function") {
    callBack();
  }

  getHisKeys(that);
}

function searchInput(e, that, callBack) {
  var temData = that.data.searchData;
  var text = e.detail.value;
  var mindKeys = [];
  if (typeof(text) != "undefined" && text.length != 0) {
    for (var i = 0; i < __mindKeys.length; i++) {
      var mindKey = __mindKeys[i];
      if (mindKey['briefInfo'].indexOf(text) > -1) {
        mindKeys.push(mindKey['briefInfo']);
        temData.value = text;
        temData.mindKeys = mindKeys;
        that.setData({
          searchData: temData
        });
      }
    }
  }
}

function searchFocus(e, that, callBack) {
  var temData = that.data.searchData;
  temData.view.isShow = true;
  that.setData({
    searchData: temData
  });
  //console.log(that.data.searchData)
  //回调
  if (typeof(callBack) == "function") {
    callBack();
  }
  // if(typeof(temData) != "undefined"){
  //   temData.view.hidden= false;
  //   that.setData({
  //     searchData:temData
  //   });
  // }else{

  // }
}

function searchBlur(e, that, callBack) {
  var temData = that.data.searchData;
  temData.value = e.detail.value;
  that.setData({
    searchData: temData
  });
  if (typeof(callBack) == "function") {
    callBack();
  }
}

function searchHiddenPancel(that) {
  var temData = that.data.searchData;
  temData.view.isShow = false;
  that.setData({
    searchData: temData
  });
}

function searchKeyTap(e, that, callBack) {
  //回调
  var temData = that.data.searchData;
  temData.value = e.target.dataset.key;
  that.setData({
    searchData: temData
  });
  if (typeof(callBack) == "function") {
    callBack(temData.value);
  }
}

function getHisKeys(that) {
  var value = [];
  try {
    value = wx.getStorageSync('searchHisKeys')
    if (value) {
      // Do something with return value
      var temData = that.data.searchData;
      temData.his = value;
      that.setData({
        searchData: temData
      });
    }
  } catch (e) {
    // Do something when catch error
  }

}

function searchAddHisKey(that) {
  searchHiddenPancel(that);
  var text = that.data.searchData.value;
  if (typeof(text) == "undefined" || text.length == 0) {
    return;
  }
  var value = wx.getStorageSync('searchHisKeys');
  if (value) {
    if (value.indexOf(text) < 0) {
      value.unshift(text);
    }
    wx.setStorage({
      key: "searchHisKeys",
      data: value,
      success: function() {
        getHisKeys(that);
      }
    })
  } else {
    value = [];
    value.push(text);
    wx.setStorage({
      key: "searchHisKeys",
      data: value,
      success: function() {
        getHisKeys(that);
      }
    })
  }
}

function searchDeleteKey(e, that) {
  var text = e.target.dataset.key;
  var value = wx.getStorageSync('searchHisKeys');
  value.splice(value.indexOf(text), 1);
  wx.setStorage({
    key: "searchHisKeys",
    data: value,
    success: function() {
      getHisKeys(that);
    }
  })
}

function searchDeleteAll(that) {
  wx.removeStorage({
    key: 'searchHisKeys',
    success: function(res) {
      var value = [];
      var temData = that.data.searchData;
      temData.his = value;
      that.setData({
        searchData: temData
      });
    }
  })
}



module.exports = {
  init: init,
  initColor: initColors,
  initMindKeys: initMindKeys,
  searchInput: searchInput,
  searchFocus: searchFocus,
  searchBlur: searchBlur,
  searchKeyTap: searchKeyTap,
  searchAddHisKey: searchAddHisKey,
  searchDeleteKey: searchDeleteKey,
  searchDeleteAll: searchDeleteAll,
  searchHiddenPancel: searchHiddenPancel
}