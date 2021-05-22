import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { FC, Fragment } from "react";

const GET_USERS = gql`
	query GetUsers {
		users {
			_id
			username
		}
	}
`;

const Index: FC = () => {
	const router = useRouter();

	const { loading, data } = useQuery(GET_USERS);
	if (loading) return <p>Loading ...</p>;

	return (
		<Fragment>
			<button onClick={() => router.push("/api/auth/signin")}>Login</button>
			{data.users.map((user: any) => (
				<p>
					{user._id} | {user.username}
				</p>
			))}
		</Fragment>
	);
};

export default Index;
