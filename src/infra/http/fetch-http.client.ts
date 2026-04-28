import { fetch } from "bun";
import type { HttpClient, HttpRequestOptions } from "./http.client.interface";
import { HttpError } from "../errors";

export class FetchHttpClient implements HttpClient {
    async post<TResponse>(
        url: string,
        body: unknown,
        options: HttpRequestOptions = {}
    ): Promise<TResponse> {
        const {
            headers = {},
            timeoutMs = 10_000,
            retries = 0
        } = options;

        let attempt = 0;
        while (true) {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), timeoutMs);

            try {
                const response = await fetch(url, {
                    method: "POST",
                    body: JSON.stringify(body),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        ...headers
                    }
                });
                const parsed = await this.parseBody(response);
                if (!response.ok) {
                    if (this.shouldRetry(response.status) && attempt < retries) {
                        attempt++;
                        continue;
                    }
                    throw new HttpError({
                        message: `HTTP ${response.status} ${response.statusText}`,
                        status: response.status,
                        statusText: response.statusText,
                        url,
                        body: parsed
                    });
                }

                // TODO: need to validate shape of parsed JSON against ProjectsOutput
                return parsed as TResponse
            } catch (err) {
                if (this.isAbortError(err)) {
                    if (attempt < retries) {
                        attempt++;
                        continue;
                    }
                    throw new Error(`Request timed out after ${timeoutMs}ms`);
                }

                if (attempt < retries) {
                    attempt++;
                    continue;
                }

                throw new Error(`Network error ${String(err)}`);
            } finally {
                clearTimeout(timeout);
            }
        }
    }

    private async parseBody(response: Response): Promise<unknown> {
        const contentType = response.headers.get("content-type") ?? "";
        if (contentType.includes("application/json")) {
            try {
                return await response.json();
            } catch {
                return null;
            }
        }

        try {
            return await response.text();
        } catch {
            return null;
        }
    }

    private shouldRetry(status: number): boolean {
        return status === 429 || (status >= 500 && status < 600);
    }

    private isAbortError(err: unknown): boolean {
        return (
            typeof err === "object" &&
            err !== null &&
            "name" in err &&
            (err as any).name === "AbortError"
        );
    }
}