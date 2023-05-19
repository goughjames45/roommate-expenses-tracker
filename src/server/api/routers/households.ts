import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const houseHoldsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.household.findMany();
  }),

  getHouseholdsByUser: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.household.findMany();
  }),
});
