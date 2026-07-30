import { JwtPayload } from 'jsonwebtoken';

export function isCustomPayload(
  payload: string | JwtPayload | undefined,
): payload is JwtPayload & {
  id: string;
} {
  if (typeof payload !== 'object' || payload === null) {
    return false;
  }

  return 'id' in payload;
}
