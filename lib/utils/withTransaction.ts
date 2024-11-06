import { Transaction } from "sequelize";

import sequelize from "../models/connection";

export async function withTransaction<T>(
  callback: (transaction: Transaction) => Promise<T>
): Promise<T | null> {
  const transaction = await sequelize.transaction();
  
  try {
    const result = await callback(transaction);
    await transaction.commit();
    return result;
  } catch (error) {
    await transaction.rollback();
    console.error("Transaction failed:", error);
    
    throw error;
  }
}
