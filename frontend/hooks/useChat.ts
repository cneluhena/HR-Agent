import { useState, useCallback } from "react"

export type Message = {
    role: "user" | "assistant"
    content: string
    toolCalls?: string[]
}

export function useChat() {
    const [messages, setMessages] = useState<Message[]>([])
    const [isStreaming, setIsStreaming] = useState(false)

    const sendMessage = useCallback(async (text: string) => {

        setMessages(prev => [...prev, { role: "user", content: text }])
        setIsStreaming(true)

        const assistantMsg: Message = { role: "assistant", content: "", toolCalls: [] }
        setMessages(prev => [...prev, assistantMsg])

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
                        setMessages(prev => {
                            if (prev.length === 0) return prev

                            const updated = [...prev]
                            const last = updated[updated.length - 1]

                            updated[updated.length - 1] = {
                                ...last,
                                content: (last.content ?? "") + event.content,
                            }

                            return updated
                        })
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


        const finalLine = buffer.trim()
        if (finalLine.startsWith("data: ") && finalLine !== "data: [DONE]") {
            try {
                const event = JSON.parse(finalLine.slice(6))
                // handle event here the same way as above if needed
            } catch (err) {
                console.error("Failed to parse final SSE event:", finalLine, err)
            }
        }
        setIsStreaming(false)
    }, [])

    return { messages, isStreaming, sendMessage }
}