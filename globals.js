// imports for loom
import nacl from 'tweetnacl';
function cleanup(arr) {
  for (var i = 0; i < arr.length; i++) arr[i] = 0;
}
import crypto from 'crypto';
nacl.setPRNG(function(x, n) {
  var i, v = crypto.randomBytes(n);
  for (i = 0; i < n; i++) x[i] = v[i];
  cleanup(v);
});

// imports for web3
import { URL, URLSearchParams } from "whatwg-url";
global.URL = URL;
global.URLSearchParams = URLSearchParams;

if (typeof btoa === 'undefined') {
  global.btoa = function (str) {
    return new Buffer(str, 'binary').toString('base64');
  };
}

if (typeof atob === 'undefined') {
  global.atob = function (b64Encoded) {
    return new Buffer(b64Encoded, 'base64').toString('binary');
  };
}