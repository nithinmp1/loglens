import {
  GraphQLList,
  GraphQLString,
  GraphQLObjectType,
} from "graphql";
import { LogType } from "./types.ts";

declare global {
  var logs: any[] | undefined;
}

const logs: any[] = globalThis.logs || [];
globalThis.logs = logs;

export const logsQuery = {
  type: new GraphQLList(LogType),
  args: {
    service: { type: GraphQLString },
    level: { type: GraphQLString },
    from: { type: GraphQLString },
    to: { type: GraphQLString },
  },
  resolve: (_: any, args: any) => {
    let filteredLogs = logs;

    if (args.service) {
      filteredLogs = filteredLogs.filter((log) => log.service === args.service);
    }

    if (args.level) {
      filteredLogs = filteredLogs.filter((log) => log.level === args.level);
    }

    if (args.from && args.to) {
      const fromDate = new Date(args.from);
      const toDate = new Date(args.to);
      filteredLogs = filteredLogs.filter((log) => {
        const ts = new Date(log.timestamp);
        return ts >= fromDate && ts <= toDate;
      });
    }

    return filteredLogs;
  },
};
