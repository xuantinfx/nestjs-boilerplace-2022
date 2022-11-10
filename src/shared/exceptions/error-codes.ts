/**
 * Return errorCode & message for NestJs HttpException's response.
 * Front-end can build i18n message based on this errorCode
 * in-case status code is not enough information.
 */
export interface ErrorCodeResponse {
  errorCode: string;
  message: string;
}

export function createErrorCodeObject(errorCode, message): ErrorCodeResponse {
  return { errorCode, message };
}

export function entityNotFoundErrorCode(
  entityName: string,
  id: unknown,
): ErrorCodeResponse {
  const errorCode = `${entityName}.not_found`;
  const message = `The ${entityName} ${id} is not found`;
  return createErrorCodeObject(errorCode, message);
}

export function createFailedErrorCode(
  entityName: string,
  message?: string,
): ErrorCodeResponse {
  const errorCode = `${entityName}.create_failed`;
  return createErrorCodeObject(errorCode, message);
}

export function deleteFailedErrorCode(
  entityName: string,
  message?: string,
): ErrorCodeResponse {
  const errorCode = `${entityName}.delete_failed`;
  return createErrorCodeObject(errorCode, message);
}
