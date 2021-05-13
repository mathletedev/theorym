import graphql from "../../server";

export default graphql;

// ! Required for GraphQL Playground to load
export const config = {
	api: {
		bodyParser: false
	}
};
