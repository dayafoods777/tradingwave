import { ASTNode, ExecutionContext, ComparisonOperator, LogicalOperator } from './types.js';
import { KeywordEngine } from './keywords.js';

export class ConditionEvaluator {
  public static evaluate(node: ASTNode, ctx: ExecutionContext): boolean {
    const val = this.evaluateNode(node, ctx);
    return Boolean(val);
  }

  public static evaluateNode(node: ASTNode, ctx: ExecutionContext): number | string | boolean {
    switch (node.type) {
      case 'LITERAL':
        return node.value;

      case 'KEYWORD_CALL': {
        const resolvedArgs: Record<string, any> = {};
        if (node.arguments) {
          for (const [k, v] of Object.entries(node.arguments)) {
            if (v && typeof v === 'object' && 'type' in v) {
              resolvedArgs[k] = this.evaluateNode(v as ASTNode, ctx);
            } else {
              resolvedArgs[k] = v;
            }
          }
        }
        return KeywordEngine.evaluateKeyword(node.keyword, resolvedArgs, ctx, node.instrument, node.offset || 0);
      }

      case 'POSITION_REF': {
        if (node.legIndex !== undefined && ctx.positions[node.legIndex]) {
          const leg = ctx.positions[node.legIndex];
          if (node.field === 'PNL') return leg.pnl;
          if (node.field === 'ENTRY_PRICE') return leg.entryPrice;
          if (node.field === 'NET_QUANTITY') return leg.quantity;
          if (node.field === 'CURRENT_LTP') return leg.currentLtp;
        }
        if (node.field === 'PNL') return ctx.strategyPnl;
        return 0;
      }

      case 'COMPARISON':
        return this.evaluateComparison(node.operator, node.left, node.right, ctx);

      case 'LOGICAL_GROUP':
        return this.evaluateLogicalGroup(node.operator, node.children, ctx);

      default:
        throw new Error(`Unknown AST Node: ${(node as any).type}`);
    }
  }

  private static evaluateComparison(
    op: ComparisonOperator,
    leftNode: ASTNode,
    rightNode: ASTNode,
    ctx: ExecutionContext
  ): boolean {
    const leftVal = this.evaluateNode(leftNode, ctx);
    const rightVal = this.evaluateNode(rightNode, ctx);

    if (op === 'CROSSES_ABOVE' || op === 'CROSSES_BELOW') {
      // Crossings require evaluating previous bar (offset -1)
      const prevCtx: ExecutionContext = {
        ...ctx,
        positions: ctx.positions,
        runtimeVariables: ctx.runtimeVariables
      };

      let prevLeft: number | string | boolean;
      let prevRight: number | string | boolean;

      if (leftNode.type === 'KEYWORD_CALL') {
        const leftPrev = { ...leftNode, offset: (leftNode.offset || 0) - 1 };
        prevLeft = this.evaluateNode(leftPrev, prevCtx);
      } else {
        prevLeft = leftVal;
      }

      if (rightNode.type === 'KEYWORD_CALL') {
        const rightPrev = { ...rightNode, offset: (rightNode.offset || 0) - 1 };
        prevRight = this.evaluateNode(rightPrev, prevCtx);
      } else {
        prevRight = rightVal;
      }

      if (op === 'CROSSES_ABOVE') {
        return Number(prevLeft) <= Number(prevRight) && Number(leftVal) > Number(rightVal);
      } else {
        return Number(prevLeft) >= Number(prevRight) && Number(leftVal) < Number(rightVal);
      }
    }

    // Direct Comparisons
    if (typeof leftVal === 'string' && typeof rightVal === 'string') {
      if (op === '==') return leftVal === rightVal;
      if (op === '!=') return leftVal !== rightVal;
      if (op === '>=') return leftVal >= rightVal;
      if (op === '<=') return leftVal <= rightVal;
      if (op === '>') return leftVal > rightVal;
      if (op === '<') return leftVal < rightVal;
    }

    const l = Number(leftVal);
    const r = Number(rightVal);

    switch (op) {
      case '>': return l > r;
      case '<': return l < r;
      case '>=': return l >= r;
      case '<=': return l <= r;
      case '==': return Math.abs(l - r) < 0.0001;
      case '!=': return Math.abs(l - r) >= 0.0001;
      default: return false;
    }
  }

  private static evaluateLogicalGroup(
    op: LogicalOperator,
    children: ASTNode[],
    ctx: ExecutionContext
  ): boolean {
    if (op === 'AND') {
      for (const child of children) {
        if (!this.evaluate(child, ctx)) {
          return false;
        }
      }
      return true;
    }

    if (op === 'OR') {
      for (const child of children) {
        if (this.evaluate(child, ctx)) {
          return true;
        }
      }
      return false;
    }

    return false;
  }
}

