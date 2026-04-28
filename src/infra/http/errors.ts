export class HttpError extends Error {
  readonly status: number;
  readonly statusText: string;
  readonly url: string;
  readonly body: unknown;

  constructor(params: {
    message: string;
    status: number;
    statusText: string;
    url: string;
    body: unknown;
  }) {
    super(params.message);
    this.status = params.status;
    this.statusText = params.statusText;
    this.url = params.url;
    this.body = params.body;
  }
}