import { AnyObj, Maybe } from '../../shared/types';
import { errorMessage } from '../../shared/constants';
import { HttpStatus, Injectable } from '@nestjs/common';
import { HttpRequestHelper, IHttpRequestOptions } from '../../shared/abstractions';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import {
  BadRequestException,
  ConflictException,
  DomainException,
  NotFoundException,
  UnauthorizedException,
} from '../../shared/exception';

@Injectable()
export class AxiosHttpRequestHelper implements HttpRequestHelper {
  private axiosClient: AxiosInstance;

  constructor() {}

  init(baseUrl: string) {
    this.axiosClient = axios.create({ baseURL: baseUrl });
  }

  public getConfig(options?: IHttpRequestOptions): AxiosRequestConfig {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (options) {
      options.headers = { ...options.headers, ...headers };
    } else {
      options = { headers };
    }

    return options;
  }

  async get(urlSuffix: string, options?: IHttpRequestOptions) {
    try {
      return this.getResponse(await this.axiosClient.get(urlSuffix, this.getConfig(options)));
    } catch (error: any) {
      throw this.handleErrorResponse(error);
    }
  }

  async post(urlSuffix: string, data?: AnyObj, options?: IHttpRequestOptions) {
    try {
      return this.getResponse(
        await this.axiosClient.post(urlSuffix, data, this.getConfig(options))
      );
    } catch (error: any) {
      throw this.handleErrorResponse(error);
    }
  }

  async put(urlSuffix: string, data?: AnyObj, options?: IHttpRequestOptions) {
    try {
      return this.getResponse(await this.axiosClient.put(urlSuffix, data, this.getConfig(options)));
    } catch (error: any) {
      throw this.handleErrorResponse(error);
    }
  }

  async delete(urlSuffix: string, options?: IHttpRequestOptions) {
    try {
      return this.getResponse(await this.axiosClient.delete(urlSuffix, this.getConfig(options)));
    } catch (error: any) {
      throw this.handleErrorResponse(error);
    }
  }

  async patch(urlSuffix: string, data?: AnyObj, options?: IHttpRequestOptions) {
    try {
      return this.getResponse(
        await this.axiosClient.patch(urlSuffix, data, this.getConfig(options))
      );
    } catch (error: any) {
      throw this.handleErrorResponse(error);
    }
  }

  private getResponse(response: AxiosResponse<any, any>) {
    return Object.keys(response.data).includes('data') ? response.data.data : response.data;
  }

  protected handleErrorResponse(error: any) {
    if (error instanceof AxiosError && error.response) {
      return this.getDomainException(error.response);
    }

    return new DomainException(errorMessage.DEFAULT_ERROR, error.toString());
  }

  private getDomainException(response: AxiosResponse): DomainException {
    const statusCode = response.status;
    const message: string = response.data.error.displayMessage;
    const detail: Maybe<string> = response.data.error.logMessage;

    if (statusCode === HttpStatus.CONFLICT) return new ConflictException(message, detail);
    if (statusCode === HttpStatus.NOT_FOUND) return new NotFoundException(message, detail);
    if (statusCode === HttpStatus.UNAUTHORIZED) return new UnauthorizedException(message, detail);
    if (statusCode === HttpStatus.BAD_REQUEST) return new BadRequestException(message, detail);

    return new DomainException(errorMessage.DEFAULT_ERROR);
  }
}
