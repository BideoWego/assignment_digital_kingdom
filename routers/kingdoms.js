const express = require('express');
const router = express.Router();
const db = require('../models');


router.get(['/', '/kingdoms'], async (req, res, next) => {
  try {
    const kingdoms = await db.get('kingdoms');
    res.render('kingdoms/index', { kingdoms });
  } catch (e) {
    next(e);
  }
});


router.get('/kingdoms/:id', async (req, res, next) => {
  try {
    const kingdom = await db.find('kingdoms', req.params.id);
    console.log(kingdom);
    res.render('kingdoms/show', { kingdom });
  } catch (e) {
    next(e);
  }
});


router.post('/kingdoms', async (req, res, next) => {
  let {
    name,
    king,
    queen
   } = req.body.kingdom;

  try {
    king = await db.save('kings', { name: king });
    queen = await db.save('queens', { name: queen });
    const kingdom = await db.save('kingdoms', {
      name,
      kingId: king.id,
      queenId: queen.id,
      castleIds: []
    });
    res.redirect(`/kingdoms/${ kingdom.id }`);
  } catch (e) {
    next(e);
  }
});



module.exports = router;







