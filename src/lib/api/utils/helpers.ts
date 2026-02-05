import { StatusMap, status } from "elysia";
import z from "zod";
import type { APIErrorResponse, ErrorStatusCode } from "../types";

export function createErrorResponse<
  const AllowedCodes extends (typeof StatusMap)[keyof typeof StatusMap],
>(
  res: APIErrorResponse,
  options?: {
    customMessages?: Partial<
      Record<(typeof StatusMap)[keyof typeof StatusMap], string>
    >;
    allowedCodes: AllowedCodes[];
  },
) {
  const statusCode =
    StatusMap[res.code as keyof typeof StatusMap] ??
    StatusMap["Internal Server Error"];

  const allowedCodes = options?.allowedCodes ?? [
    StatusMap["Internal Server Error"],
  ];

  let finalStatusCode =
    allowedCodes[allowedCodes.length - 1] ?? StatusMap["Internal Server Error"];

  for (const code of allowedCodes) {
    if (code === statusCode) {
      finalStatusCode = code;
      break;
    }
  }

  const customMessage = options?.customMessages?.[statusCode];

  const message =
    customMessage ??
    "An unexpected error occurred while processing the request";
  return status(finalStatusCode, {
    success: false,
    error: res.code,
    message,
    timestamp: new Date().toISOString(),
  });
}

export function createResponseSchema<
  T extends z.ZodType,
  const SuccessCode extends 200 | 201 = 200,
  const ErrorCodes extends readonly ErrorStatusCode[] = readonly [500],
>(
  successDataSchema: T,
  options?: {
    successCode?: 200 | 201;
    errorCodes?: ErrorCodes;
  },
) {
  const successCode = (options?.successCode ?? 200) as SuccessCode;
  const errorCodes = (options?.errorCodes ?? [500]) as ErrorCodes;

  type SuccessData = z.infer<T>;

  type ResponseSchema = {
    [K in SuccessCode | ErrorCodes[number]]: K extends SuccessCode
      ? ReturnType<typeof toSuccessSchema<SuccessData>>
      : "error";
  };

  const baseSchema = {
    [successCode]: toSuccessSchema(successDataSchema),
  };

  const errorSchema = errorCodes.reduce(
    (acc, code) => {
      acc[code as ErrorCodes[number]] = "error";
      return acc;
    },
    {} as { [K in ErrorCodes[number]]: "error" },
  );

  return { ...baseSchema, ...errorSchema } as ResponseSchema;
}

export const toSuccessSchema = <T>(schema: z.ZodType<T>) =>
  z.object({
    success: z.literal(true),
    data: schema,
  });

export const toSuccessResponse = <T>(data: T) => ({
  success: true as const,
  data,
});
