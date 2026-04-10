import { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  const body = await req.json()

  const backendResponse = await fetch("http://localhost:8000/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  })

  if (!backendResponse.ok) {
    const text = await backendResponse.text()
    return new Response(text, {
      status: backendResponse.status,
      headers: backendResponse.headers,
    })
  }

  const stream = new ReadableStream({
    async start(controller) {
      const reader = backendResponse.body?.getReader()
      if (!reader) {
        controller.close()
        return
      }

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          if (value) controller.enqueue(value)
        }
      } catch (error) {
        controller.error(error)
      } finally {
        controller.close()
      }
    },
  })

  const headers = new Headers(backendResponse.headers)
  headers.set("Content-Type", "text/event-stream")

  return new Response(stream, {
    status: backendResponse.status,
    headers,
  })
}