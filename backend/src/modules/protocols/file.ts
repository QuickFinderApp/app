import { app, protocol } from "electron";
import * as path from "path";
import * as fs from "fs";
import * as mime from "mime-types";

export function registerFileProtocol() {
  async function respondWithFile(filePath: string) {
    const fileContent = await fs.promises.readFile(filePath);
    const contentType = mime.lookup(filePath) || "application/octet-stream";

    return new Response(fileContent, {
      status: 200,
      headers: { "Content-Type": contentType }
    });
  }

  async function handleFileRequest(fileUrl: string): Promise<Response> {
    let concantatedFilePath = path.join(app.getAppPath(), ".webpack", "renderer", fileUrl).replace(/\/$/, "");

    if (!fs.existsSync(concantatedFilePath)) {
      if (fs.existsSync(concantatedFilePath + ".html")) {
        concantatedFilePath = concantatedFilePath + ".html";
      } else {
        return respondWithFile(fileUrl);
      }
    }

    try {
      return respondWithFile(concantatedFilePath);
    } catch (error) {
      console.error(`Error reading file: ${error.message}`);
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }

  protocol.handle("file", async (request) => {
    const fileUrl = request.url.substring(7); // Remove the "file://" prefix
    if (fileUrl.startsWith("/")) {
      return handleFileRequest(fileUrl);
    }
    return respondWithFile(fileUrl);
  });
}
