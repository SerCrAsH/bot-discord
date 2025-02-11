import { glob } from 'glob';

export default class BotUtils {
    constructor(client) {
        this.client = client;
    }

    async loadFiles(rootPath) {
        const pattern = `${process.cwd().replace(/\\/g, "/")}/src/${rootPath}/**/*.js`;
        const files = glob.sync(pattern).map((file) => file.replace(/\\/g, "/"));
        return files;
    }
};

export async function loadFiles(rootPath) {
    const pattern = `${process.cwd().replace(/\\/g, "/")}/src/${rootPath}/**/*`;
    const files = glob.sync(pattern).map((file) => file.replace(/\\/g, "/"));
    return files;
}
