import { Client } from "@modelcontextprotocol/sdk/client"
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js"

const MCP_SERVER_PATH = process.env.MCP_SERVER_PATH ?? ""

export interface McpToolDef {
  name: string
  description: string
  inputSchema: Record<string, unknown>
}

export async function createWalkMcpClient(): Promise<Client> {
  const transport = new StdioClientTransport({
    command: "bun",
    args: ["run", MCP_SERVER_PATH],
    env: process.env as Record<string, string>,
  })
  const client = new Client({ name: "walk-bot", version: "1.0.0" })
  await client.connect(transport)
  return client
}

export async function listWalkTools(client: Client): Promise<McpToolDef[]> {
  const result = await client.listTools()
  return result.tools.map((t) => ({
    name: t.name,
    description: t.description ?? "",
    inputSchema: t.inputSchema as Record<string, unknown>,
  }))
}

export async function callWalkTool(
  client: Client,
  name: string,
  args: Record<string, unknown>
): Promise<string> {
  const result = await client.callTool({ name, arguments: args })
  const parts = (result.content as Array<{ type: string; text?: string }>)
    .filter((c) => c.type === "text")
    .map((c) => c.text ?? "")
  return parts.join("\n")
}
