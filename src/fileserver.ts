import { isReadable, wrapHtml, isValidPath } from "./helpers.ts";

/**
 * The FileServer class, run it by calling `run()` on an Instance
 */
export class FileServer {
    private BasePath: string;
    private Port: number;
    private Server: Deno.Listener | undefined;

    /**
     * Generates the FileServer
     * @param server The generated Deno server `Deno.listen(port)`
     * @param basepath The path from which files should be served e.g. `./data`
     */
    constructor(port: number, basepath: string) {
        if (!isValidPath(basepath))
            throw new Error(`'${basepath} is an invalid path'`);

        try {
            Deno.stat(basepath).then((res) => {
                if (!res.isDirectory) {
                    throw new Error(`${basepath}' is not a directory`);
                }
            });
        } catch (error) {
            if (error instanceof Deno.errors.NotFound) {
                throw new Error(`Directory ${basepath}' is invalid`);
            }
        }

        this.BasePath = basepath;
        this.Port = port;
    }

    /**
     * Listens for HTTP-Requests in an endless loop
     */
    public async run() {
        try {
            this.Server = Deno.listen({ port: this.Port });
        } catch (error) {
            throw new Error(`Server could not be initialized\n${error}`);
        }
        console.info(`Server is waiting for requests.`);
        console.info(`Port: ${this.Port}`);

        for await (const conn of this.Server) {
            this.handleHttp(conn);
        }
    }

    /**
     * Handles incoming HTTP-Requests
     * @param conn The connection returned by a HTTP-Request coming in
     * @returns null
     */
    private async handleHttp(conn: Deno.Conn) {
        const httpConn: Deno.HttpConn = Deno.serveHttp(conn);

        try {
            for await (const requestEvent of httpConn) {
                const url = new URL(requestEvent.request.url);
                const filepath = decodeURIComponent(url.pathname);
                
                if(!isValidPath(filepath)) {
                  return await send404(requestEvent);
                }

                const fullPath = this.BasePath + filepath;

                // Guard
                let stat = null;

                try {
                    stat = await Deno.stat(fullPath);
                } catch (error) {
                    if (error instanceof Deno.errors.NotFound) {
                        return await send404(requestEvent);
                    }
                }

                const dotArr = filepath.split(".");
                const ext = dotArr.length > 1 ? dotArr[dotArr.length - 1] : "";
                const download = !isReadable(ext) && stat?.isFile;

                if (!download) {
                    if (stat?.isFile) {
                        await sendFilePage(requestEvent, filepath, fullPath);
                    } else if (stat?.isDirectory) {
                        await sendDirPage(requestEvent, filepath, fullPath);
                    }
                } else {
                    await downloadFile(requestEvent, fullPath, ext);
                }
            }
        } catch (error) {
            console.error(error);
        }

        async function send404(requestEvent: Deno.RequestEvent) {
            await requestEvent.respondWith(
                new Response("Don't even try 😘", {
                    status: 404,
                })
            );
            return;
        }

        async function downloadFile(
            requestEvent: Deno.RequestEvent,
            fullPath: string,
            ext: string
        ) {
            try {
                const content = await Deno.readFile(fullPath);

                const response = new Response(content, {
                    headers: { "content-type": `application/${ext}` },
                    status: 200,
                });
                await requestEvent.respondWith(response);
            } catch (e) {
                console.warn(e);
            }
        }

        async function sendDirPage(
            requestEvent: Deno.RequestEvent,
            filepath: string,
            fullPath: string
        ) {
            const patharr = filepath.split("/");
            const subDir = patharr.splice(0, patharr.length - 2).join("/");
            const prevPath = subDir + "/";

            let text = "";

            text += `Content of ${wrapHtml(filepath, "a", false, [
                { param: "href", value: prevPath },
            ])}\n\n`;
            try {
                const dir = await Deno.readDir(fullPath);

                for await (const sub of dir) {
                    const subname = sub.name + (sub.isDirectory ? "/" : "");
                    text += wrapHtml(subname, "a", true, [
                        { param: "href", value: encodeURI(filepath + subname) },
                    ]);
                }
            } catch (e) {
                console.warn(e);
            }

            text = wrapHtml(text, "pre");

            const response = new Response(text, {
                headers: { "content-type": "text/html; charset=utf-8" },
                status: 200,
            });
            await requestEvent.respondWith(response);
        }

        async function sendFilePage(
            requestEvent: Deno.RequestEvent,
            filepath: string,
            fullPath: string
        ) {
            const patharr = filepath.split("/");
            const subDir = patharr.splice(0, patharr.length - 1).join("/");
            const prevPath = subDir + "/";

            let text = "";

            text += `Content of ${wrapHtml(filepath, "a", false, [
                { param: "href", value: encodeURI(prevPath) },
            ])}\n\n`;
            try {
                const file = await Deno.readTextFile(fullPath);
                text += file;
            } catch (e) {
                console.warn(e);
            }

            text = wrapHtml(text, "pre");

            const response = new Response(text, {
                headers: { "content-type": "text/html; charset=utf-8" },
                status: 200,
            });
            await requestEvent.respondWith(response);
        }
    }
}
