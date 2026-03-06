import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";

// ─── Dashboard ────────────────────────────────────────────────

export function useTransactions() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTransactions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useWalletSummary() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["walletSummary"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getWalletSummary();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useExpenseAnalysis() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["expenseAnalysis"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.analyzeExpenses();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useInvestmentHistory() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["investmentHistory"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getInvestmentHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Mutations ────────────────────────────────────────────────

export function useAddTransaction() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      amount,
      category,
      description,
    }: {
      amount: number;
      category: string;
      description: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addTransaction(amount, category, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["walletSummary"] });
      queryClient.invalidateQueries({ queryKey: ["expenseAnalysis"] });
      queryClient.invalidateQueries({ queryKey: ["investmentHistory"] });
    },
  });
}

export function useInitializeSeedData() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.initializeSeedData();
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
}
