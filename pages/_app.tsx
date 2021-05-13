import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { AppProps } from "next/app";
import { FC } from "react";
import { __prod__ } from "../utils/constants";

const client = new ApolloClient({
	cache: new InMemoryCache(),
	uri: __prod__ ? "https://theorym.vercel.app/api" : "http://localhost:3000/api"
});

const App: FC<AppProps> = ({ Component, pageProps }) => {
	return (
		<ApolloProvider client={client}>
			<Component {...pageProps} />
		</ApolloProvider>
	);
};

export default App;
