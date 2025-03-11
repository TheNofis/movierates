interface IStatus {
  content?: object | string | null;
  error?: Error | string;
}

export interface IResponse extends IStatus {
  status: Status;
  code: number;
  time: number;
}

export enum Status {
  Success = 'Success',
  Error = 'Error',
  Unknown = 'Unknown',
}

export default class ResponseService {
  constructor() {
    this.startTime = Date.now();
  }

  private startTime: number;
  private response(
    status: Status,
    content: IStatus['content'],
    code: IResponse['code'],
  ): IResponse {
    return {
      status,
      content,
      code,
      time: Date.now() - this.startTime,
    };
  }
  start() {
    this.startTime = Date.now();
  }

  error(
    content: IStatus['error'] = 'Not error',
    code: IResponse['code'] = 200,
  ): IResponse {
    return this.response(Status.Error, content, code);
  }

  unknown(
    content: IStatus['content'] = 'Unknown',
    code: IResponse['code'] = 200,
  ): IResponse {
    return this.response(Status.Unknown, content, code);
  }

  success(
    content: IStatus['content'] = 'Not content',
    code: IResponse['code'] = 100,
  ): IResponse {
    return this.response(Status.Success, content, code);
  }
}
