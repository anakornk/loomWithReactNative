// rn-cli.config.js
const nodeLibs = require('node-libs-react-native');
nodeLibs.fs  = require.resolve('react-native-level-fs');
nodeLibs.vm  = require.resolve('vm-browserify');

module.exports = {
  resolver: {
    extraNodeModules: nodeLibs
  },
};