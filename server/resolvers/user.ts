import { ObjectId } from "mongodb";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { User, UserModel } from "../entities/user";
import { ObjectIdScalar } from "../types/mongo";

@Resolver()
export class UserResolver {
	@Mutation(() => User)
	async registerUser(@Arg("username") username: string) {
		const newUser = new UserModel({ username } as User);
		return await newUser.save();
	}

	@Query(() => [User])
	async users() {
		return await UserModel.find({});
	}

	@Mutation(() => User, { nullable: true })
	async deleteUser(@Arg("id", () => ObjectIdScalar) id: ObjectId) {
		return await UserModel.findByIdAndDelete(id);
	}
}
