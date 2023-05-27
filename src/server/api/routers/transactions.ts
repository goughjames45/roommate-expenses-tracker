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

  getOutstandingTransactionsByHousehold: publicProcedure.input(z.object({ id: z.string() })).query(async ({ input, ctx }) => {
    
    const householdTransactions = await ctx.prisma.transaction.findMany({
        where: {
            houseHoldId: input.id,
            
        }
    });

    if(ctx.auth.userId === null) {
      return;
    }

    const userHouseholdPayments = (await ctx.prisma.payments.findMany({
      where: {
        userId: ctx.auth.userId,
        isPaid: false
        
      }
    })).filter(t => householdTransactions.map(h => h.id).includes(t.transactionId));


    const householdTransactionPaymets: { id: string; createdAt: Date; userId: string; transactionId: string; amount: number; isPaid: boolean; payerName: string, payerId: string, name: string, description: string }[] = [];
    
    householdTransactions.forEach(transaction => {
      const payments = userHouseholdPayments.filter(p => p.transactionId === transaction.id);
      payments.forEach(p => {
        householdTransactionPaymets.push({
          id: p.id,
          createdAt: p.createdAt,
          userId: p.userId,
          transactionId: p.transactionId,
          amount: p.amount,
          isPaid: p.isPaid,
          payerName: transaction.payerName,
          payerId: transaction.payerId,
          name: transaction.name,
          description: transaction.description
        })
      })
    })


    return householdTransactionPaymets;
  }),

  createTransaction: protectedProcedure.input(z.object({ payerId: z.string(), houseHoldId: z.string(), name: z.string(), amount: z.number(), description: z.string(), payerName: z.string() })).mutation(async ({ input, ctx }) => {
    // const transaction = await ctx.prisma.transaction.create({
    //     data: {
    //         payerId: input.payerId,
    //         houseHoldId: input.houseHoldId,
    //         name: input.name,
    //         amount: input.amount,
    //         description: input.description,
    //         payerName: input.payerName
    //     }
    // });

    // //if the user is the same person who paid, then create a payment, so that it does not show up as outstanding expense
    // if(ctx.auth.userId === input.payerId) {
    //   await ctx.prisma.payments.create({
    //     data: {
    //       userId: ctx.auth.userId,
    //       transactionId: transaction.id
    //     }
    //   });
    // }

    // return transaction;
  }),

  createHouseholdExpense: protectedProcedure.input(z.object({ payerId: z.string(), houseHoldId: z.string(), name: z.string(), amount: z.number(), description: z.string(), payerName: z.string(), members: z.map(z.string(), z.number()) })).mutation(async ({ input, ctx }) => {
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

    const memberPayments = [...input.members].map(([userId, value]) => ({ 
      userId,
      amount: Number(value),
      transactionId: transaction.id,
      isPaid: input.payerId == userId ? true : false
    }));

    await ctx.prisma.payments.createMany(
      {data: memberPayments}
    )

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

  payExpense: protectedProcedure.input(z.object({ paymentId: z.string() })).mutation(async ({ input, ctx }) => {
    const payment = await ctx.prisma.payments.update({
        where: {
          id: input.paymentId,
        },
        data: {
          isPaid: true
        }
    });
    return payment;
  }),
});
