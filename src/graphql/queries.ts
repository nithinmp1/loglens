import {
  GraphQLList,
  GraphQLString,
  GraphQLObjectType,
} from "graphql";
import { LogType } from "./types.ts";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
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
  async resolve(_: any, args: any, context: any) {
    if (!context.user) {
      throw new Error("Unauthorized");
    }
    
    const filters: any = {};

    if (args.service) {
      filters.service = args.service;
    }

    if (args.level) {
      filters.level = args.level;
    }

    if (args.from && args.to) {
      filters.timestamp = {
        gte: new Date(args.from),
        lte: new Date(args.to),
      };
    } else if (args.from) {
      filters.timestamp = { gte: new Date(args.from) };
    } else if (args.to) {
      filters.timestamp = { lte: new Date(args.to) };
    }

    const logs = await prisma.log.findMany({
      where: filters,
      orderBy: { timestamp: "desc" },
    });

    return logs;
  },
};
