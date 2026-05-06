import { construct as radashConstruct } from "radash";
import { Bench } from "tinybench";
import { unflatten } from "./index.js";

const sampleFlat = {
  id: "usr_00000001",
  name: "Alice",
  "profile.age": 30,
  "profile.role": "admin",
  "profile.address.city": "New York",
  "profile.address.zip": "10001",
  "profile.address.coords.lat": 40.7128,
  "profile.address.coords.lng": -74.006,
  "settings.theme": "dark",
  "settings.notifications.email": true,
  "settings.notifications.sms": false,
};

const sampleArrayKeys = {
  "users.0.name": "Ana",
  "users.0.age": 30,
  "users.1.name": "Bob",
  "users.1.age": 25,
};

const bench = new Bench({ name: "unflatten", time: 1000 });

bench
  .add("1o1-utils (nested object)", () => {
    unflatten({ obj: sampleFlat });
  })
  .add("radash (nested object)", () => {
    radashConstruct(sampleFlat);
  });

bench
  .add("1o1-utils (array reconstruction)", () => {
    unflatten({ obj: sampleArrayKeys, arrays: true });
  })
  .add("radash (array reconstruction)", () => {
    radashConstruct(sampleArrayKeys);
  });

export { bench };
