var expect = require('chai').expect;
var mocha = require('mocha');
var piper = require('../');

var fs = require('fs');
var through = require('through2');

describe('params', function() {

	it('source must be instance of Readable', function(){

		var fn = function(){
			piper(1, []);
		};	

		expect(fn).to.throw('Source must be a readable stream');

	});

	it('streams array must be instance of Array', function(){

		var fn = function(){
			piper(through(), 1);
		};	

		expect(fn).to.throw('Pipes must be an array of streams');

	});

});