
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: "https://fcbea7b27bbec75e2b6266ba59234f16@o4511539579060224.ingest.us.sentry.io/4511539594330112", 
  tracesSampleRate: 1.0, 
  release: process.env.SENTRY_RELEASE
});