import "@logseq/libs";
import { archive } from "archive";
import { settings } from "settings";
import { hash } from "utils";

function main() {
  settings();

  logseq.Editor.registerSlashCommand(
    "🌐 Archive Webpage",
    async () => await logseq.Editor.insertAtEditingCursor(`{{renderer archive `)
  );

  logseq.Editor.registerSlashCommand("Archive Webpage Settings", async () =>
    logseq.showSettingsUI()
  );

  logseq.App.onMacroRendererSlotted(({ slot, payload }) => {
    const [args] = payload.arguments;
    const [type, url] = args.split(" ");
    if (type !== "archive") {
      return;
    }

    const render = (key: string, template: string) => ({
      key,
      slot,
      reset: true,
      template,
    });

    (async () => {
      const key = await hash(url);

      try {
        logseq.provideUI(render(key, "Archiving..."));
        const { localPath, internetArchiveUrl } = await archive(url);

        const links: Link[] = [
          { key: "Archive", value: localPath },
          { key: "Internet Archive", value: internetArchiveUrl },
        ];

        logseq.provideUI(
          render(
            key,
            `<a href="${url}" target="_blank">${url}</a> ${links
              .filter((link) => link.value)
              .map(a)
              .join(" ")}`
          )
        );
      } catch (err: any) {
        logseq.provideUI(render(key, err?.statusText ?? err?.message ?? err));
      }
    })();
  });
}

logseq.ready(main).catch(console.error);

type Link = { key: string; value?: string };
const a = ({ key, value }: Link) =>
  `(<a href="${value}" target="_blank">${key}</a>)`;
