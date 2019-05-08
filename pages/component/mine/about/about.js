var app = getApp();
Page({
  data: {
    version: '',
    showLog: false,
    cardCur: 0,
    swiperList: [{
      id: 0,
      type: 'image',
      url: '/images/team/Team.jpg'
    }, {
      id: 1,
      type: 'image',
      url: '/images/team/S_W_R.jpg'
    }, {
      id: 2,
      type: 'image',
      url: '/images/team/Mr_Wang.jpg'
    }, {
      id: 3,
      type: 'image',
      url: '/images/team/Mr_Liu.jpg',
    }, {
      id: 4,
      type: 'image',
      url: '/images/team/Mr_Yue.jpg'
    }]
  },
  onLoad: function() {
    this.towerSwiper('swiperList');
    this.setData({
      version: app.globalData.version,
      year: new Date().getFullYear()
    });
  },
  toggleLog: function() {
    this.setData({
      showLog: !this.data.showLog
    });
  },
  DotStyle(e) {
    this.setData({
      DotStyle: e.detail.value
    })
  },
  // cardSwiper
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  // towerSwiper
  // 初始化towerSwiper
  towerSwiper(name) {
    let list = this.data[name];
    for (let i = 0; i < list.length; i++) {
      list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
      list[i].mLeft = i - parseInt(list.length / 2)
    }
    this.setData({
      swiperList: list
    })
  },
  // towerSwiper触摸开始
  towerStart(e) {
    this.setData({
      towerStart: e.touches[0].pageX
    })
  },
  // towerSwiper计算方向
  towerMove(e) {
    this.setData({
      direction: e.touches[0].pageX - this.data.towerStart > 0 ? 'right' : 'left'
    })
  },
  // towerSwiper计算滚动
  towerEnd(e) {
    let direction = this.data.direction;
    let list = this.data.swiperList;
    if (direction == 'right') {
      let mLeft = list[0].mLeft;
      let zIndex = list[0].zIndex;
      for (let i = 1; i < list.length; i++) {
        list[i - 1].mLeft = list[i].mLeft
        list[i - 1].zIndex = list[i].zIndex
      }
      list[list.length - 1].mLeft = mLeft;
      list[list.length - 1].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    } else {
      let mLeft = list[list.length - 1].mLeft;
      let zIndex = list[list.length - 1].zIndex;
      for (let i = list.length - 1; i > 0; i--) {
        list[i].mLeft = list[i - 1].mLeft
        list[i].zIndex = list[i - 1].zIndex
      }
      list[0].mLeft = mLeft;
      list[0].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    }
  }
});