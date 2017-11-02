const fs = require('fs');
const dataPath = `${ __dirname }/../data`;
const ids = {
  castles: 4,
  kingdoms: 2,
  kings: 2,
  lieges: 8,
  queens: 2,
  vassals: 16
};


const write = (name, collection, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(`${ dataPath }/${ name }`, collection, err => {
      err ? reject(err) : resolve(data);
    });
  });
};


const db = {};


db.get = name => {
  const collection = require(`${ dataPath }/${ name }`);
  return Promise.resolve(collection);
};


db.save = async (name, data) => {
  const collection = await db.get(name);
  data.id = ++ids[name];
  collection[data.id] = data;
  return await write(name, collection, data);
};


db.update = async (name, id, data) => {
  const collection = await db.get(name);
  delete data.id;
  Object.assign(collection[id], data);
  return await write(name, collection, collection[id]);
};


db.find = async (name, id) => {
  const collection = await db.get(name);
  return Promise.resolve(collection[id]);
};


db.destroy = async (name, id) => {
  const collection = await db.get(name);
  const data = collection[id];
  delete collection[id];
  return await write(name, collection, data);
};




module.exports = db;




