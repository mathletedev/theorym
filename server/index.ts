import { ApolloServer } from "apollo-server-micro";
import { connect } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { __apiPath__ } from "../utils/constants";
import { HelloResolver } from "./resolvers/hello";
import { UserResolver } from "./resolvers/user";
import { TypegooseMiddleware } from "./types/mongo";

connect(process.env.MONGO_URI!, {
	dbName: "theorym",
	useNewUrlParser: true,
	useUnifiedTopology: true
})
	.then(() => console.log("Connected to MongoDB!"))
	.catch((err) => console.error(err));

let server: ApolloServer | null = null;

const graphql = async (req: NextApiRequest, res: NextApiResponse) => {
	if (!server)
		server = new ApolloServer({
			schema: await buildSchema({
				resolvers: [HelloResolver, UserResolver],
				globalMiddlewares: [TypegooseMiddleware]
			}),
			context: async ({ req }) => {
				// * Gets session from Next Auth
				const session = await getSession({ req });
				console.log("User Sessions:", session);
				return { session };
			},
			// ! Displays GraphQL Playground; remove in prod
			playground: {
				settings: {
					"request.credentials": "include"
				}
			},
			introspection: true
		});

	return server.createHandler({ path: __apiPath__ })(req, res);
};

export default graphql;
