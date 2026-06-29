import { HttpMethod } from './HttpMethod';

interface ApiCall {
  request<T>(
    method: HttpMethod,
    endpoint: string,
    payload?: any,
    customHeaders?: object,
  ): Promise<T>;
}

export default ApiCall;
