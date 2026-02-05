export interface APIErrorResponse {
  code: string;
  message: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
  message: string;
  timestamp: string;
}

export function isErrorResponse(res: unknown): res is APIErrorResponse {
  return (
    res !== null &&
    typeof res === "object" &&
    "code" in res &&
    typeof res.code === "string" &&
    res.code.trim() !== "" &&
    "message" in res &&
    typeof res.message === "string" &&
    res.message.trim() !== ""
  );
}
