import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function hasBatchim(char: string): boolean {
  const code = char.charCodeAt(0);
  if (code < 0xac00 || code > 0xd7a3) return false;
  return (code - 0xac00) % 28 !== 0;
}

export function josa(
  word: string,
  withBatchim: string,
  withoutBatchim: string,
): string {
  if (word.length === 0) return withBatchim;
  const lastChar = word[word.length - 1];
  return hasBatchim(lastChar) ? withBatchim : withoutBatchim;
}
