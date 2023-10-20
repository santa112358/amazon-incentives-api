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
   * Creates a gift card.
   * Note: The `creationRequestId` parameter will be internally prefixed with the `partnerId`.
   * The combined length of `partnerId` and `creationRequestId` must not exceed 40 characters.
   */
  async createGiftCard(
    params: {
      creationRequestId: string;
    } & IncentivesAPI.GiftCardValue
  ): Promise<IncentivesAPI.CreateGiftCardResponse> {
    const createGiftCardRequestParams: IncentivesAPI.CreateGiftCardRequest = {
      creationRequestId: `${this.partnerId}${params.creationRequestId}`,
      partnerId: this.partnerId,
      value: {
        amount: params.amount,
        currencyCode: params.currencyCode,
      },
    };
    const operation = 'CreateGiftCard';
    const signedRequest = aws4.sign(
      {
        host: this.endpoint.host,
        region: this.endpoint.region,
        path: `/${operation}`,
        body: JSON.stringify(createGiftCardRequestParams),
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
    const response = await axios.post(
      `https://${signedRequest.host}${signedRequest.path}`,
      signedRequest.body,
      {
        headers: signedRequest.headers as AxiosHeaders,
      }
    );
    const responseData = response.data;
    const parsedResponse: IncentivesAPI.CreateGiftCardResponse = {
      creationRequestId: responseData.creationRequestId,
      cardInfo: {
        cardStatus: responseData.cardInfo.cardStatus,
        value: {
          currencyCode: responseData.cardInfo.value.currencyCode,
          amount: responseData.cardInfo.value.amount,
        },
      },
      gcClaimCode: responseData.gcClaimCode,
      gcId: responseData.gcId,
      gcExpirationDate: responseData.gcExpirationDate,
      status: responseData.status,
    };
    return parsedResponse;
  }
}

export namespace IncentivesAPI {
  /**
   * See details: https://developer.amazon.com/ja/docs/incentives-api/digital-gift-cards.html#requests
   */
  export interface CreateGiftCardRequest {
    creationRequestId: string;
    partnerId: string;
    value: GiftCardValue;
    /// B&M Only
    transactionSource?: Object;
    sourceId?: string;
    institutionId?: string;
    sourceDetails?: string;
    /// Reseller Only
    programId?: string;
    /// PV Use Case Only
    productType?: string;

    /// Optional
    externalReference?: string;
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

  export interface GiftCardInfo {
    cardStatus: string;
    value: GiftCardValue;
  }

  export interface GiftCardValue {
    currencyCode: string;
    amount: number;
  }

  /// Naming convention follows the the scratchpad: https://s3.amazonaws.com/AGCOD/htmlSDKv2/htmlSDKv2_NAEUFE/index.html
  export class Endpoint {
    /// Sandbox Endpoints
    static NorthAmericaSandbox = new Endpoint(
      'agcod-v2-gamma.amazon.com',
      'us-east-1'
    );

    static EuropeSandbox = new Endpoint(
      'agcod-v2-gamma.amazon.co.uk',
      'eu-west-1'
    );

    static JapanSandbox = new Endpoint(
      'agcod-v2-gamma.amazon.co.jp',
      'us-east-1'
    );

    /// Production Endpoints
    static NorthAmericaProduction = new Endpoint(
      'agcod-v2.amazon.com',
      'us-east-1'
    );

    static EuropeProduction = new Endpoint(
      'agcod-v2.amazon.co.uk',
      'eu-west-1'
    );

    static JapanProduction = new Endpoint('agcod-v2.amazon.co.jp', 'us-east-1');
    constructor(public host: string, public region: string) {}
  }
}
