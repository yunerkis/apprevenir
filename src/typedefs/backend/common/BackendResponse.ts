export interface BackendResponse<TContent> {
  success: boolean,
  errors?: string | { [key: string]: string[] },
  data: TContent
}