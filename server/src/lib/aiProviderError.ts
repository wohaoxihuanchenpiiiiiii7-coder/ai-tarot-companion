export class AiProviderError extends Error {
  readonly status: 502 | 503
  readonly publicMessage: string

  constructor(
    message: string,
    status: 502 | 503,
    publicMessage: string,
  ) {
    super(message)
    this.name = 'AiProviderError'
    this.status = status
    this.publicMessage = publicMessage
  }
}
