/* jshint node: true */
'use strict';

var assert = require('assert');
var dbg = require('debug')('streams piper');
var _ = require('lodash');

var Duplex = require('stream').Duplex;
var Transform = require('stream').Transform;
var Writable = require('stream').Writable;
var Readable = require('stream').Readable;

/**
  # Streams-piper

  This module can organize and chaining streams for piping.

  ## Example Usage

  <<< examples/sharp.js

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
**/

var piper = module.exports = function (source, pipes) {

  assert(isReadable(source), 'Source must be a readable stream');
  assert(pipes instanceof Array, 'Pipes must be an array of streams');

  function reduceFn(readable, current) {
    readable.pipe(current);

    if (current['readable'] !== undefined) {      
      return current;
    } else {
      return readable;
    }
  }

  sortStreams(pipes).reduce(reduceFn, source);

  return source;
};

_.extend(piper, {
  isReadable: isReadable,
  isWritable: isWritable,
  isTransform: isTransform,
  isDuplex: isDuplex,
  sorter: sortStreams
})

function isReadable(stream) {
  return stream instanceof Readable || stream['readable'] !== undefined;
}

function isWritable(stream) {
  return stream instanceof Writable
    || stream['readable'] === undefined
    && stream['writable'] !== undefined;
}

function isTransform(stream) {
  return stream instanceof Transform
    || stream['readable'] !== undefined
    && stream['writable'] !== undefined;
}

function isDuplex(stream) {
  return stream instanceof Duplex;
}

function sortStreams(arr) {

  function sortFn(a, b) {
    if (isTransform(a) && isDuplex(b)) return 1;
    if (isDuplex(a)) return -1;
    if (isWritable(a)) return 1;
    return 0;
  }

  return arr.sort(sortFn);
}

