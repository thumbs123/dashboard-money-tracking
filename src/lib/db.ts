import { Pool } from 'pg';
import {
  DashboardOverview,
  Transaction,
  CategorySummary,
  MonthlyTrend,
  AccountSummary,
  UserProfile,
} from '@/types';
import { MOCK_DASHBOARD_DATA } from './mockData';

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    if (process.env.DATABASE_URL) {
      pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.DATABASE_SSL === 'false' ? false : { rejectUnauthorized: false },
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      });
    } else {
      const host = process.env.POSTGRES_HOST || '127.0.0.1';
      const port = parseInt(process.env.POSTGRES_PORT || '5433', 10);
      const user = process.env.POSTGRES_USER || 'finassist';
      const password = process.env.POSTGRES_PASSWORD || 'Freenancial123';
      const database = process.env.POSTGRES_DB || 'finassist';

      pool = new Pool({
        host,
        port,
        user,
        password,
        database,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 4000,
      });
    }

    pool.on('error', (err) => {
      console.warn('Postgres pool error:', err.message);
    });
  }
  return pool;
}

export async function verifyTelegramUser(telegramId: string): Promise<UserProfile | null> {
  const cleanId = String(telegramId || '').trim();
  if (!cleanId) return null;

  if (cleanId === 'demo') {
    return {
      id: 0,
      name: 'Demo User',
      telegramId: 'demo',
    };
  }

  try {
    const client = getPool();
    const res = await client.query<{ id: string; name: string; telegram_id: string }>(
      `SELECT u.id::text, u.name, ui.provider_user_id as telegram_id
       FROM users u
       JOIN user_identities ui ON ui.user_id = u.id
       WHERE ui.provider = 'telegram' AND ui.provider_user_id = $1
       LIMIT 1`,
      [cleanId]
    );

    if (res.rows.length === 0) {
      return null;
    }

    const r = res.rows[0];
    return {
      id: r.id,
      name: r.name,
      telegramId: r.telegram_id,
    };
  } catch (err) {
    console.error('Error verifying telegram user:', (err as Error).message);
    return null;
  }
}

export async function fetchDashboardData(
  monthStr?: string,
  telegramId?: string
): Promise<DashboardOverview> {
  const targetMonth = monthStr || new Date().toISOString().slice(0, 7); // 'YYYY-MM'
  const cleanId = String(telegramId || '').trim();

  // If explicitly demo mode
  if (cleanId === 'demo') {
    return {
      ...MOCK_DASHBOARD_DATA,
      selectedMonth: targetMonth,
      currentUser: { id: 0, name: 'Demo User', telegramId: 'demo' },
      isLiveDb: false,
      lastSyncTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };
  }

  try {
    const client = getPool();

    // 1. Resolve user by telegramId if provided
    let userFilterSql = '';
    let userFilterParams: any[] = [];
    let currentUser: UserProfile | null = null;

    if (cleanId) {
      const userRes = await client.query<{ id: string; name: string; telegram_id: string }>(
        `SELECT u.id::text, u.name, ui.provider_user_id as telegram_id
         FROM users u
         JOIN user_identities ui ON ui.user_id = u.id
         WHERE ui.provider = 'telegram' AND ui.provider_user_id = $1
         LIMIT 1`,
        [cleanId]
      );
      if (userRes.rows.length > 0) {
        const u = userRes.rows[0];
        currentUser = { id: u.id, name: u.name, telegramId: u.telegram_id };
        userFilterSql = ' WHERE user_id = $1 ';
        userFilterParams = [u.id];
      } else {
        // User with this telegram ID does not exist in DB yet
        return {
          totalBalance: 0,
          monthlyIncome: 0,
          monthlyExpense: 0,
          monthlyNet: 0,
          savingsRate: 0,
          transactionCount: 0,
          selectedMonth: targetMonth,
          categories: [],
          trends: [],
          recentTransactions: [],
          accounts: [],
          currentUser: null,
          isLiveDb: true,
          lastSyncTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        };
      }
    }

    if (!currentUser) {
      return {
        totalBalance: 0,
        monthlyIncome: 0,
        monthlyExpense: 0,
        monthlyNet: 0,
        savingsRate: 0,
        transactionCount: 0,
        selectedMonth: targetMonth,
        categories: [],
        trends: [],
        recentTransactions: [],
        accounts: [],
        currentUser: null,
        isLiveDb: true,
        lastSyncTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };
    }

    const userId = currentUser.id;

    // 2. Total Balance from accounts (strictly scoped to user)
    const balanceQuery = 'SELECT COALESCE(SUM(balance), 0)::text as total_balance FROM accounts WHERE user_id = $1';
    const balanceParams = [userId];
    const balanceRes = await client.query<{ total_balance: string }>(balanceQuery, balanceParams);
    const totalBalance = Number(balanceRes.rows[0]?.total_balance || 0);

    // 3. Accounts list (strictly scoped to user)
    const accQuery = 'SELECT id, name, balance::text FROM accounts WHERE user_id = $1 ORDER BY balance DESC';
    const accountsRes = await client.query<{ id: number; name: string; balance: string }>(
      accQuery,
      balanceParams
    );
    const accounts: AccountSummary[] = accountsRes.rows.map((row) => ({
      id: row.id,
      name: row.name,
      balance: Number(row.balance || 0),
      type: row.name.toLowerCase().includes('kas')
        ? 'Cash'
        : row.name.toLowerCase().includes('bank')
        ? 'Bank'
        : 'Dompet',
    }));

    // 4. Current month totals (strictly scoped to user)
    const monthQuery = `SELECT type, COALESCE(SUM(amount), 0)::text as total, count(*)::text as count
         FROM transactions
         WHERE user_id = $1 AND to_char(transaction_date, 'YYYY-MM') = $2
         GROUP BY type`;
    const monthParams = [userId, targetMonth];
    const monthTotalsRes = await client.query<{ type: string; total: string; count: string }>(
      monthQuery,
      monthParams
    );

    let monthlyIncome = 0;
    let monthlyExpense = 0;
    let transactionCount = 0;

    for (const row of monthTotalsRes.rows) {
      const val = Number(row.total || 0);
      const cnt = Number(row.count || 0);
      transactionCount += cnt;
      if (row.type === 'income') monthlyIncome = val;
      if (row.type === 'expense') monthlyExpense = val;
    }
    const monthlyNet = monthlyIncome - monthlyExpense;
    const savingsRate =
      monthlyIncome > 0 ? ((monthlyIncome - monthlyExpense) / monthlyIncome) * 100 : 0;

    // 5. Categories breakdown for expenses (strictly scoped to user)
    const categoryColors = [
      '#f43f5e',
      '#f59e0b',
      '#6366f1',
      '#ec4899',
      '#8b5cf6',
      '#10b981',
      '#06b6d4',
      '#64748b',
    ];
    const catQuery = `SELECT c.name, COALESCE(SUM(t.amount), 0)::text as total, count(t.id)::text as count
         FROM categories c
         JOIN transactions t ON t.category_id = c.id
         WHERE t.user_id = $1 AND t.type = 'expense' AND to_char(t.transaction_date, 'YYYY-MM') = $2
         GROUP BY c.name
         ORDER BY SUM(t.amount) DESC`;
    const catRes = await client.query<{ name: string; total: string; count: string }>(
      catQuery,
      monthParams
    );

    const categories: CategorySummary[] = catRes.rows.map((row, idx) => {
      const tot = Number(row.total || 0);
      return {
        name: row.name,
        type: 'expense',
        total: tot,
        count: Number(row.count || 0),
        percentage: monthlyExpense > 0 ? (tot / monthlyExpense) * 100 : 0,
        color: categoryColors[idx % categoryColors.length],
      };
    });

    // 6. Monthly trends (last 6 months, strictly scoped to user)
    const trendsQuery = `SELECT to_char(transaction_date, 'YYYY-MM') as ym, type, COALESCE(SUM(amount), 0)::text as total
         FROM transactions
         WHERE user_id = $1 AND transaction_date >= (CURRENT_DATE - INTERVAL '6 months')
         GROUP BY ym, type
         ORDER BY ym ASC`;
    const trendsRes = await client.query<{ ym: string; type: string; total: string }>(
      trendsQuery,
      balanceParams
    );

    const monthMap: Record<string, { income: number; expense: number }> = {};
    for (const row of trendsRes.rows) {
      if (!monthMap[row.ym]) {
        monthMap[row.ym] = { income: 0, expense: 0 };
      }
      if (row.type === 'income') monthMap[row.ym].income = Number(row.total || 0);
      if (row.type === 'expense') monthMap[row.ym].expense = Number(row.total || 0);
    }

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const trends: MonthlyTrend[] = Object.keys(monthMap)
      .sort()
      .map((ym) => {
        const [year, mo] = ym.split('-');
        const label = monthNames[parseInt(mo, 10) - 1] || mo;
        const inc = monthMap[ym].income;
        const exp = monthMap[ym].expense;
        return {
          month: ym,
          monthLabel: `${label} '${year.slice(2)}`,
          income: inc,
          expense: exp,
          net: inc - exp,
        };
      });

    // 7. Recent transactions (strictly scoped to user)
    const txQuery = `SELECT t.id, t.amount::text, t.type, to_char(t.transaction_date, 'YYYY-MM-DD') as transaction_date,
                t.description, t.merchant, COALESCE(c.name, 'Lainnya') as category_name,
                a.name as account_name, t.source, t.created_at::text
         FROM transactions t
         LEFT JOIN categories c ON t.category_id = c.id
         LEFT JOIN accounts a ON t.account_id = a.id
         WHERE t.user_id = $1
         ORDER BY t.transaction_date DESC, t.id DESC
         LIMIT 50`;
    const txRes = await client.query<{
      id: number;
      amount: string;
      type: 'income' | 'expense';
      transaction_date: string;
      description: string;
      merchant: string | null;
      category_name: string;
      account_name: string;
      source: string;
      created_at: string;
    }>(txQuery, balanceParams);

    const recentTransactions: Transaction[] = txRes.rows.map((row) => ({
      id: row.id,
      amount: Number(row.amount || 0),
      type: row.type,
      date: row.transaction_date,
      description: row.description || row.category_name,
      merchant: row.merchant,
      category: row.category_name,
      account: row.account_name,
      source: row.source,
      created_at: row.created_at,
    }));

    // If completely empty DB and no user specified, return mock data
    if (!cleanId && recentTransactions.length === 0 && totalBalance === 0) {
      return {
        ...MOCK_DASHBOARD_DATA,
        isLiveDb: true,
        lastSyncTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };
    }

    return {
      currentUser,
      totalBalance,
      monthlyIncome,
      monthlyExpense,
      monthlyNet,
      savingsRate,
      transactionCount,
      selectedMonth: targetMonth,
      categories,
      trends,
      recentTransactions,
      accounts,
      isLiveDb: true,
      lastSyncTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };
  } catch (error) {
    console.warn('Database offline or unreachable. Using mock dataset.', (error as Error).message);
    return {
      ...MOCK_DASHBOARD_DATA,
      currentUser: { id: 0, name: 'Offline Demo', telegramId: 'demo' },
      isLiveDb: false,
      lastSyncTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };
  }
}
