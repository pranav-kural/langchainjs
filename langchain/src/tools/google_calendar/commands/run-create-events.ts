import { google, calendar_v3 } from "googleapis";
import type { JWT, GaxiosResponse } from "googleapis-common";
import { PromptTemplate } from "../../../prompts/index.js";
import { LLMChain } from "../../../chains/index.js";
import { CREATE_EVENT_PROMPT } from "../prompts/index.js";
import { getTimezoneOffsetInHours } from "../utils/get-timezone-offset-in-hours.js";
import { BaseLLM } from "../../../llms/base.js";

type CreateEventParams = {
  eventSummary: string;
  eventStartTime: string;
  eventEndTime: string;
  userTimezone: string;
  eventLocation?: string;
  eventDescription?: string;
};

const createEvent = async (
  {
    eventSummary,
    eventStartTime,
    eventEndTime,
    userTimezone,
    eventLocation = "",
    eventDescription = "",
  }: CreateEventParams,
  calendarId: string,
  auth: JWT
) => {
  const calendar = google.calendar("v3");
  const event = {
    summary: eventSummary,
    location: eventLocation,
    description: eventDescription,
    start: {
      dateTime: eventStartTime,
      timeZone: userTimezone,
    },
    end: {
      dateTime: eventEndTime,
      timeZone: userTimezone,
    },
  };

  try {
    const createdEvent = await calendar.events.insert({
      auth,
      calendarId,
      requestBody: event,
    });

    return createdEvent;
  } catch (error) {
    return {
      error: `An error occurred: ${error}`,
    };
  }
};

type RunCreateEventParams = {
  calendarId: string;
  auth: JWT;
  model: BaseLLM;
};

const runCreateEvent = async (
  query: string,
  { calendarId, auth, model }: RunCreateEventParams
) => {
  const prompt = new PromptTemplate({
    template: CREATE_EVENT_PROMPT,
    inputVariables: ["date", "query", "u_timezone", "dayName"],
  });
  const createEventChain = new LLMChain({
    llm: model,
    prompt,
  });

  const date = new Date().toISOString();
  const u_timezone = getTimezoneOffsetInHours();
  const dayName = new Date().toLocaleString("en-us", { weekday: "long" });

  const output = await createEventChain.call({
    query,
    date,
    u_timezone,
    dayName,
  });
  const loaded = JSON.parse(output.text);

  const [
    eventSummary,
    eventStartTime,
    eventEndTime,
    eventLocation,
    eventDescription,
    userTimezone,
  ] = Object.values(loaded);

  const event = await createEvent(
    {
      eventSummary,
      eventStartTime,
      eventEndTime,
      userTimezone,
      eventLocation,
      eventDescription,
    } as CreateEventParams,
    calendarId,
    auth
  );

  if (!(event as { error: string }).error) {
    return `Event created successfully, details: event ${
      (event as GaxiosResponse<calendar_v3.Schema$Event>).data.htmlLink
    }`;
  }

  return `An error occurred creating the event: ${
    (event as { error: string }).error
  }`;
};

export { runCreateEvent };