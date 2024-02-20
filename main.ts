import { FileServer } from "./src/fileserver.ts";

const BasePath = "/Users/iven/repos/";
const Port = 3000;

const fs = new FileServer(Port, BasePath);

// Non-Blocking
fs.run();
