import { Settings } from "settings";
import { cleanUrl } from "utils";

const assetStorage = logseq.Assets.makeSandboxStorage();

/**
 * Saves a website, if not saved already, and
 * returns the full filepath of the saved page.
 */
export const archive = async (url: string) => {
  const fileName = `${cleanUrl(url)}.html`;
  const alreadyExists = await assetStorage.hasItem(fileName);
  if (!alreadyExists) {
    const res = await fetch(url);
    const archived = await res.text();
    await assetStorage.setItem(fileName, archived);
  }
  const files = await logseq.Assets.listFilesOfCurrentGraph();
  const localPath = files.find((file) => file.path.includes(fileName))?.path;
  const internetArchiveUrl = await getInternetArchiveUrl(url);

  return {
    localPath,
    internetArchiveUrl,
  };
};

type InternetArchiveResponse = {
  url: string;
  archived_snapshots: {
    closest?: {
      status: "200";
      available: boolean;
      url: string;
      timestamp: string;
    };
  };
};

const getInternetArchiveUrl = async (url: string) => {
  if (logseq.settings?.[Settings.UseInternetArchive]) {
    const res = await fetch(`https://archive.org/wayback/available?url=${url}`);
    const result: InternetArchiveResponse = await res.json();
    return result?.archived_snapshots?.closest?.url;
  }
};
