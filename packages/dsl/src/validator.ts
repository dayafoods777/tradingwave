import { ASTNode, StrategyDefinition } from './types.js';

export interface ValidationError {
  path: string;
  message: string;
}

export class StrategyValidator {
  public static validateStrategy(def: StrategyDefinition): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!def.id) errors.push({ path: 'id', message: 'Strategy ID is required.' });
    if (!def.name || def.name.trim().length === 0) {
      errors.push({ path: 'name', message: 'Strategy name cannot be empty.' });
    }
    if (!def.underlying || def.underlying.trim().length === 0) {
      errors.push({ path: 'underlying', message: 'Underlying symbol is required.' });
    }
    if (!def.sets || def.sets.length === 0) {
      errors.push({ path: 'sets', message: 'At least one strategy set is required.' });
    } else {
      def.sets.forEach((s, idx) => {
        if (!s.entryCondition) {
          errors.push({ path: `sets[${idx}].entryCondition`, message: 'Entry condition is required.' });
        } else {
          errors.push(...this.validateASTNode(s.entryCondition, `sets[${idx}].entryCondition`));
        }

        if (!s.exitCondition) {
          errors.push({ path: `sets[${idx}].exitCondition`, message: 'Exit condition is required.' });
        } else {
          errors.push(...this.validateASTNode(s.exitCondition, `sets[${idx}].exitCondition`));
        }

        if (!s.legs || s.legs.length === 0) {
          errors.push({ path: `sets[${idx}].legs`, message: 'Set must contain at least one position leg.' });
        } else {
          s.legs.forEach((leg, legIdx) => {
            if (!leg.action || !['BUY', 'SELL'].includes(leg.action)) {
              errors.push({ path: `sets[${idx}].legs[${legIdx}].action`, message: 'Invalid leg action (BUY or SELL required).' });
            }
            if (leg.lots <= 0) {
              errors.push({ path: `sets[${idx}].legs[${legIdx}].lots`, message: 'Lots must be greater than 0.' });
            }
          });
        }
      });
    }

    if (def.universalExit) {
      errors.push(...this.validateASTNode(def.universalExit.condition, 'universalExit.condition'));
    }

    return errors;
  }

  public static validateASTNode(node: ASTNode, path: string): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!node || typeof node !== 'object') {
      errors.push({ path, message: 'Node must be a valid object.' });
      return errors;
    }

    switch (node.type) {
      case 'LITERAL':
        if (node.value === undefined || node.value === null) {
          errors.push({ path: `${path}.value`, message: 'Literal value cannot be null or undefined.' });
        }
        break;

      case 'KEYWORD_CALL':
        if (!node.keyword || typeof node.keyword !== 'string') {
          errors.push({ path: `${path}.keyword`, message: 'Keyword name must be a valid string.' });
        }
        break;

      case 'POSITION_REF':
        if (!['PNL', 'ENTRY_PRICE', 'NET_QUANTITY', 'CURRENT_LTP'].includes(node.field)) {
          errors.push({ path: `${path}.field`, message: `Unknown position field: ${node.field}` });
        }
        break;

      case 'COMPARISON':
        if (!['>', '<', '>=', '<=', '==', '!=', 'CROSSES_ABOVE', 'CROSSES_BELOW'].includes(node.operator)) {
          errors.push({ path: `${path}.operator`, message: `Invalid comparison operator: ${node.operator}` });
        }
        if (!node.left) {
          errors.push({ path: `${path}.left`, message: 'Comparison requires left operand.' });
        } else {
          errors.push(...this.validateASTNode(node.left, `${path}.left`));
        }
        if (!node.right) {
          errors.push({ path: `${path}.right`, message: 'Comparison requires right operand.' });
        } else {
          errors.push(...this.validateASTNode(node.right, `${path}.right`));
        }
        break;

      case 'LOGICAL_GROUP':
        if (!['AND', 'OR'].includes(node.operator)) {
          errors.push({ path: `${path}.operator`, message: `Logical operator must be AND or OR, got: ${node.operator}` });
        }
        if (!Array.isArray(node.children) || node.children.length === 0) {
          errors.push({ path: `${path}.children`, message: 'Logical group must have at least one child node.' });
        } else {
          node.children.forEach((child, idx) => {
            errors.push(...this.validateASTNode(child, `${path}.children[${idx}]`));
          });
        }
        break;

      default:
        errors.push({ path, message: `Unknown node type: ${(node as any).type}` });
    }

    return errors;
  }
}

