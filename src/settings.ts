import "@logseq/libs";
import { SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin.user";

export enum Settings {
  UseInternetArchive = 'UseInternetArchive'
}

/** Loads the settings schema. */
export const settings = () => {
  const settingsTemplate: SettingSchemaDesc[] = [
    {
      key: Settings.UseInternetArchive,
      type: "boolean",
      title: "Use Internet Archive",
      description:
        "Enables the use of Internet Archive for managing archived webpages.",
      default: true,
    },
  ];
  logseq.useSettingsSchema(settingsTemplate);
};
