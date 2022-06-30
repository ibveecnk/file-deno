import { FileServer } from "./src/fileserver.ts";

const BasePath = "./data";
const fs = new FileServer(3000, BasePath);

// Non-Blocking
fs.run();
