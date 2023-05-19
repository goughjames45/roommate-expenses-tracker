import { useUser } from "@clerk/nextjs";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const houseHoldsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.household.findMany();
  }),

  //Might need to rework this...
  getHouseholdsByUser: publicProcedure.query(async ({ ctx }) => {
    const householdsByUserId = await ctx.prisma.householdMember.findMany({
        where: {
            userId: ctx.auth.userId!
        }
    }).then(async homes => {
        const ids = homes.map(home => home.houseHoldId);
        let households = await ctx.prisma.household.findMany();
        return households.filter(house => ids.includes(house.id))
    }).catch(err => {
        console.error(err);
    });

    return householdsByUserId;
  }),

  createHousehold: protectedProcedure.input(z.object({ name: z.string(), memberName: z.string() })).mutation(async ({ input, ctx }) => {
    const household = await ctx.prisma.household.create({
        data: {
            name: input.name
        }
    }).then(async house => {

        const member = await ctx.prisma.householdMember.create({
            data: {
                houseHoldId: house.id,
                userId: ctx.auth.userId,
                name: input.memberName
            }
        })
        return member;
    }).catch(err => {
        console.error(err);
    });
    return await household;
  }),

  getHouseholdMembers: protectedProcedure.input(z.object({ householdId: z.string() })).query(async ({ input, ctx }) => {
    return ctx.prisma.householdMember.findMany({
        where: {
            houseHoldId: input.householdId
        }
    });
  }),

  joinHousehold: protectedProcedure.input(z.object({ code: z.string(), memberName: z.string() })).mutation(async ({ input, ctx }) => {
    
    const member = await ctx.prisma.householdMember.create({
        data: {
            houseHoldId: input.code,
            userId: ctx.auth.userId,
            name: input.memberName
        }
    });
    return member;
 
  }),
});
