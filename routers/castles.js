const express = require('express');
const router = express.Router();
const db = require('../models');


router.get('/:id', async (req, res, next) => {
  try {
    const castle = await db.find('castles', req.params.id);
    console.log(castle);
    res.render('castles/show', { castle });
  } catch (e) {
    next(e);
  }
});


router.post('/', async (req, res, next) => {
  let {
    name,
    kingdom_id: kingdomId
   } = req.body.castle;

  try {
    const castle = await db.save('castles', {
      name,
      liegeIds: []
    });
    const kingdom = await db.find('kingdoms', kingdomId);
    kingdom.castleIds.push(castle.id);
    await db.update('kingdoms', kingdomId, kingdom);
    res.redirect(`/castles/${ castle.id }`);
  } catch (e) {
    next(e);
  }
});



module.exports = router;







