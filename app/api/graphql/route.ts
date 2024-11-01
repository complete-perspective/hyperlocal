import { createYoga } from "graphql-yoga";
import type { NextApiRequest, NextApiResponse } from "next";
import { keystoneContext } from "@/app/server/keystone";

// Use Keystone's context to create GraphQL handler
const handleRequest = createYoga<{
  req: NextApiRequest;
  res: NextApiResponse;
}>({
  graphqlEndpoint: "/api/graphql",
  schema: keystoneContext.graphql.schema,
  context: async ({ req, res }) => {
    return keystoneContext.withSession().withRequest(req, res);
  },
  graphiql: {
    defaultQuery: `# Welcome to the GraphQL playground!\n`,
  },
  fetchAPI: { Response, Request },
});

export {
  handleRequest as GET,
  handleRequest as POST,
  handleRequest as OPTIONS,
};
