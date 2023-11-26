import { dump, load as extLoad } from "js-yaml";

const FRONT_MATTER_REGEX = /^---\n([\s\S]*?)\n---/;

interface FrontMatter {
	[key: string]: unknown;
}

function getFrontMatterString(obj: unknown): string {
	return `---\n${dump(obj)}---`;
}

function load(input: string): FrontMatter {
	const frontMatter = extLoad(input);

	if (isRecord(frontMatter)) {
		return frontMatter;
	}

	throw new Error("Cannot parse front matter");
}

function isRecord(object: unknown): object is FrontMatter {
	return typeof object === "object" && object !== null;
}

export { load, getFrontMatterString, type FrontMatter, FRONT_MATTER_REGEX };
