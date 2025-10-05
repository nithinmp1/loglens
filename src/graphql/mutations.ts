import { GraphQLString, GraphQLNonNull } from 'graphql';
import { LogType, UserType } from './types.ts';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const users: any[] = [];
const logs: any[] = globalThis.logs || [];
globalThis.logs = logs;

const SECRET_KEY = "supersecretkey123";

export const register = {
  type: UserType,
  args: {
    username: { type: GraphQLString },
    password: { type: GraphQLString },
  },
  resolve: async (_: any, { username, password }: any) => {
    const existing = users.find((u) => u.username === username);
    if (existing) throw new Error("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: users.length + 1,
      username,
      password: hashedPassword,
    };
    users.push(user);

    const token = jwt.sign({ id: user.id, username }, SECRET_KEY, { expiresIn: "1d" });
    return { id: user.id, username, token };
  },
};

export const login = {
  type: UserType,
  args: {
    username: { type: GraphQLString },
    password: { type: GraphQLString },
  },
  resolve: async (_: any, { username, password }: any) => {
    const user = users.find((u) => u.username === username);
    if (!user) throw new Error("User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid password");

    const token = jwt.sign({ id: user.id, username }, SECRET_KEY, { expiresIn: "1d" });
    return { id: user.id, username, token };
  },
};

export const addLog = {
  type: LogType,
  args: {
    message: { type: new GraphQLNonNull(GraphQLString) },
    level: { type: GraphQLString },
    service: { type: GraphQLString },
  },
  async resolve(_: any, args: { message: string; level?: string; service?: string }, context: any) {
    if (!context.user) {
      throw new Error("Unauthorized");
    }
    
    const log = {
      id: Date.now().toString(),
      message: args.message,
      level: args.level || 'INFO',
      service: args.service || 'default',
      timestamp: new Date().toISOString(),
    };
    logs.push(log);

    return log;
  },
};
