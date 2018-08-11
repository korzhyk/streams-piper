var expect = require('chai').expect;
var piper = require('../');

var fs = require('fs');
var zlib = require('zlib');
var through = require('through2');

describe('streams', function() {

	it('must be sorted correctly', function() {

		var hole = fs.createWriteStream('/dev/null');
		var t0 = through();
		var t1 = through();
		var d =  zlib.createGunzip();

		expect(piper.sortStreams([t0, hole, t1, d])).to.eql([d, t0, t1, hole]);
		
	});
});
