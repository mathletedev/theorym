import graphql from "../../../server/index";

export default graphql;

// ! Required for GraphQL Playground to load
export const config = {
	api: {
		bodyParser: false
	}
};
