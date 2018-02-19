var path = require('path'),
	adapter = require('./storeAdapters/fileStore')
;

module.exports = {
	storeAdapter: adapter({
		dataPath: path.join( __dirname, '../fileStoreData')
	})
};