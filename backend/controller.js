var config = require('./config');
var md5 = require('crypto-js/md5');

module.exports = {
	getVault: function( event, context, callback ){
		console.log('here');
		var {u, p} = event.body,
			errorClbk = getErrorClbk( callback )
		;

		if (!u || !p) return errorClbk( 400, 'missing_params');
		if (typeof u !== 'string' || typeof p !== 'string') return errorClbk(400, 'bad_params');
		if (u.length !== 32 || p.length !== 40 ) return errorClbk(400, 'bad_params');


		config.storeAdapter.getVault( u, true ).then( vault => {
			if( !vault ) return errorClbk( 404, 'unknown_vault');
			
			var hash = md5(u + p).toString();
			if (vault.slice(0, hash.length) !== hash) return;
			var content = vault.slice(hash.length);
			
			if (!content) return errorClbk( 401, 'wrong_credentials');
			
			callback( null, {statusCode: 200, body: content} );
		});
	},
	createVault: function( event, context, callback ){
		var { u, p, v } = event.body,
			errorClbk = getErrorClbk(callback)
		;

		if (!u || !p || !v) return errorClbk(400, 'missing_params');
		if (typeof u !== 'string' || typeof p !== 'string' || typeof v !== 'string') return errorClbk(400, 'bad_params');
		if (u.length !== 32 || p.length !== 40) return errorClbk(400, 'bad_params');
		

		config.storeAdapter.getVault(u).then(vault => {
			if (vault) return errorClbk(400, 'vault_already_exist');

			var hash = md5(u + p).toString();
			config.storeAdapter.saveVault( u, hash+v ).then( saved => {
				if (saved) {
					return callback(null, { statusCode: 200, body: v });
				}
				errorClbk( 500, 'unexpected_creating_vault');
			});
		});
	},
	updateVault: function( event, context, callback ){
		var { u, p, v } = event.body,
			errorClbk = getErrorClbk(callback)
		;

		if (!u || !p || !v) return errorClbk(400, 'missing_params');
		if (typeof u !== 'string' || typeof p !== 'string' || typeof v !== 'string') return errorClbk(400, 'bad_params');
		if (u.length !== 32 || p.length !== 40) return errorClbk(400, 'bad_params');		

		config.storeAdapter.getVault(u).then(vault => {
			if (!vault) return errorClbk(404, 'unknown_vault');

			var hash = md5(u + p).toString();
			if (vault.slice(0, hash.length) !== hash) return errorClbk(401, 'wrong_credentials');
			
			config.storeAdapter.saveVault(u, hash + v).then(saved => {
				if (saved) {
					return callback(null, { statusCode: 200, body: v });
				}
				return errorClbk(500, 'unexpected_saving_vault');
			});
		});
	}
}

var getErrorClbk = function( callback ){
	return function (code, error) {
		// Errors are delayed to prevent bruce force attacks
		setTimeout( () => {
			callback( null, {
				statusCode: code,
				body: { code: error }
			});
		}, 500);
	}
}