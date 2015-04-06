/* jshint node: true */
'use strict';

var assert = require('assert');
var dbg = require('debug')('stream piper');
var Duplex = require('stream').Duplex;
var Transform = require('stream').Transform;
var Writable = require('stream').Writable;
var Readable = require('stream').Readable;

/**
  # Stream-piper

  This module helps me sort and chaining streams in my projects.

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
    dbg('pipe to ' + (isTransform(current)
      ? 'transform'
      : isDuplex(current)
      ? 'duxplex'
      : isWritable(current)
      ? 'writable'
      : 'readable'));

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

piper.sorter = sortStreams;

function sortStreams(arr) {

  function sortFn(a, b) {
    if (isTransform(a) && isDuplex(b)) return 1;
    if (isDuplex(a)) return -1;
    if (isWritable(a)) return 1;
    return 0;
  }

  return arr.sort(sortFn);
}

