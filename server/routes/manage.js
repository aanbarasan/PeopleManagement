var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/upload-bulkdata', function(req, res, next) {
    console.log(req);
    res.send("test");
});

module.exports = router;