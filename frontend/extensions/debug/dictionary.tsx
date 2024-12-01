import React, { useEffect, useMemo, useState } from "react";
import { SpotterCommand } from "@/components/spotter/types/others/commands";
import SpotterDetail from "@/components/spotter/pages/detail";
import { ActionContext } from "@/components/spotter/types/others/action-menu";

type DictionaryViewProps = {
  word: string;
};

type WordInfo = {
  word: string;
  phonetic: string;
  meanings: Array<{
    partOfSpeech: string;
    definitions: Array<{
      definition: string;
      example?: string;
    }>;
  }>;
};

function DictionaryView({ word }: DictionaryViewProps) {
  const [wordInfo, setWordInfo] = useState<WordInfo | null>(null);

  const searchWord = useMemo(() => {
    return async () => {
      try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const data = await response.json();
        if (data && data[0]) {
          setWordInfo(data[0]);
        } else {
          setWordInfo(null);
        }
      } catch (error) {
        console.error("Error fetching definition:", error);
        setWordInfo(null);
      }
    };
  }, [word]);

  useEffect(() => {
    if (!word) return;
    searchWord();
  }, [searchWord, word]);

  const renderMarkdown = () => {
    if (!word) {
      return "# Spotter Dictionary\n\nNo word provided!";
    }

    if (!wordInfo) {
      return `# Spotter Dictionary\n\n## ${word}\n\nNo definition found.`;
    }

    let markdown = `# Spotter Dictionary\n\n## ${wordInfo.word}`;

    if (wordInfo.phonetic) {
      markdown += ` (${wordInfo.phonetic})`;
    }

    wordInfo.meanings.forEach((meaning) => {
      markdown += `\n\n### ${meaning.partOfSpeech}`;
      meaning.definitions.forEach((def, defIndex) => {
        markdown += `\n${defIndex + 1}. ${def.definition}`;
        if (def.example) {
          markdown += `\n   *Example: ${def.example}*`;
        }
      });
    });

    return markdown;
  };

  return <SpotterDetail markdown={renderMarkdown()} />;
}

function render(context: ActionContext) {
  return <DictionaryView word={context.arguments.word} />;
}

export const dictionary: SpotterCommand = {
  icon: "dictionary.png",
  id: "dictionary",
  title: "Search Word",
  subtitle: "Dictionary",
  type: "Command",
  arguments: [
    {
      id: "word",
      type: "text",
      placeholder: "Word",
      required: true
    }
  ],
  render
};
