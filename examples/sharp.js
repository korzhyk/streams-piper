var fs = require('fs');
var sharp = require('sharp');
var spy = require('through2-spy');

var file = fs.createReadStream('/tmp/image.jpg');

var Transform = spy(function(chunk){
  console.log('Transfered chunk size: %d', chunk.length)
});

var Duplex = sharp().resize(200);

router.get('/logo.jpg', function(req, res, next){
  piper(file, [req, Transform, Duplex]);
});