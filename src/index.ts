import * as aws4 from 'aws4';
import axios, {AxiosHeaders} from 'axios';

export class IncentivesAPI {
  private partnerId: string;
  private accessKeyId: string;
  private secretAccessKey: string;
  private endpoint: IncentivesAPI.Endpoint;
  constructor(params: {
    partnerId: string;
    accessKeyId: string;
    secretAccessKey: string;
    endpoint: IncentivesAPI.Endpoint;
  }) {
    this.partnerId = params.partnerId;
    this.accessKeyId = params.accessKeyId;
    this.secretAccessKey = params.secretAccessKey;
    this.endpoint = params.endpoint;
  }

  /**
   * Creates a live gift card claim code and deducts the amount from the pre-payment account.
   * The `creationRequestId` must start from `partnerId`.
   * The `creationRequestId` must not exceed 40 characters.
   * See details: https://developer.amazon.com/ja/docs/incentives-api/digital-gift-cards.html#creategiftcard
   */
  async createGiftCard(
    params: {
      creationRequestId: string;
      currencyCode: string;
      amount: number;
    },
    options?: {
      transactionSource?: Object;
      sourceId?: string;
      institutionId?: string;
      sourceDetails?: string;
      programId?: string;
      productType?: string;
      externalReference?: string;
    }
  ): Promise<IncentivesAPI.CreateGiftCardResponse> {
    const createGiftCardRequest: IncentivesAPI.CreateGiftCardRequest = {
      creationRequestId: params.creationRequestId,
      partnerId: this.partnerId,
      value: {
        amount: params.amount,
        currencyCode: params.currencyCode,
      },
      ...options,
    };
    return this.sendAwsSignedRequest<
      IncentivesAPI.CreateGiftCardRequest,
      IncentivesAPI.CreateGiftCardResponse
    >('CreateGiftCard', createGiftCardRequest);
  }

  /**
   * Cancel a gift card, as long as the gift card is not claimed by an Amazon customer.
   * Important: This operation can only be started within 15 minutes of the creation request time stamp.
   * See details: https://developer.amazon.com/ja/docs/incentives-api/digital-gift-cards.html#cancelgiftcard
   */
  async cancelGiftCard(
    creationRequestId: string
  ): Promise<IncentivesAPI.CancelGiftCardResponse> {
    const createGiftCardRequest: IncentivesAPI.CancelGiftCardRequest = {
      creationRequestId: creationRequestId,
      partnerId: this.partnerId,
    };
    return this.sendAwsSignedRequest<
      IncentivesAPI.CancelGiftCardRequest,
      IncentivesAPI.CancelGiftCardResponse
    >('CancelGiftCard', createGiftCardRequest);
  }

  /**
   * Get the current balance of available funds in your Amazon Incentives account.
   * Important: This operation is throttled at one transaction per second.
   * Attempts to send requests at a greater rate will be ignored.
   * See details: https://developer.amazon.com/ja/docs/incentives-api/balance-view.html#getavailablefunds
   */
  async getAvailableFunds(): Promise<IncentivesAPI.GetAvailableFundsResponse> {
    const getAvailableFundsRequest: IncentivesAPI.GetAvailableFundsRequest = {
      partnerId: this.partnerId,
    };
    return this.sendAwsSignedRequest<
      IncentivesAPI.GetAvailableFundsRequest,
      IncentivesAPI.GetAvailableFundsResponse
    >('GetAvailableFunds', getAvailableFundsRequest);
  }

  private async sendAwsSignedRequest<Request, Response>(
    operation: 'CreateGiftCard' | 'CancelGiftCard' | 'GetAvailableFunds',
    requestParams: Request
  ): Promise<Response> {
    const signedRequest = aws4.sign(
      {
        host: this.endpoint.host,
        region: this.endpoint.region,
        path: `/${operation}`,
        body: JSON.stringify(requestParams),
        service: 'AGCODService',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          'x-amz-target': `com.amazonaws.agcod.AGCODService./${operation}`,
        },
      },
      {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey,
      }
    );

    const response = await axios.post<Response>(
      `https://${signedRequest.host}${signedRequest.path}`,
      signedRequest.body,
      {
        headers: signedRequest.headers as AxiosHeaders,
      }
    );

    return response.data;
  }
}

/*
 * See details: https://developer.amazon.com/ja/docs/incentives-api/incentives-api.html#endpoints
 */
export namespace IncentivesAPI {
  // Naming convention follows the the scratchpad: https://s3.amazonaws.com/AGCOD/htmlSDKv2/htmlSDKv2_NAEUFE/index.html
  export class Endpoint {
    // Sandbox Endpoints
    static NorthAmericaSandbox = new Endpoint(
      'agcod-v2-gamma.amazon.com',
      'us-east-1'
    );

    static EuropeSandbox = new Endpoint(
      'agcod-v2-eu-gamma.amazon.com',
      'eu-west-1'
    );

    static JapanSandbox = new Endpoint(
      'agcod-v2-fe-gamma.amazon.com',
      'us-west-2'
    );

    // Production Endpoints
    static NorthAmericaProduction = new Endpoint(
      'agcod-v2.amazon.com',
      'us-east-1'
    );

    static EuropeProduction = new Endpoint(
      'agcod-v2-eu.amazon.com',
      'eu-west-1'
    );

    static JapanProduction = new Endpoint(
      'agcod-v2-fe.amazon.com',
      'us-west-2'
    );
    constructor(public host: string, public region: string) {}
  }

  /**
   * See details: https://developer.amazon.com/ja/docs/incentives-api/digital-gift-cards.html#requests
   */
  export interface CreateGiftCardRequest {
    creationRequestId: string;
    partnerId: string;
    value: GiftCardValue;
    /// B&M Only
    transactionSource?: Object | null;
    sourceId?: string | null;
    institutionId?: string | null;
    sourceDetails?: string | null;
    /// Reseller Only
    programId?: string | null;
    /// PV Use Case Only
    productType?: string | null;

    /// Optional
    externalReference?: string | null;
  }

  /**
   * See details: https://developer.amazon.com/ja/docs/incentives-api/digital-gift-cards.html#responses
   */
  export interface CreateGiftCardResponse {
    creationRequestId: string;
    cardInfo: GiftCardInfo;
    gcClaimCode: string;
    gcId: string;
    gcExpirationDate: string;
    status: string;
  }

  /**
   * See details: https://developer.amazon.com/ja/docs/incentives-api/balance-view.html#requests
   */
  export interface GetAvailableFundsRequest {
    partnerId: string;
  }

  /**
   * See details: https://developer.amazon.com/ja/docs/incentives-api/balance-view.html#requests
   */
  export interface GetAvailableFundsResponse {
    availableFunds: {
      amount: number;
      currencyCode: string;
    };
    status: string;
    timestamp: string;
  }

  export interface GiftCardInfo {
    cardStatus: string;
    value: GiftCardValue;
  }

  export interface GiftCardValue {
    currencyCode: string;
    amount: number;
  }

  /**
   * See details: https://developer.amazon.com/ja/docs/incentives-api/digital-gift-cards.html#requests-1
   */
  export interface CancelGiftCardRequest {
    creationRequestId: string;
    partnerId: string;
  }

  /**
   * See details: https://developer.amazon.com/ja/docs/incentives-api/digital-gift-cards.html#responses-1
   */
  export interface CancelGiftCardResponse {
    creationRequestId: string;
    status: string;
  }
}
