export async function shouldThrowError(
  cb: any,
  errorType: ErrorConstructor = Error
) {
  async function action(cb: (...args: any) => any) {
    await cb();
  }
  await expect(action(cb as any)).rejects.toThrow(errorType);
}

export async function shouldThrowTypeError(
  cb: any,
) {
  await shouldThrowError(cb, TypeError);
}
