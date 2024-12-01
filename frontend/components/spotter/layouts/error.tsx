import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { openLink } from "@/lib/utils";
import { SpotterData, SpotterLayout } from "../types/layouts/layouts";
import { SpotterErrorData } from "../types/layouts/error";

function generateCreateIssueLink(errorMessage: string, pagesStackTrace: string[]) {
  const user = "QuickFinderApp";
  const repo = "issues";
  const assignees = encodeURIComponent(["iamEvanYT"].join(","));
  const version = encodeURIComponent("v0.0.1");
  const labels = encodeURIComponent(["bug"].join(","));

  const title = encodeURIComponent(`[Bug]: ${errorMessage}`);
  const body = encodeURIComponent(`
This issue was created directly from the app.

## Error Message:

${errorMessage}

## Version

${version}

## Pages Stack:

${pagesStackTrace
  .toReversed()
  .map((pageKey, index) => `${index + 1}. ${pageKey}`)
  .join("\n")}
  `);

  return `https://github.com/${user}/${repo}/issues/new?title=${title}&assignees=${assignees}&labels=${labels}&body=${body}`;
}

export function useSpotterError(spotterData: SpotterData): SpotterLayout {
  const { errorMessage, pagesStackTrace } = spotterData as SpotterErrorData;

  const body = (
    <div className="flex flex-col p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 text-destructive mb-6">
        <AlertTriangle className="h-8 w-8" />
        <h1 className="text-2xl font-bold">An error occurred</h1>
      </div>

      {errorMessage && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold mb-2">Error Message:</h2>
          <p className="text-destructive font-medium">{errorMessage}</p>
        </div>
      )}

      {pagesStackTrace && pagesStackTrace.length > 0 && (
        <div className="bg-muted rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Pages Stack:</h2>
          <div className="text-sm text-text-600 font-mono whitespace-pre-wrap overflow-x-auto">
            {pagesStackTrace.toReversed().map((pageKey, index) => (
              <div key={index} className="flex items-start mb-1">
                <span className="text-text-600 mr-2">{index + 1}.</span>
                <span>{pageKey}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 text-sm text-text-600">
        <p>
          If this error persists, please click the button below to create a issue on GitHub.
          <br />
          Alternatively, you can create a issue on GitHub manually with the information above.
        </p>
      </div>

      <div
        className="flex flex-col items-center"
        onClick={() => openLink(generateCreateIssueLink(errorMessage ?? "None", pagesStackTrace ?? []))}
      >
        <Button variant="default" className="mt-6">
          Create Issue
        </Button>
      </div>
    </div>
  );

  return {
    body
  };
}
