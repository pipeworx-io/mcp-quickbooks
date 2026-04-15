interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

/**
 * QuickBooks MCP Pack — query customers, invoices, and accounts via QuickBooks Online API.
 *
 * OAuth: uses _context.quickbooks.accessToken and _context.quickbooks.realmId.
 * API: https://quickbooks.api.intuit.com/v3/company/{realmId}
 */


interface QuickBooksContext {
  quickbooks?: { accessToken: string; realmId: string };
}

const BASE_URL = 'https://quickbooks.api.intuit.com/v3/company';

async function qbFetch(ctx: QuickBooksContext, path: string) {
  if (!ctx.quickbooks) {
    return { error: 'connection_required', message: 'Connect your QuickBooks account at https://pipeworx.io/account' };
  }
  const { accessToken, realmId } = ctx.quickbooks;
  const res = await fetch(`${BASE_URL}/${realmId}${path}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`QuickBooks API error (${res.status}): ${text}`);
  }
  return res.json();
}

const tools: McpToolExport['tools'] = [
  {
    name: 'qb_query',
    description: 'Run a SQL-like query against QuickBooks Online data. Supports queries like "SELECT * FROM Customer WHERE DisplayName LIKE \'%Smith%\'" or "SELECT * FROM Invoice WHERE TotalAmt > 1000".',
    inputSchema: {
      type: 'object' as const,
      properties: {
        query: {
          type: 'string',
          description: 'QuickBooks SQL-like query string (e.g., "SELECT * FROM Customer MAXRESULTS 10")',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'qb_get_customer',
    description: 'Get a single QuickBooks customer by ID. Returns full customer details including name, email, phone, and balance.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        id: { type: 'string', description: 'QuickBooks Customer ID' },
      },
      required: ['id'],
    },
  },
  {
    name: 'qb_list_invoices',
    description: 'List recent invoices from QuickBooks. Returns invoice number, customer, amount, due date, and status.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        max_results: { type: 'number', description: 'Maximum number of invoices to return (default 25, max 1000)' },
        start_position: { type: 'number', description: 'Starting position for pagination (default 1)' },
      },
    },
  },
  {
    name: 'qb_get_invoice',
    description: 'Get a single QuickBooks invoice by ID. Returns full invoice details including line items.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        id: { type: 'string', description: 'QuickBooks Invoice ID' },
      },
      required: ['id'],
    },
  },
  {
    name: 'qb_list_accounts',
    description: 'List chart of accounts from QuickBooks. Returns account name, type, balance, and classification.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        max_results: { type: 'number', description: 'Maximum number of accounts to return (default 100, max 1000)' },
      },
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const context = (args._context ?? {}) as QuickBooksContext;
  delete args._context;

  switch (name) {
    case 'qb_query': {
      const query = encodeURIComponent(args.query as string);
      return qbFetch(context, `/query?query=${query}`);
    }
    case 'qb_get_customer':
      return qbFetch(context, `/customer/${args.id}`);
    case 'qb_list_invoices': {
      const maxResults = Math.min(1000, (args.max_results as number) ?? 25);
      const startPos = (args.start_position as number) ?? 1;
      const query = encodeURIComponent(`SELECT * FROM Invoice STARTPOSITION ${startPos} MAXRESULTS ${maxResults}`);
      return qbFetch(context, `/query?query=${query}`);
    }
    case 'qb_get_invoice':
      return qbFetch(context, `/invoice/${args.id}`);
    case 'qb_list_accounts': {
      const maxResults = Math.min(1000, (args.max_results as number) ?? 100);
      const query = encodeURIComponent(`SELECT * FROM Account MAXRESULTS ${maxResults}`);
      return qbFetch(context, `/query?query=${query}`);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool, meter: { credits: 10 }, provider: 'quickbooks' } satisfies McpToolExport;
