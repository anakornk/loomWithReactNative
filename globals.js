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