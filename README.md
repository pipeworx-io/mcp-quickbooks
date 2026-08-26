# mcp-quickbooks

QuickBooks MCP Pack — query customers, invoices, and accounts via QuickBooks Online API.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1476+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `qb_query` | Execute a QuickBooks SQL-like query (QBO query language) against any entity type — Customer, Invoice, Account, etc. Example: "SELECT * FROM Customer MAXRESULTS 10". Returns raw QuickBooks API response with matching records. |
| `qb_get_customer` | Retrieve a customer's complete profile including contact info, email, phone, and account balance by customer ID. |
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

### What this endpoint actually serves

`tools/list` at `https://gateway.pipeworx.io/quickbooks/mcp` returns the tools in the table
above **plus the shared Pipeworx meta-tools** — `ask_pipeworx`,
`discover_tools`, `search_within`, `remember`/`recall` and the rest of the
gateway-wide set. So the tool count you see is larger than this table: a
single-pack endpoint currently lists roughly 30 shared tools alongside the
pack's own. The connection's `initialize` response states its exact scope, and
is the authoritative answer for a given day.

This is deliberate, not multiplexing by accident. The meta-tools are what let a
scoped connection answer a question this pack does not cover — via
`ask_pipeworx`, which routes across the whole catalog — without you adding a
second MCP server. There is currently no way to mount a pack endpoint without
them; if the extra schemas cost you more context than the routing is worth,
connect to the full gateway once rather than to several pack endpoints.

Or connect to the full Pipeworx gateway to get every pack's tools listed
directly, instead of just this one's:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

Both URLs reach the same gateway and the same 1476+ data sources. The
only difference is which pack's tools are listed **directly**; `ask_pipeworx`
reaches all of them from either one.

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English —
this works on the pack endpoint above as well as on the full gateway:

```
ask_pipeworx({ question: "your question about Quickbooks data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
