import Order "mo:core/Order";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Float "mo:core/Float";
import List "mo:core/List";
import Int "mo:core/Int";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Access Control State
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types
  public type UserProfile = {
    name : Text;
    email : Text;
  };

  public type Transaction = {
    id : Int;
    userId : Principal;
    amount : Float;
    category : Text;
    description : Text;
    roundupAmount : Float;
    timestamp : Int;
  };

  public type InvestmentWallet = {
    totalRoundup : Float;
    investedAmount : Float;
    availableAmount : Float;
  };

  public type RoundupHistory = {
    amount : Float;
    timestamp : Int;
  };

  public type CategoryTotal = {
    category : Text;
    total : Float;
  };

  public type MonthlySpending = {
    month : Text;
    total : Float;
  };

  public type ExpenseAnalysis = {
    categoryTotals : [CategoryTotal];
    monthlySpending : [MonthlySpending];
    advice : Text;
  };

  // Persistent Data
  let userProfiles = Map.empty<Principal, UserProfile>();
  let transactions = Map.empty<Int, Transaction>();
  var nextTransactionId : Int = 1;
  var seedDataInitialized : Bool = false;

  // Helper Functions
  func calculateRoundup(amount : Float) : Float {
    let nextTen = Float.ceil(amount / 10.0) * 10.0;
    if (amount == nextTen) {
      0.0;
    } else {
      nextTen - amount;
    };
  };

  func getUserTransactions(userId : Principal) : [Transaction] {
    let userTxns = List.empty<Transaction>();
    for ((_, txn) in transactions.entries()) {
      if (txn.userId == userId) {
        userTxns.add(txn);
      };
    };
    let arr = userTxns.toArray();
    arr.sort(func(a : Transaction, b : Transaction) : Order.Order {
      if (a.timestamp > b.timestamp) { #less } else if (a.timestamp < b.timestamp) { #greater } else { #equal };
    });
  };

  func getMonthName(timestamp : Int) : Text {
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let monthIndex = Int.abs(timestamp / 2_592_000_000_000_000) % 12;
    months[monthIndex];
  };

  // USER PROFILE MANAGEMENT
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  // TRANSACTION MANAGEMENT
  public shared ({ caller }) func addTransaction(amount : Float, category : Text, description : Text) : async Transaction {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add transactions");
    };

    let roundup = calculateRoundup(amount);
    let txn : Transaction = {
      id = nextTransactionId;
      userId = caller;
      amount = amount;
      category = category;
      description = description;
      roundupAmount = roundup;
      timestamp = Time.now();
    };

    transactions.add(nextTransactionId, txn);
    nextTransactionId += 1;

    txn;
  };

  public query ({ caller }) func getTransactions() : async [Transaction] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view transactions");
    };
    getUserTransactions(caller);
  };

  // INVESTMENT WALLET
  public query ({ caller }) func getWalletSummary() : async InvestmentWallet {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view wallet");
    };

    let userTxns = getUserTransactions(caller);
    var totalRoundup : Float = 0.0;

    for (txn in userTxns.vals()) {
      totalRoundup += txn.roundupAmount;
    };

    let invested = totalRoundup * 0.8;
    let available = totalRoundup * 0.2;

    {
      totalRoundup = totalRoundup;
      investedAmount = invested;
      availableAmount = available;
    };
  };

  public query ({ caller }) func getInvestmentHistory() : async [RoundupHistory] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view investment history");
    };

    let userTxns = getUserTransactions(caller);
    let history = List.empty<RoundupHistory>();

    for (txn in userTxns.vals()) {
      if (txn.roundupAmount > 0.0) {
        history.add({
          amount = txn.roundupAmount;
          timestamp = txn.timestamp;
        });
      };
    };

    history.toArray();
  };

  // EXPENSE ANALYSIS
  public query ({ caller }) func analyzeExpenses() : async ExpenseAnalysis {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can analyze expenses");
    };

    let userTxns = getUserTransactions(caller);

    // Calculate category totals
    let categoryMap = Map.empty<Text, Float>();
    var totalSpending : Float = 0.0;

    for (txn in userTxns.vals()) {
      totalSpending += txn.amount;
      switch (categoryMap.get(txn.category)) {
        case (?existing) {
          categoryMap.add(txn.category, existing + txn.amount);
        };
        case (null) {
          categoryMap.add(txn.category, txn.amount);
        };
      };
    };

    let categoryTotals = List.empty<CategoryTotal>();
    for ((cat, total) in categoryMap.entries()) {
      categoryTotals.add({ category = cat; total = total });
    };

    // Calculate monthly spending (last 6 months)
    let now = Time.now();
    let monthlyMap = Map.empty<Text, Float>();

    for (txn in userTxns.vals()) {
      let monthsDiff = (now - txn.timestamp) / 2_592_000_000_000_000; // ~30 days in nanoseconds
      if (monthsDiff < 6) {
        let monthName = getMonthName(txn.timestamp);
        switch (monthlyMap.get(monthName)) {
          case (?existing) {
            monthlyMap.add(monthName, existing + txn.amount);
          };
          case (null) {
            monthlyMap.add(monthName, txn.amount);
          };
        };
      };
    };

    let monthlySpending = List.empty<MonthlySpending>();
    for ((month, total) in monthlyMap.entries()) {
      monthlySpending.add({ month = month; total = total });
    };

    // Generate advice
    var advice = "Your spending looks balanced this month. Keep it up!";
    var maxCategory = "";
    var maxAmount : Float = 0.0;

    for ((cat, total) in categoryMap.entries()) {
      if (total > maxAmount) {
        maxAmount := total;
        maxCategory := cat;
      };
    };

    if (totalSpending > 0.0 and maxAmount > 0.0) {
      let percentage = (maxAmount / totalSpending) * 100.0;
      if (percentage > 40.0) {
        advice := "You spent " # percentage.toText() # "% of your total on " # maxCategory # " this month. Consider reducing " # maxCategory # " expenses.";
      };
    };

    {
      categoryTotals = categoryTotals.toArray();
      monthlySpending = monthlySpending.toArray();
      advice;
    };
  };

  // SEED DATA (Admin only or one-time initialization)
  public shared ({ caller }) func initializeSeedData() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can initialize seed data");
    };

    if (seedDataInitialized) {
      Runtime.trap("Seed data already initialized");
    };

    let now = Time.now();
    let oneDay = 86_400_000_000_000; // nanoseconds in a day
    let oneMonth = oneDay * 30;

    // Sample transactions across 3 months
    let sampleData = [
      (47.5, "food", "Grocery shopping", now - (oneMonth * 2)),
      (23.0, "transport", "Bus ticket", now - (oneMonth * 2) + oneDay),
      (156.8, "shopping", "Clothing", now - (oneMonth * 2) + (oneDay * 5)),
      (42.0, "entertainment", "Movie tickets", now - (oneMonth * 2) + (oneDay * 10)),
      (89.3, "utilities", "Electric bill", now - (oneMonth * 2) + (oneDay * 15)),
      (34.5, "food", "Restaurant", now - oneMonth),
      (15.0, "transport", "Taxi", now - oneMonth + oneDay),
      (78.9, "shopping", "Electronics", now - oneMonth + (oneDay * 7)),
      (25.0, "entertainment", "Concert", now - oneMonth + (oneDay * 12)),
      (120.0, "utilities", "Internet", now - oneMonth + (oneDay * 20)),
      (52.3, "food", "Groceries", now - (oneDay * 5)),
      (18.5, "transport", "Gas", now - (oneDay * 3)),
      (95.0, "shopping", "Books", now - (oneDay * 2)),
      (30.0, "entertainment", "Streaming", now - oneDay),
    ];

    for ((amount, category, description, timestamp) in sampleData.vals()) {
      let roundup = calculateRoundup(amount);
      let txn : Transaction = {
        id = nextTransactionId;
        userId = caller;
        amount = amount;
        category = category;
        description = description;
        roundupAmount = roundup;
        timestamp = timestamp;
      };
      transactions.add(nextTransactionId, txn);
      nextTransactionId += 1;
    };

    seedDataInitialized := true;
  };
};
