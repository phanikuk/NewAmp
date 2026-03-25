import {
  CloudWatchLogsClient,
  PutLogEventsCommand,
  CreateLogStreamCommand,
  CreateLogGroupCommand,
} from "@aws-sdk/client-cloudwatch-logs";

const client = new CloudWatchLogsClient({
  region: process.env.CW_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.CW_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.CW_SECRET_ACCESS_KEY || "",
  },
});

const LOG_GROUP = process.env.CLOUDWATCH_LOG_GROUP || "/amplify/clientlogs";

async function ensureLogGroup() {
  try {
    await client.send(new CreateLogGroupCommand({ logGroupName: LOG_GROUP }));
  } catch (e: any) {
    if (e.name !== "ResourceAlreadyExistsException") throw e;
  }
}

async function ensureLogStream(streamName: string) {
  try {
    await client.send(
      new CreateLogStreamCommand({
        logGroupName: LOG_GROUP,
        logStreamName: streamName,
      })
    );
  } catch (e: any) {
    if (e.name !== "ResourceAlreadyExistsException") throw e;
  }
}

export async function POST(request: Request) {
  console.log("CW_ACCESS_KEY_ID present:", !!process.env.CW_ACCESS_KEY_ID);
  console.log("CW_SECRET_ACCESS_KEY present:", !!process.env.CW_SECRET_ACCESS_KEY);
  console.log("CW_REGION:", process.env.CW_REGION);
  try {
    const { level, message } = await request.json();

    const streamName = `client-${new Date().toISOString().split("T")[0]}`;

    await ensureLogGroup();
    await ensureLogStream(streamName);

    await client.send(
      new PutLogEventsCommand({
        logGroupName: LOG_GROUP,
        logStreamName: streamName,
        logEvents: [
          {
            timestamp: Date.now(),
            message: JSON.stringify({ level, message }),
          },
        ],
      })
    );

    return Response.json({ success: true });
  } catch (error) {
    console.error("Failed to push log to CloudWatch:", error);
    return Response.json({ error: "Failed to send log" }, { status: 500 });
  }
}
