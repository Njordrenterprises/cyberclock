import { APIEvent } from "@solidjs/start/server";

export function GET(event: APIEvent) {
  return new Response("OK", {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
