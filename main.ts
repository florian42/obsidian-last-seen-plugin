import { Plugin, TFile, Vault } from "obsidian";
import { getFrontMatterString, load, FRONT_MATTER_REGEX } from "./frontmatter";

export default class LastOpenedPlugin extends Plugin {
	async onload() {
		this.registerEvent(
			this.app.workspace.on("file-open", (file) => {
				file &&
					LastOpenedPlugin.updateLastSeenFrontmatter(
						this.app.vault,
						file,
					);
			}),
		);
	}

	static async updateLastSeenFrontmatter(vault: Vault, file: TFile) {
		vault.process(file, (data) => {
			const frontMatterMatch = data.match(FRONT_MATTER_REGEX);

			const today = new Date().toISOString();

			if (!frontMatterMatch) {
				return (
					getFrontMatterString({
						lastOpened: today,
					}) +
					"\n" +
					data
				);
			}
			const frontMatter = load(frontMatterMatch[1]);
			frontMatter.lastOpened = today;
			return data.replace(
				FRONT_MATTER_REGEX,
				getFrontMatterString(frontMatter),
			);
		});
	}
}
