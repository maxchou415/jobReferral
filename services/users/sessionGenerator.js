const crypto = require('crypto')
const config = require('config')

module.exports = async (userInfo) => {
	let session = {
		name: userInfo.name,
		username: userInfo.username,
		email: userInfo.email
	}
	return session
}
