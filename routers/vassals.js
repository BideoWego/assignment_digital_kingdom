const express = require('express');
const router = express.Router();
const db = require('../models');


router.get('/:id', async (req, res, next) => {
  try {
    const vassal = await db.find('vassals', req.params.id);
    console.log(vassal);
    res.render('vassals/show', { vassal });
  } catch (e) {
    next(e);
  }
});


router.post('/', async (req, res, next) => {
  let {
    name,
    liege_id: liegeId
   } = req.body.vassal;

  try {
    const vassal = await db.save('vassals', {
      name
    });
    const liege = await db.find('lieges', liegeId);
    liege.vassalIds.push(vassal.id);
    await db.update('lieges', liegeId, liege);
    res.redirect(`/vassals/${ vassal.id }`);
  } catch (e) {
    next(e);
  }
});



module.exports = router;







