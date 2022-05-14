import fs from "fs/promises";
import path from "path";
import { determinateOutputs } from "./utils";
import { serialize } from "./serializers";
import { parse } from "./parsers";
import { ITranslations } from "./types";

export type ExtractResult = {
    inputs: string[];
    outputs: string[];
    translations: ITranslations;
    count: number;
};

export async function extract(config): Promise<ExtractResult> {
    const { input, output, cwd = process.cwd(), parsers = {} } = config;

    const translations = await parse(input, parsers);

    const outputs = determinateOutputs(output, cwd);

    for await (const output of outputs) {
        const type = path.extname(output).slice(1);
        console.log("Serialization of type:", type);
        const content = await serialize(
            type,
            translations,
            config?.serializers,
        );

        console.log("Writing translation keys to file:", output);
        await fs.writeFile(output, content);
    }

    return {
        inputs: input,
        outputs: outputs,
        translations,
        count: Object.keys(translations).length,
    };
}
