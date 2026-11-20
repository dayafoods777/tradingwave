# Strategy DSL Specification (JSON AST Schema)
**Classification:** `PROPOSED`

---

## 1. Abstract Syntax Tree (AST) Type Schema

```typescript
export type NodeType = 'LOGICAL_GROUP' | 'COMPARISON' | 'KEYWORD_CALL' | 'LITERAL' | 'POSITION_REF';

export interface LogicalGroupNode {
  type: 'LOGICAL_GROUP';
  operator: 'AND' | 'OR';
  children: ASTNode[];
}

export interface ComparisonNode {
  type: 'COMPARISON';
  operator: '>' | '<' | '>=' | '<=' | '==' | '!=' | 'CROSSES_ABOVE' | 'CROSSES_BELOW';
  left: ASTNode;
  right: ASTNode;
}

export interface KeywordCallNode {
  type: 'KEYWORD_CALL';
  keyword: string;
  arguments: Record<string, ASTNode | string | number>;
  timeframe?: '1_MIN' | '3_MIN' | '5_MIN' | '15_MIN' | 'DAY';
  instrument?: string;
  offset?: number; // e.g. -1 for previous candle
}

export interface LiteralNode {
  type: 'LITERAL';
  dataType: 'NUMBER' | 'STRING' | 'TIME' | 'BOOLEAN';
  value: number | string | boolean;
}

export type ASTNode = LogicalGroupNode | ComparisonNode | KeywordCallNode | LiteralNode;
```
