import { getClassForDocument } from "@typegoose/typegoose";
import { GraphQLScalarType, Kind } from "graphql";
import { ObjectId } from "mongodb";
import { Document, Model } from "mongoose";
import { MiddlewareFn } from "type-graphql";

const convertDocument = (doc: Document) => {
	const converted = doc.toObject();
	const DocClass = getClassForDocument(doc)!;
	Object.setPrototypeOf(converted, DocClass.prototype);

	return converted;
};

export const TypegooseMiddleware: MiddlewareFn = async (_, next) => {
	const res = await next();

	if (Array.isArray(res))
		return res.map((item) =>
			item instanceof Model ? convertDocument(item) : item
		);

	if (res instanceof Model) return convertDocument(res);

	return res;
};

export const ObjectIdScalar = new GraphQLScalarType({
	name: "ObjectId",
	description: "MongoDB ObjectId Scalar",
	serialize(value: unknown) {
		if (!(value instanceof ObjectId))
			throw new Error("ObjectIdScalar can only serialize ObjectId values");
		return value.toHexString();
	},
	parseValue(value: unknown) {
		if (typeof value !== "string")
			throw new Error("ObjectIdScalar can only parse string values");
		return new ObjectId(value);
	},
	parseLiteral(ast) {
		if (ast.kind !== Kind.STRING)
			throw new Error("ObjectIdScalar can only parse string values");
		return new ObjectId(ast.value);
	}
});
