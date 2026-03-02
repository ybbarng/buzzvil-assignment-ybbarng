/** Omit을 discriminated union에서 분산 적용하는 유틸리티 타입 */
export type DistributiveOmit<T, K extends keyof T> = T extends T
  ? Omit<T, K>
  : never;
