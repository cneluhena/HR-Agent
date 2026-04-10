"use client"
import { useChat } from "@/hooks/useChat"
import { useEffect, useMemo, useRef, useState } from "react"

const roleOptions = [
  {
    key: "employee",
    label: "Employee",
    description: "Ask about leave, payroll, benefits, and personal HR support.",
  },
  {
    key: "manager",
    label: "HR Manager",
    description: "Manage policy, approvals, hiring, and team guidance conversations.",
  },
]

const quickPrompts = {
  employee: [
    "How do I request vacation leave?",
    "What is my current leave balance?",
    "Explain the payroll schedule for this month.",
    "Where can I find the company benefits summary?",
  ],
  manager: [
    "Summarize the performance review process.",
    "What are the key steps for a policy update?",
    "Which employees are eligible for promotion this quarter?",
    "How should I handle a compensation question?",
  ],
}

export default function Home() {
  const { messages, isStreaming, sendMessage } = useChat()
  const [input, setInput] = useState("")
  const [role, setRole] = useState<"employee" | "manager">("employee")
  const prompts = useMemo(() => quickPrompts[role], [role])
  const messageListRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const container = messageListRef.current
    if (!container) return
    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" })
  }, [messages, isStreaming])

  const handleSend = (text?: string) => {
    const message = text ?? input
    if (!message.trim()) return
    sendMessage(message)
    setInput("")
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-6 pb-32 sm:px-6 lg:px-8">
        <header className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.9)] backdrop-blur-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-cyan-300/90">
                HR Assistant
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                A smart, friendly workspace for employees and HR managers.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Ask questions, review policies, and get action-ready HR guidance with an elegant conversational experience designed for both everyday staff and HR leaders.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-950/70 p-4 ring-1 ring-white/10">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Built for</p>
                <p className="mt-3 text-lg font-semibold text-white">Employees</p>
                <p className="mt-2 text-sm text-slate-400">
                  Quick HR answers for leave, benefits, payroll, and day-to-day policies.
                </p>
              </div>
              <div className="rounded-3xl bg-slate-950/70 p-4 ring-1 ring-white/10">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Designed for</p>
                <p className="mt-3 text-lg font-semibold text-white">HR Managers</p>
                <p className="mt-2 text-sm text-slate-400">
                  Policy guidance, process support, and team leadership in a single chat.
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="space-y-6">
            <section className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-5 shadow-[0_25px_50px_-35px_rgba(15,23,42,0.9)]">
              <h2 className="text-lg font-semibold text-white">Choose your role</h2>
              <p className="mt-2 text-sm text-slate-400">
                Switch between employee and HR manager modes to get tailored answers and prompt suggestions.
              </p>
              <div className="mt-4 space-y-3">
                {roleOptions.map(option => {
                  const selected = option.key === role
                  return (
                    <button
                      key={option.key}
                      onClick={() => setRole(option.key as "employee" | "manager")}
                      className={`w-full rounded-3xl border px-4 py-4 text-left transition ${selected ? "border-cyan-400/40 bg-cyan-500/10 text-cyan-100 shadow-[inset_0_0_0_1px_rgba(56,189,248,0.18)]" : "border-white/10 bg-slate-950/80 text-slate-200 hover:border-white/20 hover:bg-slate-900/80"}`}
                    >
                      <span className="block text-sm font-semibold">{option.label}</span>
                      <span className="mt-1 block text-sm text-slate-400">{option.description}</span>
                    </button>
                  )
                })}
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-5 shadow-[0_25px_50px_-35px_rgba(15,23,42,0.9)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-white">Quick prompts</h2>
                  <p className="mt-2 text-sm text-slate-400">Tap one to start a smart HR conversation instantly.</p>
                </div>
                <span className="inline-flex items-center rounded-full bg-slate-800/80 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-400">
                  {role === "employee" ? "Employee" : "Manager"}
                </span>
              </div>
              <div className="mt-4 grid gap-3">
                {prompts.map(prompt => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    className="rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-left text-sm text-slate-200 transition hover:border-cyan-400/40 hover:bg-cyan-500/10"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-5 shadow-[0_25px_50px_-35px_rgba(15,23,42,0.9)]">
              <h2 className="text-lg font-semibold text-white">Tips for better answers</h2>
              <ul className="mt-4 space-y-3 text-sm text-slate-400">
                <li> Use clear context like department, dates, or policy areas.</li>
                <li> Ask for step-by-step actions when requesting approvals.</li>
                <li> Mention whether you are an employee or manager for tailored guidance.</li>
              </ul>
            </section>
          </aside>

          <section className="flex min-h-[calc(100vh-5rem)] flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/80 shadow-[0_35px_80px_-40px_rgba(15,23,42,0.9)]">
            <div className="flex flex-col gap-3 border-b border-white/10 bg-slate-900/90 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-cyan-300/90">Conversation</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">HR Assistant chat</h2>
              </div>
              <div className="rounded-3xl bg-slate-900/80 px-4 py-2 text-sm text-slate-300 ring-1 ring-white/10">
                Current view: <span className="font-semibold text-white">{role === "employee" ? "Employee" : "HR Manager"}</span>
              </div>
            </div>

            <div ref={messageListRef} className="flex-1 space-y-4 overflow-y-auto p-6 pb-32">
              {messages.length === 0 ? (
                <div className="rounded-[1.75rem] border border-dashed border-white/10 bg-slate-900/80 p-8 text-center text-slate-400">
                  <p className="text-lg font-semibold text-white">Welcome to your HR assistant.</p>
                  <p className="mt-3 text-sm leading-6">
                    Start a conversation using the prompt buttons or type your own HR question. The assistant will help with leave, payroll, policies, and more.
                  </p>
                </div>
              ) : null}

              {messages.map((msg, i) => {
                const isUser = msg.role === "user"
                return (
                  <div key={i} className={`grid gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-3xl rounded-[1.75rem] px-6 py-4 text-sm leading-6 shadow-[0_18px_50px_-20px_rgba(15,23,42,0.65)] ${isUser ? "bg-cyan-500/90 text-white" : "bg-slate-900/90 text-slate-200"}`}>
                      <div className="flex items-center justify-between gap-4 pb-2">
                        <span className="text-xs uppercase tracking-[0.24em] text-slate-300/80">
                          {isUser ? "You" : "HR Assistant"}
                        </span>
                        {msg.toolCalls && msg.toolCalls.length > 0 ? (
                          <span className="rounded-full bg-slate-800/80 px-3 py-1 text-xs text-slate-400">
                            Tools: {msg.toolCalls.join(", ")}
                          </span>
                        ) : null}
                      </div>
                      <p>{msg.content}</p>
                    </div>
                  </div>
                )
              })}
            </div>

          </section>
        </div>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-50 bg-slate-950/95 border-t border-white/10 backdrop-blur-xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <label className="sr-only" htmlFor="hr-chat-input">Type your message</label>
          <input
            id="hr-chat-input"
            className="min-h-[3rem] flex-1 rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSend()}
            placeholder={role === "employee" ? "Ask about your leave, payroll, benefits..." : "Ask about policies, approvals, team support..."}
          />
          <button
            onClick={() => handleSend()}
            className="inline-flex h-12 shrink-0 items-center justify-center rounded-3xl bg-cyan-500 px-5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Send
          </button>
        </div>
        {isStreaming && (
          <p className="mt-3 text-center text-sm text-slate-400">Generating a helpful HR response...</p>
        )}
      </div>
    </main>
  )
}
