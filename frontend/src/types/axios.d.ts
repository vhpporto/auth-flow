import "axios";

interface ApiErrorResponse {
  message: string;
}

declare module "axios" {
  export interface AxiosError<T = any> {
    response?: {
      data: ApiErrorResponse;
      status: number;
      headers: any;
    };
  }
}
