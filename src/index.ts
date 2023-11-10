import "@logseq/libs";
import { archive } from "archive";
import { hash } from "utils";

function main() {
  logseq.Editor.registerSlashCommand(
    "🌐 Archive Webpage",
    async () => await logseq.Editor.insertAtEditingCursor(`{{renderer archive `)
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
        const filePath = await archive(url);
        logseq.provideUI(
          render(
            key,
            `<a href="${url}" target="_blank">${url}</a> (<a href="${filePath}" target="_blank">Archived</a>)`
          )
        );
      } catch (err: any) {
        logseq.provideUI(render(key, err?.statusText ?? err?.message ?? err));
      }
    })();
  });
}

logseq.ready(main).catch(console.error);
