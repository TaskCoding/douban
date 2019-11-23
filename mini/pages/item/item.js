// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    collected: false,
    title: '',
    movie: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (params) {
    wx.showLoading({ title: '拼命加载中...' })

    app.douban.findOne(params.id)
      .then(d => {
        wx.setNavigationBarTitle({ title: d.title + ' « 电影 « 豆瓣' })
        var collected=false;
        if (app.data.collected.indexOf(d.id)!=-1){
          collected = true;
        }
        this.setData({ title: d.title, movie: d ,collected:collected})
        wx.hideLoading()
      })
      .catch(e => {
        this.setData({ title: '获取数据异常', movie: {} })
        console.error(e)
        wx.hideLoading()
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady () {
    wx.setNavigationBarTitle({ title: this.data.title + ' « 电影 « 豆瓣' })
  },

  tocollected(){
    wx.showLoading({
      title: '操作中',
    })
    if(this.data.collected==false){
      app.clouddb.docollect(this.data.movie.id,app.data.userid).then(res => {
        if (res.collected.indexOf(this.data.movie.id) != -1) {
          this.setData({
            collected: true
          })
        }
        app.data.collected = res.collected;
        wx.hideLoading();
      })
    }
    else{
      app.clouddb.cancelcollect(this.data.movie.id, app.data.userid).then(res => {
        if (res.collected.indexOf(this.data.movie.id) == -1) {
          this.setData({
            collected: false
          })
        }
        app.data.collected = res.collected;
        wx.hideLoading();
      })
    }
  },

  onShareAppMessage () {
    return {
      title: this.data.title,
      desc: this.data.title,
      path: '/pages/item?id=' + this.data.id
    }
  }
})
