import { hash, verify } from "argon2";
import { ObjectId } from "mongodb";
import {
	Arg,
	Field,
	InputType,
	Mutation,
	ObjectType,
	Query,
	Resolver
} from "type-graphql";
import { User, UserModel } from "../entities/user";
import { ObjectIdScalar } from "../types/mongo";

@InputType()
class UsernamePassword {
	@Field()
	username: string;

	@Field()
	password: string;
}

@ObjectType()
class FieldError {
	@Field()
	field: string;

	@Field()
	message: string;
}

@ObjectType()
class UserResponse {
	@Field(() => [FieldError], { nullable: true })
	errors?: FieldError[];

	@Field(() => User, { nullable: true })
	user?: User;
}

@Resolver()
export class UserResolver {
	@Mutation(() => UserResponse)
	async register(
		@Arg("options") { username, password }: UsernamePassword
	): Promise<UserResponse> {
		if (username.length < 3)
			return {
				errors: [
					{
						field: "username",
						message: "Username must be at least 3 characters long"
					}
				]
			};

		if (password.length < 5)
			return {
				errors: [
					{
						field: "password",
						message: "Password must be at least 5 characters long"
					}
				]
			};

		const hashedPassword = await hash(password);
		try {
			const newUser = new UserModel({
				username,
				password: hashedPassword
			} as User);

			await newUser.save();
			return { user: newUser };
		} catch (err) {
			return {
				errors: [
					{
						field: "username",
						message: "Username is taken"
					}
				]
			};
		}
	}

	@Mutation(() => UserResponse)
	async login(
		@Arg("options") { username, password }: UsernamePassword
	): Promise<UserResponse> {
		const user = await UserModel.findOne({ username });
		if (!user)
			return {
				errors: [
					{
						field: "username",
						message: "Could not find an account with that username"
					}
				]
			};

		const valid = await verify(user.password, password);
		if (!valid)
			return {
				errors: [
					{
						field: "password",
						message: "Invalid password"
					}
				]
			};

		return { user };
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
