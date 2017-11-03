const fs = require('fs');
const dataPath = `${ __dirname }/../data`;
const ids = {};


const write = (name, collection, data) => {
  return new Promise((resolve, reject) => {
    const path = `${ dataPath }/${ name }.json`;
    const json = JSON.stringify(collection, null, 2);
    const cb = err => err ? reject(err) : resolve(data);
    fs.writeFile(path, json, cb);
  });
};


const populate = async model => {
  const regex = /Id(s)?$/;
  for (let key in model) {
    if (key.match(regex)) {
      let singular = key.replace(regex, '');
      let plural = `${ singular }s`;
      let value = model[key];
      if (Array.isArray(value)) {
        const promises = value.map(
          async id => await db.find(plural, id)
        );
        model[plural] = await Promise.all(promises);
      } else {
        model[singular] = await db.find(plural, value);
      }
    }
  }
};


const populateAll = async collection => {
  for (let id in collection) {
    let model = collection[id];
    await populate(model);
  }
};


const depopulate = model => {
  const regex = /Id(s)?$/;
  const keys = [];
  for (let key in model) {
    if (key.match(regex)) {
      let singular = key.replace(regex, '');
      let plural = `${ singular }s`;
      let value = model[key];
      keys.push(
        Array.isArray(value) ?
          plural :
          singular
      )
    }
  }
  keys.forEach(key => delete model[key]);
};


const depopulateAll = collection => {
  for (let id in collection) {
    let model = collection[id];
    depopulate(model);
  }
};


const db = {};


db.get = async name => {
  const collection = require(`${ dataPath }/${ name }`);
  await populateAll(collection);
  return Promise.resolve(collection);
};


db.save = async (name, data) => {
  const collection = await db.get(name);
  const collectionIds = Object.keys(collection);
  console.log(collectionIds);
  const nextId = Math.max(...collectionIds);
  ids[name] = nextId ? nextId + 1 : 1;
  data = {
    id: ids[name],
    ...data
  };
  collection[data.id] = data;
  depopulateAll(collection);
  return await write(name, collection, data);
};


db.update = async (name, id, data) => {
  const collection = await db.get(name);
  delete data.id;
  Object.assign(collection[id], data);
  depopulateAll(collection);
  return await write(name, collection, collection[id]);
};


db.find = async (name, id) => {
  const collection = await db.get(name);
  const model = collection[id];
  await populate(model);
  return Promise.resolve(model);
};


db.destroy = async (name, id) => {
  const collection = await db.get(name);
  const data = collection[id];
  delete collection[id];
  return await write(name, collection, data);
};




module.exports = db;




