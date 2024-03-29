export async function shouldThrowError(cb: any, errorType: any = Error) {
  async function action(cb: (...args: any) => any) {
    await cb();
  }
  await expect(action(cb as any)).rejects.toThrow(errorType);
}
