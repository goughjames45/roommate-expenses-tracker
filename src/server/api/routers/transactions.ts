import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const transactionsRouter = createTRPCRouter({
  getTransactionByHousehold: publicProcedure.input(z.object({ id: z.string() })).query(({ input, ctx }) => {
    
    return ctx.prisma.transaction.findMany({
        where: {
            houseHoldId: input.id
        }
    });
  }),

  createTransaction: protectedProcedure.input(z.object({ payerId: z.string(), houseHoldId: z.string(), name: z.string(), amount: z.number(), description: z.string(), payerName: z.string() })).mutation(async ({ input, ctx }) => {
    const transaction = await ctx.prisma.transaction.create({
        data: {
            payerId: input.payerId,
            houseHoldId: input.houseHoldId,
            name: input.name,
            amount: input.amount,
            description: input.description,
            payerName: input.payerName
        }
    });
    return transaction;
  }),

  deleteTransaction: protectedProcedure.input(z.object({ transactionId: z.string() })).mutation(({ input, ctx }) => {
    const transaction = ctx.prisma.transaction.delete({
        where: {
            id: input.transactionId
        }  
    });
    return transaction;
  }),
});
