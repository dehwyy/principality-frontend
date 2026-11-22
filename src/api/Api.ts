/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface DsArchaeologist {
  archaeologist_id?: number;
  archaeologist_login?: string;
  is_chronicle_keeper?: boolean;
}

export interface DsArchaeologistCredentials {
  archaeologist_login: string;
  archaeologist_password: string;
}

export interface DsArchaeologistRegistration {
  /** @maxLength 25 */
  archaeologist_login: string;
  /** @maxLength 100 */
  archaeologist_password: string;
}

export interface DsArchaeologistToken {
  access_token?: string;
  expires_in?: number;
  token_type?: string;
}

export interface DsPrincipalityCatalogSerializer {
  created_at?: string;
  created_by?: number;
  created_by_current_archaeologist?: number;
  founding_date?: string;
  image_key?: string;
  land_coefficient?: number;
  principality_id?: number;
  principality_image_url?: string;
  principality_like_count?: number;
  principality_name?: string;
  principality_status?: string;
  principality_summary?: string;
  principality_video_url?: string;
  published_at?: string;
  video_key?: string;
}

export interface DsPrincipalityFeedSerializer {
  created_at?: string;
  created_by?: number;
  founding_date?: string;
  image_key?: string;
  land_coefficient?: number;
  principality_id?: number;
  principality_image_url?: string;
  principality_like_count?: number;
  principality_liked?: number;
  principality_name?: string;
  principality_status?: string;
  principality_summary?: string;
  principality_video_url?: string;
  published_at?: string;
  video_key?: string;
}

export interface DsPrincipalityLikeMark {
  principality_liked: number;
}

export interface DsPrincipalityLikeSerializer {
  principality_id?: number;
  principality_like_count?: number;
  principality_liked?: number;
}

export interface DsPrincipalityPublication {
  founding_date: string;
  land_coefficient: number;
  principality_summary: string;
}

export interface DsPrincipalitySerializer {
  created_at?: string;
  created_by?: number;
  founding_date?: string;
  image_key?: string;
  land_coefficient?: number;
  principality_id?: number;
  principality_image_url?: string;
  principality_name?: string;
  principality_status?: string;
  principality_summary?: string;
  principality_video_url?: string;
  published_at?: string;
  video_key?: string;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "http://localhost:8080",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Княжества Древней Руси
 * @version 1.0
 * @license AS IS (NO WARRANTY)
 * @baseUrl http://localhost:8080
 * @contact Егор Купрюшин, ИУ5-52Б
 *
 * Веб-сервис учёта удельных княжеств Древней Руси
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  archaeologists = {
    /**
     * @description Создаёт археолога с логином и паролем, пароль хранится как SHA-1
     *
     * @tags Археологи
     * @name ArchaeologistsCreate
     * @summary Регистрация археолога
     * @request POST:/api/archaeologists
     */
    archaeologistsCreate: (
      registration: DsArchaeologistRegistration,
      params: RequestParams = {},
    ) =>
      this.request<DsArchaeologist, Record<string, string>>({
        path: `/api/archaeologists`,
        method: "POST",
        body: registration,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Проверяет логин и пароль и выдаёт JWT для заголовка Authorization
     *
     * @tags Археологи
     * @name ArchaeologistsLoginCreate
     * @summary Аутентификация археолога
     * @request POST:/api/archaeologists/login
     */
    archaeologistsLoginCreate: (
      credentials: DsArchaeologistCredentials,
      params: RequestParams = {},
    ) =>
      this.request<DsArchaeologistToken, void>({
        path: `/api/archaeologists/login`,
        method: "POST",
        body: credentials,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Кладёт JWT из заголовка Authorization в blacklist Redis
     *
     * @tags Археологи
     * @name ArchaeologistsLogoutCreate
     * @summary Деавторизация археолога
     * @request POST:/api/archaeologists/logout
     * @secure
     */
    archaeologistsLogoutCreate: (params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/archaeologists/logout`,
        method: "POST",
        secure: true,
        ...params,
      }),
  };
  principalities = {
    /**
     * @description Опубликованные княжества с фильтром по дате основания; признак created_by_current_archaeologist для автора, гостю 0
     *
     * @tags Княжества
     * @name PrincipalitiesList
     * @summary Список княжеств
     * @request GET:/api/principalities
     * @secure
     */
    principalitiesList: (
      query?: {
        /** Основано до даты, ГГГГ-ММ-ДД */
        foundedBefore?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<DsPrincipalityCatalogSerializer[], Record<string, string>>({
        path: `/api/principalities`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Создаёт черновик княжества с файлами изображения и видео в Minio; создатель берётся из JWT
     *
     * @tags Княжества
     * @name PrincipalitiesCreate
     * @summary Добавление княжества
     * @request POST:/api/principalities
     * @secure
     */
    principalitiesCreate: (
      data: {
        /** Название княжества */
        principality_name: string;
        /**
         * Изображение княжества
         * @format binary
         */
        principality_image: File;
        /**
         * Короткое видео княжества
         * @format binary
         */
        principality_video: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<DsPrincipalitySerializer, Record<string, string> | void>({
        path: `/api/principalities`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Черновик княжества текущего археолога, ид не указывается
     *
     * @tags Княжества
     * @name PrincipalitiesDraftList
     * @summary Черновик археолога
     * @request GET:/api/principalities/draft
     * @secure
     */
    principalitiesDraftList: (params: RequestParams = {}) =>
      this.request<DsPrincipalitySerializer, void | Record<string, string>>({
        path: `/api/principalities/draft`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Публикует черновик текущего археолога с описанием, датой основания и коэффициентом земли
     *
     * @tags Княжества
     * @name PrincipalitiesDraftPublishUpdate
     * @summary Публикация княжества
     * @request PUT:/api/principalities/draft/publish
     * @secure
     */
    principalitiesDraftPublishUpdate: (
      publication: DsPrincipalityPublication,
      params: RequestParams = {},
    ) =>
      this.request<DsPrincipalitySerializer, Record<string, string> | void>({
        path: `/api/principalities/draft/publish`,
        method: "PUT",
        body: publication,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Первое опубликованное княжество или княжество по ид; с next=true следующее за ним по кругу; признак principality_liked для археолога, гостю 0
     *
     * @tags Княжества
     * @name PrincipalitiesFeedList
     * @summary Лента княжеств
     * @request GET:/api/principalities/feed
     * @secure
     */
    principalitiesFeedList: (
      query?: {
        /** true — следующее княжество */
        next?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<DsPrincipalityFeedSerializer, Record<string, string>>({
        path: `/api/principalities/feed`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Первое опубликованное княжество или княжество по ид; с next=true следующее за ним по кругу; признак principality_liked для археолога, гостю 0
     *
     * @tags Княжества
     * @name PrincipalitiesFeedDetail
     * @summary Лента княжеств
     * @request GET:/api/principalities/feed/{principalityId}
     * @secure
     */
    principalitiesFeedDetail: (
      principalityId: number,
      query?: {
        /** true — следующее княжество */
        next?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<DsPrincipalityFeedSerializer, Record<string, string>>({
        path: `/api/principalities/feed/${principalityId}`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Логическое удаление своего княжества через статус removed
     *
     * @tags Княжества
     * @name PrincipalitiesDelete
     * @summary Удаление княжества
     * @request DELETE:/api/principalities/{principalityId}
     * @secure
     */
    principalitiesDelete: (
      principalityId: number,
      params: RequestParams = {},
    ) =>
      this.request<Record<string, string>, Record<string, string> | void>({
        path: `/api/principalities/${principalityId}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description 1 ставит лайк текущего археолога, 0 отменяет
     *
     * @tags Княжества
     * @name PrincipalitiesLikeCreate
     * @summary Лайк княжества
     * @request POST:/api/principalities/{principalityId}/like
     * @secure
     */
    principalitiesLikeCreate: (
      principalityId: number,
      like: DsPrincipalityLikeMark,
      params: RequestParams = {},
    ) =>
      this.request<DsPrincipalityLikeSerializer, Record<string, string> | void>(
        {
          path: `/api/principalities/${principalityId}/like`,
          method: "POST",
          body: like,
          secure: true,
          type: ContentType.Json,
          format: "json",
          ...params,
        },
      ),
  };
}
