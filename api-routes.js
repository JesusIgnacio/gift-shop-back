const router = require('express').Router();

router.get('/', function (req, res) {
    res.json({
        status: 0,
        message: 'Gifts API Its Working'
    });
});

var giftController = require('./giftController');

router.route('/gifts').get(giftController.index)
router.route('/gifts/:id').get(giftController.view)

module.exports = router;