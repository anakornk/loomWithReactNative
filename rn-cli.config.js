// rn-cli.config.js
const nodeLibs = require('node-libs-react-native');
nodeLibs.fs  = require.resolve('react-native-level-fs');

module.exports = {
  resolver: {
    extraNodeModules: nodeLibs
  },
};