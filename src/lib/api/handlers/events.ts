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
import {
  createErrorResponse,
  createResponseSchema,
  toSuccessResponse,
} from "../utils/helpers";
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
        description: `Fetches the complete details of a specific event using its unique eventId.
  
The eventId must be a valid numeric identifier.  
Returns the event information if found.
  
**Response Codes:**
- **200**: Event details retrieved successfully
- **401**: Unauthorized access
- **404**: Event not found
- **500**: Server error`,
        tags: ["Events"],
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
        ...(offset !== undefined && { offset: offset.toString() }),
        ...(pageSize !== undefined && { pageSize: pageSize.toString() }),
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
        offset: z.number().optional(),
        pageSize: z.number().optional(),
      }),

      response: createResponseSchema(EventsArraySchema, {
        errorCodes: [401, 404, 500],
      }),
      detail: {
        summary: "Get all events",
        description: `Fetches a list of events with optional date filtering and pagination.
        
      Optional query parameters:
      - **eventsFrom**: Filters events starting from this date (inclusive)
      - **eventsTill**: Filters events up to this date (inclusive)
      - **offset**: Number of records to skip (for pagination)
      - **pageSize**: Number of records to return
        
      If no filters are provided, all events are returned.
        
      **Response Codes:**
      - **200**: Events retrieved successfully
      - **401**: Unauthorized access
      - **404**: Events not found
      - **500**: Server error`,
        tags: ["Events"],
      },
    },
  )
  .get(
    "/user/:id", // to be tested
    async ({ params, query }) => {
      const { id } = params;
      const { role, offset, pageSize } = query;

      const url = `${API_URL.V1.EVENTS.USER(id)}?${new URLSearchParams({
        ...(role !== undefined && { role }),
        ...(offset !== undefined && { offset: offset.toString() }),
        ...(pageSize !== undefined && { pageSize: pageSize.toString() }),
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
        offset: z.number().optional(),
        pageSize: z.number().optional(),
      }),
      response: createResponseSchema(EventUserSchema, {
        errorCodes: [401, 404, 500],
      }),
      detail: {
        summary: "Get events associated with a user",
        description: `Fetches events linked to a specific user using their userId.
        
      Optional query parameters:
      - **role**: Filters events based on the user's role (e.g., participant, organiser, admin)
      - **offset**: Number of records to skip (for pagination)
      - **pageSize**: Number of records to return
        
      Returns events where the specified user is associated in the given role (if provided).
        
      **Response Codes:**
      - **200**: User-associated events retrieved successfully
      - **401**: Unauthorized access
      - **404**: User or events not found
      - **500**: Server error`,
        tags: ["Events"],
      },
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
      detail: {
        summary: "Get next upcoming event",
        description: `Fetches the next upcoming event relative to the provided date.
        
      Query parameters:
      - **date**: Reference date (ISO string format) from which the next event will be determined.
        
      Returns the nearest upcoming event scheduled after the given date.
        
      **Response Codes:**
      - **200**: Next event retrieved successfully
      - **401**: Unauthorized access
      - **404**: No upcoming event found
      - **500**: Server error`,
        tags: ["Events"],
      },
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
      detail: {
        summary: "Search events by pattern",
        description: `Searches for events matching a given search pattern.
        
      Query parameters:
      - **query**: Search string used to match event fields (e.g., title, description, tags).
        
      Returns events that match the provided search pattern.
        
      **Response Codes:**
      - **200**: Matching events retrieved successfully
      - **401**: Unauthorized access
      - **404**: No matching events found
      - **500**: Server error`,
        tags: ["Events"],
      },
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
      detail: {
        summary: "Get ongoing events",
        description: `Fetches events that are currently ongoing.
        
      Optional query parameters:
      - **offset**: Number of records to skip (for pagination)
      - **pageSize**: Number of records to return
        
      Returns events whose start and end times indicate they are currently in progress.
        
      **Response Codes:**
      - **200**: Ongoing events retrieved successfully
      - **401**: Unauthorized access
      - **404**: No ongoing events found
      - **500**: Server error`,
        tags: ["Events"],
      },
    },
  )
  .get(
    "/branches/:branch", // branch here refers to one of ACM's 6 subgroups
    async ({ params, query }) => {
      const { branch } = params;
      const { offset, pageSize } = query;

      const url = `${API_URL.V1.EVENTS.BY_BRANCH(branch)}?${new URLSearchParams(
        {
          ...(offset !== undefined && { offset: offset.toString() }),
          ...(pageSize !== undefined && { pageSize: pageSize.toString() }),
        },
      )}`;

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
        offset: z.number().optional(),
        pageSize: z.number().optional(),
      }),
      response: createResponseSchema(EventsArraySchema, {
        errorCodes: [401, 404, 500],
      }),
      detail: {
        summary: "Get events by ACM branch",
        description: `Fetches events organized under a specific ACM branch.
        
      Path parameters:
      - **branch**: One of the predefined ACM subgroups.
        
      Optional query parameters:
      - **offset**: Number of records to skip (for pagination)
      - **pageSize**: Number of records to return
        
      Returns events associated with the specified branch.
        
      **Response Codes:**
      - **200**: Branch events retrieved successfully
      - **401**: Unauthorized access
      - **404**: Branch or events not found
      - **500**: Server error`,
        tags: ["Events"],
      },
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
      detail: {
        summary: "Create a new event",
        description: `Creates a new event with the provided details.
        
      Authentication is required. The request must include a valid Bearer token.
        
      Request body:
      - **id**: Unique event identifier
      - **title**: Event title
      - **branch**: Associated ACM branch
      - **startDate**: Event start date and time
      - **endDate**: Event end date and time
      - **description**: Event description
      - **relatedLink**: Optional external link related to the event
      - **venue**: Event venue
      - **ended**: Boolean indicating whether the event has concluded
        
      Returns the created event details.
        
      **Response Codes:**
      - **200**: Event created successfully
      - **401**: Unauthorized or invalid token
      - **404**: Related resource not found
      - **500**: Server error`,
        tags: ["Events"],
      },
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
      detail: {
        summary: "Mark event as ended and send XP emails",
        description: `Marks a specific event as ended and triggers email notifications with XP details to participants and contributors.
        
      Authentication is required. The request must include a valid Bearer token.
        
      Path parameters:
      - **eventId**: Unique identifier of the event to be marked as ended.
        
      Request body:
      - **contributors**: List of contributor user identifiers or emails
      - **publicity**: List of publicity team user identifiers or emails
      - **participants**: List of participant user identifiers or emails
      - **contributorsXp**: XP awarded to contributors
      - **publicityXp**: XP awarded to publicity team members
      - **participantXp**: XP awarded to participants
        
      This action updates the event status to ended and dispatches corresponding email notifications.
        
      **Response Codes:**
      - **200**: Event marked as ended and emails processed successfully
      - **401**: Unauthorized or invalid token
      - **404**: Event not found
      - **500**: Server error`,
        tags: ["Events"],
      },
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
      detail: {
        summary: "Mark event as ended using SID and assign XP",
        description: `Marks a specific event as ended and assigns XP to users identified by their SIDs.
        
      Authentication is required. The request must include a valid Bearer token.
        
      Path parameters:
      - **eventId**: Unique identifier of the event to be marked as ended.
        
      Request body:
      - **contributors**: List of contributor SIDs
      - **publicity**: List of publicity team SIDs
      - **participants**: List of participant SIDs
      - **contributorsXp**: XP awarded to contributors
      - **publicityXp**: XP awarded to publicity team members
      - **participantXp**: XP awarded to participants
        
      This action updates the event status to ended and distributes XP based on the provided SID lists.
        
      **Response Codes:**
      - **200**: Event marked as ended and XP assigned successfully
      - **401**: Unauthorized or invalid token
      - **404**: Event not found
      - **500**: Server error`,
        tags: ["Events"],
      },
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
      detail: {
        summary: "Delete event by ID",
        description: `Deletes a specific event using its unique eventId.
        
      Authentication is required. The request must include a valid Bearer token.
        
      Path parameters:
      - **id**: Unique identifier of the event to be deleted.
        
      This action permanently removes the corresponding event.
        
      **Response Codes:**
      - **200**: Event deleted successfully
      - **401**: Unauthorized or invalid token
      - **404**: Event not found
      - **500**: Server error`,
        tags: ["Events"],
      },
    },
  )
  .put(
    "/update/:eventId",
    async ({ body, params, token }) => {
      const eventId = params.eventId;

      // console.log("putting and updating!");
      // console.log(eventId);

      const url = `${API_URL.V1.EVENTS.BY_ID.UPDATE(eventId)}`;
      console.log(url);

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
      detail: {
        summary: "Update event by ID",
        description: `Updates the details of an existing event using its unique eventId.
        
      Authentication is required. The request must include a valid Bearer token.
        
      Path parameters:
      - **eventId**: Unique identifier of the event to be updated.
        
      Request body:
      - **id**: Event identifier
      - **title**: Event title
      - **branch**: Associated ACM branch
      - **startDate**: Event start date and time
      - **endDate**: Event end date and time
      - **description**: Event description
      - **relatedLink**: Optional external link related to the event
      - **venue**: Event venue
      - **ended**: Boolean indicating whether the event has concluded
        
      Returns the updated event details.
        
      **Response Codes:**
      - **200**: Event updated successfully
      - **401**: Unauthorized or invalid token
      - **404**: Event not found
      - **500**: Server error`,
        tags: ["Events"],
      },
    },
  );
