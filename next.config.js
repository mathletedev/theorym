require("dotenv-safe").config();

module.exports = {
	env: {
		API_PATH: "/api",
		MONGO_URI: process.env.MONGO_URI
	}
};
