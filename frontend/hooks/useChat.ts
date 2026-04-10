import { useState, useCallback } from "react"

export type Message = {
    role: "user" | "assistant"
    content: string
    toolCalls?: string[]
}

export function useChat() {
    const [messages, setMessages] = useState<Message[]>([])
    const [isStreaming, setIsStreaming] = useState(false)

    const appendToken = (token: string) => {
        setMessages(prev => {
            if (prev.length === 0) return prev
            const updated = [...prev]
            const last = updated[updated.length - 1]
            updated[updated.length - 1] = {
                ...last,
                content: last.content + token,
            }
            return updated
        })
    }

    const sendMessage = useCallback(async (text: string) => {
        setMessages(prev => [...prev, { role: "user", content: text }])
        setIsStreaming(true)
        setMessages(prev => [...prev, { role: "assistant", content: "", toolCalls: [] }])

        const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: text, session_id: "demo", employee_id: "EMP001" }),
        })

        const reader = res.body?.getReader()
        if (!reader) throw new Error("Response body is missing")

        const decoder = new TextDecoder()
        let buffer = ""

        while (true) {
            const { done, value } = await reader.read()

            if (done) {
                buffer += decoder.decode()
                break
            }

            buffer += decoder.decode(value, { stream: true })

            const lines = buffer.split("\n")
            buffer = lines.pop() ?? ""

            for (const rawLine of lines) {
                const line = rawLine.trim()
                if (!line.startsWith("data: ")) continue
                if (line === "data: [DONE]") continue

                try {
                    const event = JSON.parse(line.slice(6))

                    if (event.type === "token") {
                        appendToken(event.content)
                        await new Promise(resolve => setTimeout(resolve, 20)) 
                    } else if (event.type === "tool_start") {
                        setMessages(prev => {
                            if (prev.length === 0) return prev
                            const updated = [...prev]
                            const last = updated[updated.length - 1]
                            updated[updated.length - 1] = {
                                ...last,
                                toolCalls: [...(last.toolCalls ?? []), event.tool],
                            }
                            return updated
                        })
                    }
                } catch (err) {
                    console.error("Failed to parse SSE event:", line, err)
                }
            }

        }

        setIsStreaming(false)
    }, [])

    return { messages, isStreaming, sendMessage }
}