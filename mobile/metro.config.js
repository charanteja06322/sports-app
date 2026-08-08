const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add additional configuration for file watching
config.watchFolders = [];
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Reduce memory usage
config.maxWorkers = 2;

// Ignore problematic directories
config.resolver.blacklistRE = /node_modules\/.*\/node_modules\/react-native\/.*/;

module.exports = config;