interface ErrorResponse {
  code: string;
  message: string;
}

export function isErrorResponse(res: unknown): res is ErrorResponse {
  return (
    res !== null &&
    typeof res === "object" &&
    "code" in res &&
    typeof res.code === "string" &&
    "message" in res &&
    typeof res.message === "string"
  );
}
