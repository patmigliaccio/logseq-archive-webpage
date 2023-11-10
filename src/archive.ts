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
  return files.find((file) => file.path.includes(fileName))?.path ?? fileName;
};
