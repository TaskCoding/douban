// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    movie: {},
    favoriteId: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(params) {
    wx.showLoading({ title: '拼命加载中...' })

    let self = this;
    app.douban.findOne(params.id)
      .then(d => {
        this.setData({ title: d.title, movie: d })
        wx.setNavigationBarTitle({ title: d.title + ' « 电影 « 豆瓣' })

        // check if the movie in favorite list
        let where = { 'movie.id': d.id };
        app.database.get('favorite', where).then(res => {
          wx.hideLoading();
          if (res.length > 0) {
            self.setData({
              favoriteId: res[0]._id
            });
          }
        }).catch(err => {
          wx.hideLoading();
        });
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
  onReady() {
    wx.setNavigationBarTitle({ title: this.data.title + ' « 电影 « 豆瓣' })
  },

  onShareAppMessage() {
    return {
      title: this.data.title,
      desc: this.data.title,
      path: '/pages/item?id=' + this.data.id
    }
  },
  onFavoriteTap() {
    let self = this;
    let { favoriteId } = this.data;
    if (favoriteId) {
      wx.showLoading({ title: '取消收藏中' });
      // remove it from favorite
      app.database.remove('favorite', favoriteId).then(res => {
        wx.hideLoading();
        self.setData({
          favoriteId: null
        });
      }).catch(err => {
        wx.hideLoading();
      });
    } else {
      wx.showLoading({ title: '收藏中' });
      let { id, title, original_title, year, images, directors } = this.data.movie;
      let movie = {
        id, title, original_title, year, directors,
        image: images ? images.small : null
      };
      // add it to favorite
      let data = { movie };
      app.database.add('favorite', data).then(res => {
        wx.hideLoading();
        self.setData({
          favoriteId: res
        });
      }).catch(err => {
        wx.hideLoading();
      });
    }
  }
})
