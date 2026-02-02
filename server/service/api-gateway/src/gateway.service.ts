import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';

interface ForwardRequestHeaders {
  [key: string]: string | string[];
}

interface ForwardRequestData {
  [key: string]: unknown;
}

@Injectable()
export class GatewayService {
  private authServiceUrl: string;

  constructor(
    private http: HttpService,
    private config: ConfigService,
  ) {
    this.authServiceUrl =
      this.config.get<string>('AUTH_SERVICE_URL') || 'http://localhost:3001';
  }

  /**
   * Проксирует запрос к auth-service
   */
  async forwardRequest(
    path: string,
    method: string,
    data?: ForwardRequestData,
    headers?: ForwardRequestHeaders,
  ): Promise<unknown> {
    const url = `${this.authServiceUrl}${path}`;

    const response: AxiosResponse<unknown> = (await this.http
      .request({
        method,
        url,
        data,
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
      })
      .toPromise())!;

    return response.data;
  }
}
