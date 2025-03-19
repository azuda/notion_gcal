/**
 * Source:
 * https://github.com/googleworkspace/node-samples/blob/main/calendar/quickstart
 * https://developers.google.com/calendar/api/quickstart/nodejs
 * 
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* eslint-disable camelcase */
// [START calendar_quickstart]
// const fs = require('fs').promises;
// const path = require('path');
// const process = require('process');
// const {authenticate} = require('@google-cloud/local-auth');
// const {google} = require('googleapis');

import fs from "fs/promises";
import path from "path";
import process from "process";
import { authenticate } from "@google-cloud/local-auth";
import { google } from "googleapis";
import dotenv from "dotenv";
import { v4 as uuid4 } from "uuid";
import * as util from  "./util.js";

dotenv.config();

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/calendar.events.owned"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), "token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');
const calendarID = process.env.CALENDAR_ID;
const staffEmails = JSON.parse(process.env.STAFF_EMAILS);

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

/**
 * Lists the next 10 events on the user"s primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function listEvents(auth) {
  const calendar = google.calendar({version: "v3", auth});
  const res = await calendar.events.list({
    calendarId: calendarID,
    timeMin: new Date().toISOString(),
    maxResults: 2500,
    singleEvents: true,
    orderBy: "startTime",
  });
  console.log(`EVENT IDs: ${res.data.items.map(event => event.id)}`);
  return res.data.items;
}

// add event to google calendar under specified calendar ID
async function addEvent(auth, event) {
  const calendar = google.calendar({version: "v3", auth});
  calendar.events.insert({
    calendarId: calendarID,
    resource: event,
  }, (err, res) => {
    if (err) {
      console.error("Error creating event: %s", JSON.stringify(err.errors, null, 2));
      const duplicateError = err.errors.find(error => error.reason === "duplicate");
      if (duplicateError) {
        updateEvent(auth, event.id, event);
      }
      return;
    }
    console.log("Event created: %s", res.data.htmlLink);
  });
}

async function deleteEvent(auth, eventID) {
  const calendar = google.calendar({ version: "v3", auth });
  calendar.events.delete({
    calendarId: calendarID,
    eventId: eventID,
  }, (err, res) => {
    if (err) {
      console.error(`Error deleting event:`, err);
      return;
    }
    console.log(`Event deleted: ${eventID}`);
  });
}

async function updateEvent(auth, eventID, newEvent) {
  const calendar = google.calendar({ version: "v3", auth });
  console.log(`Updating event ${newEvent.summary} with id ${eventID}`);
  // console.log(JSON.stringify(newEvent, null, 2));

  calendar.events.update({
    calendarId: calendarID,
    eventId: eventID,
    resource: newEvent,
  }, (err, res) => {
    if (err) {
      console.error("Error updating event: %s", JSON.stringify(err.errors, null, 2));
      return;
    }
    console.log(`Event updated: ${res.data.htmlLink}`);
  });
}

// main function
async function main() {
  const auth = await authorize();

  const data = await fs.readFile("vacations.json");
  const vacations = JSON.parse(data);

  // read events that already exist in google calendar
  const existingEvents = await listEvents(auth);
  const existingEventCheck = new Set(existingEvents.map(event => `${event.id}-${util.truncateDateTime(event.start.dateTime)}-${util.truncateDateTime(event.end.dateTime)}`));
  console.log("EXISTING EVENTS:");
  console.log(existingEventCheck);

  // process all events from vacations.json
  for (const vacation of vacations) {
    if (!vacation["Start Date"]) {
      console.error("Invalid start date: %s", vacation);
      continue;
    }

    const email = staffEmails[vacation["Staff Member"]] || "";
    const dateRange = util.addTimeZone(vacation["Start Date"], vacation["End Date"]);
    // const dateRange = util.filterWeekdays(vacation["Start Date"], vacation["End Date"]);
    // if (!dateRange) {
    //   console.log(`No weekdays in the date range for ${vacation["Vacation Title"]}`);
    //   continue;
    // }
    let oneDay = false;
    if (dateRange[0] == dateRange[1]) {
      oneDay = true;
    }

    const id = vacation["ID"].replace(/-/g, "");
    let event = {
      id: id,
      summary: vacation["Vacation Title"],
      description: `${email}\n${id}`,
    };
    if (oneDay == true) {
      event.start = {
        date: dateRange[0],
        timeZone: "Canada/Mountain",
      };
      event.end = {
        date: dateRange[1],
        timeZone: "Canada/Mountain",
      };
    } else {
      event.start = {
        dateTime: dateRange[0],
        timeZone: "Canada/Mountain",
      };
      event.end = {
        dateTime: dateRange[1],
        timeZone: "Canada/Mountain",
      };
    }

    addEvent(auth, event);

  //   const eventKey = `${event.id}-${vacation["Start Date"]}-${vacation["End Date"]}`;
  //   if (!existingEventCheck.has(eventKey)) {
  //     await addEvent(auth, event);
  //   } else {
  //     console.log(`Event already exists: ${event.summary} on ${util.truncateDateTime(event.start.dateTime)}`);
  //   }
  }
}

main();
// authorize().then(listEvents, pushEvents).catch(console.error);
// [END calendar_quickstart]
