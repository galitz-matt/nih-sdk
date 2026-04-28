export interface HttpClient {
    post<TResponse>(
        url: string, 
        body: unknown,
        options?: HttpRequestOptions
    ): Promise<TResponse>
}

export type HttpRequestOptions = {
    headers?: Record<string, string>;
    timeoutMs?: number;
    retries?: number;
}