import type { APIErrorResponse, ErrorStatusCode } from "../types";

import { StatusMap, status } from "elysia";
import z from "zod";

/**
 * Creates a standardized error response object from an API error payload.
 *
 * - Maps the backend `res.code` to an HTTP status code using Elysia's `StatusMap`.
 * - Validates the mapped status code against a required whitelist (`allowedCodes`).
 * - If the mapped code is not in the whitelist, it defaults to the last item in
 *   `allowedCodes` (or 500 if the list is empty).
 * - Allows custom error messages per status code via `customMessages`.
 *
 * @template AllowedCodes - A tuple of allowed HTTP status codes derived from `StatusMap`.
 *
 * @param res - The API error response object containing the original error `code`.
 * @param options - The configuration object:
 *   - `allowedCodes`: (Required) An array of permitted HTTP status codes.
 *   - `customMessages`: (Optional) A map of status codes to specific error message strings.
 *
 * @returns An Elysia status response containing:
 *   - `success`: Always `false`.
 *   - `error`: The original error code string from the API.
 *   - `message`: A custom message if provided, otherwise a generic fallback.
 *   - `timestamp`: The ISO 8601 string of the error occurrence.
 */
export function createErrorResponse<
  const AllowedCodes extends (typeof StatusMap)[keyof typeof StatusMap],
>(
  res: APIErrorResponse,
  options: {
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

/**
 * Creates an Elysia‑compatible response schema that distinguishes between
 * a successful response and one or more error status codes.
 *
 * - The success case uses `toSuccessSchema(successDataSchema)` under the given `successCode`.
 * - The error cases map each code in `errorCodes` to a generic `"error"` shape,
 *   which should be backed by an error model defined on the Elysia instance
 *   with at least `{ success: false, error: string, message: string, timestamp: string }`.
 *
 * @template T - The Zod schema for the success response’s `data` field.
 * @template SuccessCode - The HTTP status code for success (200 or 201); defaults to 200.
 * @template ErrorCodes - A readonly tuple of allowed error status codes; defaults to `[500]`.
 *
 * @param successDataSchema - Zod schema describing the shape of the successful response’s `data`.
 * @param options - Optional configuration:
 *   - `successCode`: HTTP status code for success (200 or 201); defaults to 200.
 *   - `errorCodes`: Array of allowed error status codes; defaults to [500].
 *
 * @returns A schema object where:
 *   - `successCode` maps to `toSuccessSchema(successDataSchema)`.
 *   - each code in `errorCodes` maps to `"error"`.
 *
 * @note This function assumes that the Elysia instance has an error model defined
 *       with fields: `success` (boolean, always false), `error` (string code),
 *       `message` (string), and `timestamp` (ISO datetime string).
 */
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

/**
 * Wraps a Zod schema into a standardized success‑response shape.
 *
 * - Ensures the response has `success: true` and a `data` field matching the input schema.
 *
 * @template T - The type described by the input schema.
 * @param schema - Zod schema for the `data` field.
 * @returns A Zod object schema: `{ success: true, data: T }`.
 */
export const toSuccessSchema = <T>(schema: z.ZodType<T>) =>
  z.object({
    success: z.literal(true),
    data: schema,
  });

/**
 * Creates a success‑response object (to be returned from a Elysia handler) matching `toSuccessSchema`.
 *
 * @template T - The type of the data being returned.
 * @param data - The payload to put under the `data` key.
 * @returns An object `{ success: true, data }` with `success` as a const `true`.
 */
export const toSuccessResponse = <T>(data: T) => ({
  success: true as const,
  data,
});
