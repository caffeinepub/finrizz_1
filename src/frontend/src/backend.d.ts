import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface InvestmentWallet {
    availableAmount: number;
    totalRoundup: number;
    investedAmount: number;
}
export interface MonthlySpending {
    month: string;
    total: number;
}
export interface ExpenseAnalysis {
    categoryTotals: Array<CategoryTotal>;
    monthlySpending: Array<MonthlySpending>;
    advice: string;
}
export interface RoundupHistory {
    timestamp: bigint;
    amount: number;
}
export interface CategoryTotal {
    total: number;
    category: string;
}
export interface UserProfile {
    name: string;
    email: string;
}
export interface Transaction {
    id: bigint;
    userId: Principal;
    description: string;
    timestamp: bigint;
    category: string;
    amount: number;
    roundupAmount: number;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addTransaction(amount: number, category: string, description: string): Promise<Transaction>;
    analyzeExpenses(): Promise<ExpenseAnalysis>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getInvestmentHistory(): Promise<Array<RoundupHistory>>;
    getTransactions(): Promise<Array<Transaction>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWalletSummary(): Promise<InvestmentWallet>;
    initializeSeedData(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
