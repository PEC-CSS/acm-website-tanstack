import Elysia from "elysia";
import z from "zod";

import { API_URL } from "$lib/constants/api";
import { ACM_BRANCHES } from "$lib/constants/org";
import { isErrorResponse } from "../types";
import {
  BaseEventSchema,
  EventEndedEmailSchema,
  EventEndedSIDSchema,
  EventsArraySchema,
  EventUserSchema,
} from "../types/schemas";
import { createErrorResponse, createResponseSchema, toSuccessResponse } from "../utils/helpers";
import { requireAuth } from "../utils/macros";

export const api = new Elysia({ prefix: "/events" })
  .use(requireAuth)
  .model({
    error: z.object({
      error: z.string(),
      message: z.string(),
      timestamp: z.iso.datetime(),
    }),
  })
  .get(
    "/:id",
    async ({ params }) => {
      const eventId = params.id;

      const url = `${API_URL.V1.EVENTS.BY_ID.GET(eventId)}`;

      const res = await fetch(url, { method: "GET" });
      if (!res.ok) {
        const response = await res.json();

        if (isErrorResponse(response)) {
          return createErrorResponse(response, {
            allowedCodes: [401, 404, 500],
          });
        }
      }

      const response = await res.json();

      const validatedRes = BaseEventSchema.parse(response);
      return toSuccessResponse(validatedRes);
    },
    {
      params: z.object({
        id: z.coerce.number(),
      }),
      response: createResponseSchema(BaseEventSchema, {
        errorCodes: [401, 404, 500],
      }),
      detail: {
        summary: "Get event detail",
        description: "Gets the details of an event using it's eventId",
      },
    },
  )
  .get(
    "/",
    async ({ query }) => {
      const { eventsFrom, eventsTill, offset, pageSize } = query;

      const url = `${API_URL.V1.EVENTS.GET_ALL}?${new URLSearchParams({
        ...(eventsFrom && { eventsFrom }),
        ...(eventsTill && { eventsTill }),
        ...(offset !== undefined && { offset }),
        ...(pageSize !== undefined && { pageSize }),
      })}`;

      const res = await fetch(url, { method: "GET" });

      if (!res.ok) {
        const response = await res.json();
        console.log(response);
        if (isErrorResponse(response)) {
          return createErrorResponse(response, {
            allowedCodes: [401, 404, 500],
          });
        }
      }
      const response = await res.json();
      const validatedRes = EventsArraySchema.parse(response);

      return toSuccessResponse(validatedRes);
    },
    {
      query: z.object({
        eventsFrom: z.string().optional(),
        eventsTill: z.string().optional(),
        offset: z.string().optional(),
        pageSize: z.string().optional(),
      }),

      response: createResponseSchema(EventsArraySchema, {
        errorCodes: [401, 404, 500],
      }),
    },
  )
  .get(
    "/user/:id", // to be tested
    async ({ params, query }) => {
      const { id } = params;
      const { role, offset, pageSize } = query;

      const url = `${API_URL.V1.EVENTS.USER(id)}?${new URLSearchParams({
        ...(role !== undefined && { role }),
        ...(offset !== undefined && { offset }),
        ...(pageSize !== undefined && { pageSize }),
      })}`;

      const res = await fetch(url, { method: "GET" });

      const response = await res.json();

      console.log(response);

      if (isErrorResponse(response)) {
        return createErrorResponse(response, {
          allowedCodes: [401, 404, 500],
        });
      }

      const validatedRes = EventUserSchema.parse(response);
      return toSuccessResponse(validatedRes);
    },
    {
      params: z.object({
        id: z.coerce.number(),
      }),
      query: z.object({
        role: z.string().optional(),
        offset: z.string().optional(),
        pageSize: z.string().optional(),
      }),
      response: createResponseSchema(EventUserSchema, {
        errorCodes: [401, 404, 500],
      }),
    },
  )
  .get(
    "/next",
    async ({ query }) => {
      const { date } = query;
      console.log(date);
      const url = `${API_URL.V1.EVENTS.NEXT}?${new URLSearchParams({ date })}`;

      const res = await fetch(url, { method: "GET" });

      if (!res.ok) {
        const response = await res.json();
        console.log(response);
        if (isErrorResponse(response)) {
          return createErrorResponse(response, {
            allowedCodes: [401, 404, 500],
          });
        }
      }

      const response = await res.json();
      const validatedRes = BaseEventSchema.parse(response);

      return toSuccessResponse(validatedRes);
    },
    {
      query: z.object({
        date: z.string(),
      }),
      response: createResponseSchema(BaseEventSchema, {
        errorCodes: [401, 404, 500],
      }),
    },
  )
  .get(
    "/search", // to be tested => what is the pattern here?
    async ({ query }) => {
      const searchQuery = query.query;
      const url = `${API_URL.V1.EVENTS.SEARCH.PATTERN}?${new URLSearchParams({ searchQuery })}`;
      console.log(url);
      const res = await fetch(url, { method: "GET" });

      const response = await res.json();
      if (isErrorResponse(response)) {
        return createErrorResponse(response, {
          allowedCodes: [401, 404, 500],
        });
      }

      const validatedRes = BaseEventSchema.parse(response);
      return toSuccessResponse(validatedRes);
    },
    {
      query: z.object({
        query: z.string(),
      }),
      response: createResponseSchema(BaseEventSchema, {
        errorCodes: [401, 404, 500],
      }),
    },
  )
  .get(
    "/ongoing",
    async ({ query }) => {
      const { offset, pageSize } = query;

      const url = `${API_URL.V1.EVENTS.ONGOING}?${new URLSearchParams({
        ...(offset !== undefined && { offset: offset.toString() }),
        ...(pageSize !== undefined && { pageSize: pageSize.toString() }),
      })}`;

      const res = await fetch(url, { method: "GET" });
      const response = await res.json();

      if (isErrorResponse(response)) {
        return createErrorResponse(response, {
          allowedCodes: [401, 404, 500],
        });
      }

      const validatedRes = EventsArraySchema.parse(response);
      return toSuccessResponse(validatedRes);
    },
    {
      query: z.object({
        offset: z.number().optional(),
        pageSize: z.number().optional(),
      }),
      response: createResponseSchema(EventsArraySchema, {
        errorCodes: [401, 404, 500],
      }),
    },
  )
  .get(
    "/branches/:branch", // branch here refers to one of ACM's 6 subgroups
    async ({ params, query }) => {
      const { branch } = params;
      const { offset, pageSize } = query;

      const url = `${API_URL.V1.EVENTS.BY_BRANCH(branch)}?${new URLSearchParams({
        ...(offset !== undefined && { offset }),
        ...(pageSize !== undefined && { pageSize }),
      })}`;

      const res = await fetch(url, { method: "GET" });
      const response = await res.json();

      if (isErrorResponse(response)) {
        return createErrorResponse(response, {
          allowedCodes: [401, 404, 500],
        });
      }

      const validatedRes = EventsArraySchema.parse(response);
      return toSuccessResponse(validatedRes);
    },
    {
      params: z.object({
        branch: z.enum(ACM_BRANCHES),
      }),
      query: z.object({
        offset: z.string().optional(),
        pageSize: z.string().optional(),
      }),
      response: createResponseSchema(EventsArraySchema, {
        errorCodes: [401, 404, 500],
      }),
    },
  )
  .post(
    "/",
    async ({ body, token }) => {
      const res = await fetch(API_URL.V1.EVENTS.CREATE, {
        method: "POST",
        body: JSON.stringify({
          id: body.id,
          title: body.title,
          branch: body.branch,
          startDate: body.startDate,
          endDate: body.endDate,
          description: body.description,
          relatedLink: body.relatedLink,
          venue: body.venue,
          ended: body.ended,
        }),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const response = await res.json();

      if (isErrorResponse(response)) {
        return createErrorResponse(response, {
          allowedCodes: [401, 404, 500],
        });
      }

      const validatedRes = BaseEventSchema.parse(response);
      return toSuccessResponse(validatedRes);
    },
    {
      requireAuth: true,
      body: BaseEventSchema,
      response: createResponseSchema(BaseEventSchema, {
        errorCodes: [401, 404, 500],
      }),
    },
  )
  .post(
    "/end/email/:eventId",
    async ({ body, params, token }) => {
      const eventId = params.eventId;
      const url = API_URL.V1.EVENTS.END.BY_EMAIL(eventId);

      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          contributors: body.contributors,
          publicity: body.publicity,
          participants: body.participants,
          contributorsXp: body.contributorXp,
          publicityXp: body.publicityXp,
          participantXp: body.participantXp,
        }),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const response = res.json();

        if (isErrorResponse(response)) {
          return createErrorResponse(response, {
            allowedCodes: [401, 404, 500],
          });
        }
      }

      return toSuccessResponse({
        message: `The event with ID ${eventId} has been marked as ENDED!`,
      });
    },
    {
      requireAuth: true,
      body: EventEndedEmailSchema,

      params: z.object({
        eventId: z.coerce.number(),
      }),
      response: createResponseSchema(z.object({ message: z.string() }), {
        errorCodes: [401, 404, 500],
      }),
    },
  )
  .post(
    "/end/sid/:eventId",
    async ({ body, params, token }) => {
      const eventId = params.eventId;
      const url = API_URL.V1.EVENTS.END.BY_SID(eventId);

      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          contributors: body.contributors,
          publicity: body.publicity,
          participants: body.participants,
          contributorsXp: body.contributorXp,
          publicityXp: body.publicityXp,
          participantXp: body.participantXp,
        }),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const response = res.json();
        if (isErrorResponse(response)) {
          return createErrorResponse(response, {
            allowedCodes: [401, 404, 500],
          });
        }
      }

      return toSuccessResponse({
        message: `The event with ID ${eventId} has been marked as ENDED!`,
      });
    },
    {
      requireAuth: true,
      body: EventEndedSIDSchema,
      params: z.object({
        eventId: z.coerce.number(),
      }),
      response: createResponseSchema(z.object({ message: z.string() }), {
        errorCodes: [401, 404, 500],
      }),
    },
  )
  .delete(
    "/:id",
    async ({ params, token }) => {
      const eventId = params.id;

      const url = `${API_URL.V1.EVENTS.BY_ID.DELETE(eventId)}`;

      const res = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const response = await res.json();

        if (isErrorResponse(response)) {
          return createErrorResponse(response, {
            allowedCodes: [401, 404, 500],
          });
        }
      }

      return toSuccessResponse({
        message: "Deleted the corresponding event successfully",
      });
    },
    {
      requireAuth: true,
      params: z.object({
        id: z.coerce.number(),
      }),
      response: createResponseSchema(z.object({ message: z.string() }), {
        errorCodes: [401, 404, 500],
      }),
    },
  )
  .put(
    "/:eventId",
    async ({ body, params, token }) => {
      const eventId = params.eventId;

      console.log("putting and updating!");
      console.log(eventId);

      const url = `${API_URL.V1.EVENTS.BY_ID.UPDATE(eventId)}`;
      // console.log(url);

      const res = await fetch(url, {
        method: "PUT",
        body: JSON.stringify({
          id: body.id,
          title: body.title,
          branch: body.branch,
          startDate: body.startDate,
          endDate: body.endDate,
          description: body.description,
          relatedLink: body.relatedLink,
          venue: body.venue,
          ended: body.ended,
        }),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const response = await res.json();
      if (isErrorResponse(response)) {
        return createErrorResponse(response, {
          allowedCodes: [401, 404, 500],
        });
      }

      const validatedRes = BaseEventSchema.parse(response);
      return toSuccessResponse(validatedRes);
    },
    {
      requireAuth: true,
      body: BaseEventSchema,
      params: z.object({
        eventId: z.coerce.number(),
      }),
      response: createResponseSchema(BaseEventSchema, {
        errorCodes: [401, 404, 500],
      }),
    },
  )
  .get(
    "/search-events",
    async ({ query }) => {
      const { eventsFrom, eventsTill, offset, pageSize, pattern, branch, ongoing } = query;

      const currOffset = offset === undefined || pageSize === undefined ? "0" : offset;
      const currPageSize = pageSize === undefined ? "150" : pageSize;

      const url = `${API_URL.V1.EVENTS.GET_ALL}?${new URLSearchParams({
        offset: currOffset,
        pageSize: currPageSize,
      })}`;

      const res = await fetch(url, { method: "GET" });

      if (!res.ok) {
        const response = await res.json();
        console.log(response);
        if (isErrorResponse(response)) {
          return createErrorResponse(response, {
            allowedCodes: [401, 404, 500],
          });
        }
      }
      const response = await res.json();
      const validatedArray = EventsArraySchema.parse(response);

      const fromDate = eventsFrom ? new Date(eventsFrom) : null;
      const tillDate = eventsTill ? new Date(eventsTill) : null;

      const resultArray = validatedArray?.filter(event => {
        const eventStartDate = event.startDate ? new Date(event.startDate) : null;
        const eventEndDate = event.endDate ? new Date(event.endDate) : null;

        if (fromDate && eventStartDate && eventStartDate < fromDate) return false;
        else if (tillDate && eventEndDate && eventEndDate > tillDate) return false;
        else if (branch && event.branch !== branch) return false;
        else if (ongoing && ongoing === "true" && event.ended === true) return false;
        else if (pattern && !event.title?.toLowerCase().startsWith(pattern.toLowerCase()))
          return false;

        return true;
      });
      const validatedRes = EventsArraySchema.parse(resultArray);
      return toSuccessResponse(validatedRes);
    },
    {
      query: z.object({
        eventsFrom: z.string().optional(),
        eventsTill: z.string().optional(),
        offset: z.string().optional(),
        pageSize: z.string().optional(),
        pattern: z.string().optional(),
        branch: z.enum(ACM_BRANCHES).optional(),
        ongoing: z.string().optional(),
      }),

      response: createResponseSchema(EventsArraySchema, {
        errorCodes: [401, 404, 500],
      }),
    },
  );
