#!/usr/bin/env node

import { detect } from '../src/detect.js'
import {
  installClaudeCode,
  installCursor,
  installVscode,
  installWindsurf,
} from '../src/install.js'
import { promptApiKey } from '../src/prompt.js'

const TEAL  = '\x1b[36m'
const GREEN = '\x1b[32m'
const DIM   = '\x1b[2m'
const BOLD  = '\x1b[1m'
const RESET = '\x1b[0m'

async function main() {
  console.log(`\n${BOLD}${TEAL}Spaceship AI${RESET} — MCP installer\n`)

  // Resolve API key: env var → prompt
  let apiKey = process.env.SPACESHIP_API_KEY
  if (!apiKey) {
    apiKey = await promptApiKey()
  }

  if (!apiKey || !apiKey.startsWith('sk_')) {
    console.error('\nInvalid API key. Keys must start with sk_live_ or sk_test_.')
    process.exit(1)
  }

  // Detect installed tools
  const tools = detect()
  const anyDetected = Object.values(tools).some(Boolean)

  if (!anyDetected) {
    console.log(
      `${DIM}No supported AI coding tools detected.${RESET}\n` +
      `Supported tools: Claude Code, Cursor, VS Code, Windsurf\n`
    )
    process.exit(0)
  }

  console.log('Installing Spaceship MCP server...\n')

  const results = []

  if (tools.claudeCode) {
    try {
      installClaudeCode(apiKey)
      results.push(`${GREEN}✓${RESET} Claude Code`)
    } catch {
      results.push(`✗ Claude Code ${DIM}(install failed — run: claude mcp add --transport stdio spaceship --env SPACESHIP_API_KEY=${apiKey} -- uvx spaceship-mcp)${RESET}`)
    }
  } else {
    results.push(`${DIM}— Claude Code not detected (skipped)${RESET}`)
  }

  if (tools.cursor) {
    try {
      installCursor(apiKey)
      results.push(`${GREEN}✓${RESET} Cursor`)
    } catch (e) {
      results.push(`✗ Cursor ${DIM}(${e.message})${RESET}`)
    }
  } else {
    results.push(`${DIM}— Cursor not detected (skipped)${RESET}`)
  }

  if (tools.vscode) {
    try {
      installVscode(apiKey)
      results.push(`${GREEN}✓${RESET} VS Code`)
    } catch (e) {
      results.push(`✗ VS Code ${DIM}(${e.message})${RESET}`)
    }
  } else {
    results.push(`${DIM}— VS Code not detected (skipped)${RESET}`)
  }

  if (tools.windsurf) {
    try {
      installWindsurf(apiKey)
      results.push(`${GREEN}✓${RESET} Windsurf`)
    } catch (e) {
      results.push(`✗ Windsurf ${DIM}(${e.message})${RESET}`)
    }
  } else {
    results.push(`${DIM}— Windsurf not detected (skipped)${RESET}`)
  }

  console.log(results.join('\n'))
  console.log(`\n${TEAL}Spaceship MCP is ready.${RESET} Restart your IDE if it was open.\n`)
}

main().catch((err) => {
  console.error('Error:', err.message)
  process.exit(1)
})
