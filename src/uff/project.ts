// https://twitter.com/ajitid/status/1361332716566843395?s=20&t=kAMUIMXIIi8qAxnqENK3CQ

// for px/ms, not for pts/sec
export const project = (initialVelocity: number, decelerationRate: number) =>
  ((initialVelocity / window.devicePixelRatio) * decelerationRate) / (1.0 - decelerationRate);
