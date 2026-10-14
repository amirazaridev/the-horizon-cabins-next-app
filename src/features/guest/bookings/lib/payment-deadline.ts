export function isPaymentExpired(
  deadline: string,
  now: number = Date.now(),
): boolean {
  return new Date(deadline).getTime() <= now;
}
