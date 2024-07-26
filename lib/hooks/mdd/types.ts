export enum EAnkhErrorSeverity {
  Fatal,
}

export interface IAnkhUseErrorOptions {
  message: string;
  severity?: EAnkhErrorSeverity;
}