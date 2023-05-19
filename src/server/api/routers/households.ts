import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const houseHoldsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.household.findMany();
  }),

  getHouseholdsByUser: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.household.findMany();
  }),

  createHousehold: protectedProcedure.input(z.object({ name: z.string() })).mutation(async ({ input, ctx }) => {
    const household = await ctx.prisma.household.create({
        data: {
            ...input
        }
    }).then(async house => {
        const member = await ctx.prisma.householdMember.create({
            data: {
                houseHoldId: house.id,
                userId: ctx.auth.userId
            }
        })
        return member;
    });
    return household;
  }),
});
