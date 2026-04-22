# mcp-quickbooks

QuickBooks MCP Pack — query customers, invoices, and accounts via QuickBooks Online API.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 250+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `qb_query` | Search QuickBooks data by customer, invoice, or account using filters like name, amount, date, or status. Returns matching records with full details. |
| `qb_get_customer` | Retrieve a customer\'s complete profile including contact info, email, phone, and account balance by customer ID. |
| `qb_list_invoices` | Get recent invoices with number, customer, amount, due date, and payment status. Use qb_get_invoice for full line-item details. |
| `qb_get_invoice` | Retrieve a complete invoice by ID including all line items, amounts, taxes, and payment history. |
| `qb_list_accounts` | Get your chart of accounts with account names, types (asset/liability/equity/etc), balances, and classifications. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "quickbooks": {
      "url": "https://gateway.pipeworx.io/quickbooks/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 250+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Quickbooks data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
