import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const [, , inputPath, outputPath] = process.argv;

if (!inputPath || !outputPath) {
  console.error(
    "Usage: node scripts/sanitize-workflow-export.mjs <input.json> <output.json>"
  );
  process.exit(1);
}

const workflow = JSON.parse(await readFile(inputPath, "utf8"));

workflow.name = "Customer Health - Web App (Import Template)";
workflow.id = "M5RailwayTpl0001";
workflow.active = false;

delete workflow.versionId;
delete workflow.meta;
delete workflow.shared;
delete workflow.pinData;
delete workflow.staticData;

for (const node of workflow.nodes ?? []) {
  delete node.credentials;
  delete node.webhookId;

  if (node.type === "n8n-nodes-base.googleSheets") {
    if (node.parameters?.documentId) {
      node.parameters.documentId = {
        __rl: true,
        value: "YOUR_GOOGLE_SHEET_ID",
        mode: "id",
      };
    }

    if (node.parameters?.sheetName?.cachedResultUrl) {
      delete node.parameters.sheetName.cachedResultUrl;
    }
  }

  if (node.type === "n8n-nodes-base.slack" && node.parameters?.channelId) {
    node.parameters.channelId = {
      __rl: true,
      value: "YOUR_SLACK_CHANNEL_ID",
      mode: "id",
    };
  }
}

const serialized = `${JSON.stringify(workflow, null, 2)}\n`;
await writeFile(path.resolve(outputPath), serialized, "utf8");

console.log(`Sanitized workflow written to ${path.resolve(outputPath)}`);
