import type { Task } from "../types/task";
import type { HttpClient, HttpRequestOptions } from "./http.client.interface";

export class RateLimitedHttpClient implements HttpClient {
    private readonly queue: Task[] = [];
    private isProcessing = false;

    constructor(
        private readonly inner: HttpClient,
        private readonly intervalMs: number
    ) {}

    async post<T>(
        url: string,
        body: unknown,
        options?: HttpRequestOptions
    ): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            const task: Task = async () => {
                try {
                    const result = await this.inner.post<T>(
                        url,
                        body,
                        options
                    );

                    resolve(result);
                } catch (err) {
                    reject(err)
                }
            };

            this.queue.push(task);

            void this.processQueue();
        })
    }

    private async processQueue(): Promise<void> {
        if (this.isProcessing) {
            return;
        }

        this.isProcessing = true;

        while (this.queue.length > 0) {
            const task = this.queue.shift();
            if (task) {
                void task();
            }

            await this.sleep(this.intervalMs);
        }

        this.isProcessing = false;
    }

    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms))
    }
}