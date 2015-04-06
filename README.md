# Stream-piper

This module can organize and chaining streams for piping.


[![NPM](https://nodei.co/npm/stream-piper.png)](https://nodei.co/npm/stream-piper/)

[![Build Status](https://img.shields.io/travis/korzhyk/stream-piper.svg?branch=master)](https://travis-ci.org/korzhyk/stream-piper) 

## Example Usage

```js
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
```

If we have a many writable stream, the are will pipe from last readable
(transform) stream;

```
source.pipe(Duplex).pipe(Transform).pipe(Transform)╗
                                                   ╠.pipe(Writable);
                                                   ╠.pipe(Writable);
                                                   ╠.pipe(Writable);
                                                   ╚.pipe(Writable);
                                                    (limit 10 pipes)
```

## License(s)

### MIT

Copyright (c) 2015 Andrii Korzh <andrii.korzh@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
