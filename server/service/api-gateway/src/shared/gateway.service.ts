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
  private userServiceUrl: string;
  private bookingServiceUrl: string;
  private paymentServiceUrl: string;

  constructor(
    private http: HttpService,
    private config: ConfigService,
  ) {
    this.authServiceUrl =
      this.config.get<string>('AUTH_SERVICE_URL') || 'http://localhost:3001';
    this.userServiceUrl =
      this.config.get<string>('USER_SERVICE_URL') || 'http://localhost:3002';
    this.bookingServiceUrl =
      this.config.get<string>('BOOKING_SERVICE_URL') || 'http://localhost:3003';
    this.paymentServiceUrl =
      this.config.get<string>('PAYMENT_SERVICE_URL') || 'http://localhost:3004';
  }

  /**
   * Определяет, какому сервису отправить запрос
   */
  private getServiceUrl(path: string): string {
    if (path.startsWith('/auth')) return this.authServiceUrl;
    if (path.startsWith('/users')) return this.userServiceUrl;
    if (path.startsWith('/bookings')) return this.bookingServiceUrl;
    if (path.startsWith('/payments')) return this.paymentServiceUrl;

    // По умолчанию auth-service
    return this.authServiceUrl;
  }

  /**
   * Проксирует запрос к нужному микросервису
   */
  async forwardRequest(
    path: string,
    method: string,
    data?: ForwardRequestData,
    headers?: ForwardRequestHeaders,
  ): Promise<unknown> {
    const serviceUrl = this.getServiceUrl(path);
    const url = `${serviceUrl}${path}`;

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
