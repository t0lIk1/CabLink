import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import type { Response } from 'express';

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
   * Проксирует запрос к auth-service и копирует cookies из ответа
   */
  async forwardRequest(
    path: string,
    method: string,
    data?: ForwardRequestData,
    headers?: ForwardRequestHeaders,
    res?: Response,
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

    // Если есть cookies в ответе от auth-service, копируем их в клиентский ответ
    if (res && response.headers['set-cookie']) {
      const setCookieHeader = response.headers['set-cookie'];
      if (Array.isArray(setCookieHeader)) {
        setCookieHeader.forEach((cookie) => {
          res.appendHeader('Set-Cookie', cookie);
        });
      } else if (typeof setCookieHeader === 'string') {
        res.setHeader('Set-Cookie', setCookieHeader);
      }
    }

    return response.data;
  }
}
