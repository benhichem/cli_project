import { test, expect, mock, beforeEach, describe } from "bun:test"
import type { Bot } from "grammy"

// --- DB mocks (must be declared before importing the module under test) ---

const mockCreateTask = mock((text: string) => ({
  id: 1,
  text,
  status: "open" as const,
  created_at: new Date().toISOString(),
  completed_at: null,
}))

const mockGetTasks = mock(() => [] as { id: number; text: string }[])
const mockCompleteTask = mock((_id: number) => true)

mock.module("../db/index", () => ({
  createTask: mockCreateTask,
  getTasks: mockGetTasks,
  completeTask: mockCompleteTask,
}))

// Import AFTER mocks are registered
const { registerTaskCommands } = await import("./tasks")

// --- Fake bot that captures command handlers ---

type Handler = (ctx: any) => any

function buildBot() {
  const handlers: Record<string, Handler> = {}
  const bot = {
    command(name: string, handler: Handler) {
      handlers[name] = handler
    },
  } as unknown as Bot

  registerTaskCommands(bot)
  return handlers
}

// --- Context factory ---

function makeCtx(match: string) {
  const replies: string[] = []
  return {
    match,
    reply: mock((text: string) => { replies.push(text); return Promise.resolve({}) }),
    replies,
  }
}

// ─────────────────────────────────────────────
// Tests
// ─────────────────────────────────────────────

describe("/todo add", () => {
  const handlers = buildBot()

  beforeEach(() => {
    mockCreateTask.mockClear()
    mockGetTasks.mockClear()
    mockCompleteTask.mockClear()
  })

  test("adds a task and replies with its id and text", async () => {
    mockCreateTask.mockReturnValueOnce({
      id: 1, text: "buy milk", status: "open", created_at: "", completed_at: null,
    })
    const ctx = makeCtx("add buy milk")
    await handlers["todo"](ctx)
    expect(ctx.replies[0]).toBe("Task #1 added: buy milk")
    expect(mockCreateTask).toHaveBeenCalledWith("buy milk")
  })

  test("replies with error when no text provided", async () => {
    const ctx = makeCtx("add ")
    await handlers["todo"](ctx)
    expect(ctx.replies[0]).toBe("Please provide a task description.")
    expect(mockCreateTask).not.toHaveBeenCalled()
  })
})

describe("/todo list", () => {
  const handlers = buildBot()

  beforeEach(() => {
    mockGetTasks.mockClear()
  })

  test("shows numbered list when tasks exist", async () => {
    mockGetTasks.mockReturnValueOnce([
      { id: 1, text: "fix Streeteasy login issue" },
      { id: 2, text: "send invoice to Marcus" },
    ])
    const ctx = makeCtx("list")
    await handlers["todo"](ctx)
    expect(ctx.replies[0]).toBe(
      "Open tasks:\n1. fix Streeteasy login issue\n2. send invoice to Marcus"
    )
  })

  test("replies 'No open tasks.' when list is empty", async () => {
    mockGetTasks.mockReturnValueOnce([])
    const ctx = makeCtx("list")
    await handlers["todo"](ctx)
    expect(ctx.replies[0]).toBe("No open tasks.")
  })
})

describe("/done", () => {
  const handlers = buildBot()

  beforeEach(() => {
    mockCompleteTask.mockClear()
  })

  test("marks task done and replies with id", async () => {
    mockCompleteTask.mockReturnValueOnce(true)
    const ctx = makeCtx("1")
    await handlers["done"](ctx)
    expect(ctx.replies[0]).toBe("Task #1 done.")
    expect(mockCompleteTask).toHaveBeenCalledWith(1)
  })

  test("replies 'Task not found.' for unknown id", async () => {
    mockCompleteTask.mockReturnValueOnce(false)
    const ctx = makeCtx("999")
    await handlers["done"](ctx)
    expect(ctx.replies[0]).toBe("Task not found.")
  })

  test("replies with error for non-integer input", async () => {
    const ctx = makeCtx("abc")
    await handlers["done"](ctx)
    expect(ctx.replies[0]).toBe("Please provide a task number.")
    expect(mockCompleteTask).not.toHaveBeenCalled()
  })
})
