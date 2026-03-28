# Spaceship AI CLI

Install the [Spaceship AI](https://spaceshipai.io) MCP server into every AI coding tool on your machine with one command.

## Quick start

```bash
npx spaceshipai@latest init
```

Opens your browser to sign in and authorize the CLI — no API key copying required. Detects and installs to **Claude Code**, **Cursor**, **VS Code**, and **Windsurf** — whichever you have installed.

## What it does

```
Spaceship AI — MCP installer

Installing Spaceship MCP server...

✓ Claude Code
✓ Cursor
✓ VS Code
— Windsurf not detected (skipped)

Spaceship MCP is ready. Restart your IDE if it was open.
```

## Install to Cursor

[![Install in Cursor](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/en-US/install-mcp?name=Spaceship&config=eyJjb21tYW5kIjoidXZ4IiwiYXJncyI6WyJzcGFjZXNoaXAtbWNwIl19)

## Available MCP tools

Once installed, these tools are available in your AI IDE:

| Tool | Description |
|------|-------------|
| `list_projects` | List all projects in your org |
| `list_agents` | List agents, optionally filtered by project |
| `get_agent` | Get full details of a single agent |
| `create_agent` | Create an agent with auto-generated system prompt |
| `update_agent` | Update name, prompt, or tools |
| `delete_agent` | Permanently delete an agent |
| `run_agent` | Start an async run; returns execution_id |
| `get_run_status` | Poll run status until completed or errored |
| `get_run_logs` | Fetch full event log for a completed run |
| `list_executions` | List recent runs with status and duration |
| `test_agent` | Quick sync test with 15s timeout |
| `list_tools` | List tools available to attach to agents |

## Manual configuration

If you prefer to configure manually, add this to your IDE's MCP config file:

```json
{
  "spaceship": {
    "command": "uvx",
    "args": ["spaceship-mcp"],
    "env": {
      "SPACESHIP_API_KEY": "sk_live_..."
    }
  }
}
```

| IDE | Config file |
|-----|-------------|
| Claude Code | `~/.claude/mcp.json` or run `claude mcp add` |
| Cursor | `~/.cursor/mcp.json` |
| VS Code | `.vscode/mcp.json` |
| Windsurf | `~/.codeium/windsurf/mcp_config.json` |

## License

MIT
