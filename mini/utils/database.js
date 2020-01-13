'use strict';

function get(collectionName, where = {}) {
  return new Promise((resolve, reject) => {
    let db = wx.cloud.database();
    db.collection(collectionName).where(where).get().then(res => {
      resolve(res.data);
    }).catch(err => {
      console.error('util->db->get error---');
      console.error(err);
      reject(err);
    })
  });
}
function add(collectionName, data = {}) {
  return new Promise((resolve, reject) => {
    let db = wx.cloud.database();
    // add created for new record
    data.created = db.serverDate();
    db.collection(collectionName).add({ data }).then(res => {
      resolve(res._id);
    }).catch(err => {
      console.error('util->db->add error---');
      console.error(err);
      reject(err);
    });
  });
}
function remove(collectionName, documentId) {
  return new Promise((resolve, reject) => {
    let db = wx.cloud.database();
    // add created for new record
    db.collection(collectionName).doc(documentId).remove().then(res => {
      if (res.stats.removed === 1) {
        resolve(1);
      } else {
        reject(res.stats.removed);
      }
    }).catch(err => {
      console.error('util->db->remove error---');
      console.error(err);
      reject(err);
    });
  });
}

module.exports = {
  get,
  add,
  remove
}