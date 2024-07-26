import { useAnkhLogging } from "@/hooks/mdd/useLogging";

function useFatalError(message: Error["message"], options?: IAnkhUseErrorOptions) {
  if (options?.enableLogging) {
    useAnkhLogging().writeLog(message);
  }
  throw new Error(message);
}

export function useError() {
  return { useFatalError };
}

interface IAnkhUseErrorOptions {
  enableLogging?: boolean;
}