const express = require('express');
const router = express.Router();
const db = require('../models');


router.get('/:id', async (req, res, next) => {
  try {
    const liege = await db.find('lieges', req.params.id);
    console.log(liege);
    res.render('lieges/show', { liege });
  } catch (e) {
    next(e);
  }
});


router.post('/', async (req, res, next) => {
  let {
    name,
    castle_id: castleId
   } = req.body.liege;

  try {
    const liege = await db.save('lieges', {
      name,
      vassalIds: []
    });
    const castle = await db.find('castles', castleId);
    castle.liegeIds.push(liege.id);
    await db.update('castles', castleId, castle);
    res.redirect(`/lieges/${ liege.id }`);
  } catch (e) {
    next(e);
  }
});



module.exports = router;







