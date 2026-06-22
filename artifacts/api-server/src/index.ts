import app from "./app";
import { logger } from "./lib/logger";
import { startCustomerCareMaintenance } from "./lib/customerCareMaintenance";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");

  // Background lifecycle sweep: auto-confirm resolved tickets after 48h and
  // delete tickets 30 days after they were resolved.
  startCustomerCareMaintenance();
});
