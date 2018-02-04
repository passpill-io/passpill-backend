var path = require('path'),
	fs = require('fs')
;

module.exports = function( options ){
	var basePath = options.dataPath;

	var getVaultDir = function( id ){
		return path.join( basePath, id.slice(0,2) );
	}
	var getVaultPath = function( id ){
		return path.join( getVaultDir(id), id );
	}

	var getPromise = function( clbk ){
		return new Promise( resolve => {
			var resolveError = function( value, err ){
				if (err) {
					console.log('**File Store Adapter Error**', err);
				}
				resolve( value );
			}

			clbk( resolveError );
		});
	}
	
	return {
		getVault: function( id, verbose ){
			return getPromise( resolve => {
				fs.readFile(getVaultPath(id), 'utf8', (err, data) => {
					resolve( data, verbose && err );
				});
			});
		},

		saveVault: function( id, content ){
			return getPromise( resolve => {
				fs.writeFile(getVaultPath(id), content, err => {
					if (!err) return resolve(true);

					// If the problem is not an unexistant parent dir, end
					if (err.code !== 'ENOENT') return resolve(false, err);
					
					// Otherwise create parent dir
					fs.mkdir(getVaultDir(id), err => {
						if (err) return resolve(false, err);

						fs.writeFile(getVaultPath(id), content, err => {

							// No error allowed now
							resolve( !err, err );
						})
					})
				})
			});
		}
	}
}