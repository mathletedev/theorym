import { gql, useQuery } from "@apollo/client";
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
	const { loading, data } = useQuery(GET_USERS);
	if (loading) return <p>Loading ...</p>;

	return (
		<Fragment>
			{data.users.map((user: any) => (
				<p>
					{user._id} | {user.username}
				</p>
			))}
		</Fragment>
	);
};

export default Index;
