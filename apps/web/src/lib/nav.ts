import {
  LayoutDashboard,
  FolderKanban,
  Store,
  Workflow,
  Wand2,
  Sparkles,
  History,
  TableProperties,
  PlugZap,
  CreditCard,
  type LucideIcon,
} from 'lucide-react';

export type AppTab =
  | 'dashboard'
  | 'mystrategies'
  | 'readystrategies'
  | 'builder'
  | 'usingai'
  | 'wizard'
  | 'optionchain'
  | 'brokers'
  | 'backtest'
  | 'pricing';

export interface NavItem {
  id: AppTab;
  label: string;
  icon: LucideIcon;
  hint?: string;
}

export const NAV_GROUPS: { label: string; items: NavItem[] }[] = [
  {
    label: 'Workspace',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, hint: 'Deployments, P&L, positions' },
      { id: 'mystrategies', label: 'My strategies', icon: FolderKanban, hint: 'Saved and private strategies' },
      { id: 'readystrategies', label: 'Marketplace', icon: Store, hint: 'Ready-made strategies' },
    ],
  },
  {
    label: 'Build',
    items: [
      { id: 'builder', label: 'Strategy builder', icon: Workflow, hint: 'Rule-based, multi-leg' },
      { id: 'wizard', label: 'Option wizard', icon: Wand2, hint: 'Payoff, Greeks, templates' },
      { id: 'usingai', label: 'Describe with AI', icon: Sparkles, hint: 'Plain English to rules' },
      { id: 'backtest', label: 'Backtest', icon: History, hint: 'Historical simulation' },
    ],
  },
  {
    label: 'Market',
    items: [{ id: 'optionchain', label: 'Option chain', icon: TableProperties, hint: 'Live strikes, OI, IV' }],
  },
  {
    label: 'Account',
    items: [
      { id: 'brokers', label: 'Brokers', icon: PlugZap, hint: 'Connect 38 Indian brokers' },
      { id: 'pricing', label: 'Plans & billing', icon: CreditCard, hint: 'Subscription' },
    ],
  },
];

export const NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap(g => g.items);
export const navLabel = (id: AppTab) => NAV_ITEMS.find(i => i.id === id)?.label ?? '';
