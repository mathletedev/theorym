require("dotenv-safe").config();

module.exports = {
	env: {
		MONGO_URI: process.env.MONGO_URI,
		GOOGLE_ID: process.env.GOOGLE_ID,
		GOOGLE_SECRET: process.env.GOOGLE_SECRET
	}
};
