import { getModelForClass, prop as Property } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { Field, ObjectType } from "type-graphql";
import { ObjectIdScalar } from "../types/mongo";

@ObjectType()
export class User {
	@Field(() => ObjectIdScalar)
	readonly _id: ObjectId;

	@Field()
	@Property({ required: true, unique: true })
	username: string;

	@Property({ required: true })
	password: string;
}

export const UserModel = getModelForClass(User);
