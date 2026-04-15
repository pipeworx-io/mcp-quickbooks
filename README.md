# mcp-quickbooks

QuickBooks MCP Pack — query customers, invoices, and accounts via QuickBooks Online API.

Part of the [Pipeworx](https://pipeworx.io) open MCP gateway.

## Tools

| Tool | Description |
|------|-------------|
| `qb_query` | Run a SQL-like query against QuickBooks Online data. Supports queries like "SELECT * FROM Customer WHERE DisplayName LIKE \'%Smith%\'" or "SELECT * FROM Invoice WHERE TotalAmt > 1000". |
| `qb_get_customer` | Get a single QuickBooks customer by ID. Returns full customer details including name, email, phone, and balance. |
| `qb_list_invoices` | List recent invoices from QuickBooks. Returns invoice number, customer, amount, due date, and status. |
| `qb_get_invoice` | Get a single QuickBooks invoice by ID. Returns full invoice details including line items. |
| `qb_list_accounts` | List chart of accounts from QuickBooks. Returns account name, type, balance, and classification. |

## Quick Start

Add to your MCP client config:

```json
{
  "mcpServers": {
    "quickbooks": {
      "url": "https://gateway.pipeworx.io/quickbooks/mcp"
    }
  }
}
```

Or use the CLI:

```bash
npx pipeworx use quickbooks
```

## License

MIT
