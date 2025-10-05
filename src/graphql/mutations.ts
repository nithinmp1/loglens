import { GraphQLString, GraphQLNonNull } from 'graphql';
import { LogType } from './types.js';

const logs: any[] = globalThis.logs || [];
globalThis.logs = logs;

export const addLog = {
  type: LogType,
  args: {
    message: { type: new GraphQLNonNull(GraphQLString) },
    level: { type: GraphQLString },
    service: { type: GraphQLString },
  },
  async resolve(_: any, args: { message: string; level?: string; service?: string }) {
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
