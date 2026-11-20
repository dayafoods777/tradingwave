import { OrderStatus } from './types.js';

export class OrderStateMachine {
  private static readonly validTransitions: Record<OrderStatus, OrderStatus[]> = {
    PENDING: ['SUBMITTED', 'REJECTED', 'CANCELLED'],
    SUBMITTED: ['OPEN', 'PARTIALLY_FILLED', 'FILLED', 'REJECTED', 'CANCELLED'],
    OPEN: ['PARTIALLY_FILLED', 'FILLED', 'CANCELLED'],
    PARTIALLY_FILLED: ['PARTIALLY_FILLED', 'FILLED', 'CANCELLED'],
    FILLED: [],
    REJECTED: [],
    CANCELLED: []
  };

  public static canTransition(current: OrderStatus, target: OrderStatus): boolean {
    const allowed = this.validTransitions[current] || [];
    return allowed.includes(target);
  }

  public static validateTransition(current: OrderStatus, target: OrderStatus): void {
    if (!this.canTransition(current, target)) {
      throw new Error(`Invalid Order State Transition: Cannot transition from ${current} to ${target}`);
    }
  }

  public static isFinalState(status: OrderStatus): boolean {
    return ['FILLED', 'REJECTED', 'CANCELLED'].includes(status);
  }
}

