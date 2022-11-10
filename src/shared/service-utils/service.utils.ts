import { HttpRequestContextService } from '../http-request-context/http-request-context.service';

export const getChangeMakerValue = (
  httpRequestContextService: HttpRequestContextService,
) => {
  return httpRequestContextService.getUser()?.id
    ? httpRequestContextService.getUser()?.id.toString()
    : 'system';
};
