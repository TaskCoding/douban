function inituser(){
  const db = wx.cloud.database()
  const _ = db.command
  return new Promise((resolve, reject) => {
    db.collection('user').get().then(user=>{
      if (!user.data.length) {
        db.collection('user').add({
          data: {
            collected: []
          }
        }).then(result=>{
          resolve({
            collected : [],
            userid : result._id
          });
        }) 
      }
      else {
        const userinfo = user.data[0];
        resolve({
          collected : userinfo.collected,
          userid : userinfo._id
        });
      }
    })
  });
}

function docollect(mid,userid){
  const db = wx.cloud.database()
  const _ = db.command
  return new Promise((resolve, reject) => {
    db.collection('user').doc(userid).update({
      data:{
        collected: _.addToSet(mid)
      }
    }).then(res=>{
      db.collection('user').get().then(user => {
        resolve({
          collected:user.data[0].collected
        });
      });
    })
  });
}

function cancelcollect(mid,userid){
  const db = wx.cloud.database()
  const _ = db.command
  return new Promise((resolve, reject) => {
    db.collection('user').doc(userid).update({
      data: {
        collected: _.pull(mid)
      }
    }).then(res => {
      db.collection('user').get().then(user => {
        resolve({
          collected:user.data[0].collected
        });
      });
    })
  });
}


module.exports = { 
  inituser,
  docollect,
  cancelcollect
}