import DataUriParser from "datauri/parser.js";
import path from "path";

const getDataUri = (file) => {
    const parser = new DataUriParser();
    const extName = path.extname(file.originalname).toString(); // Change "originalName" to "originalname"
    console.log(extName);
    return parser.format(extName, file.buffer); // Assuming the file content is stored in "buffer"
};

export default getDataUri;
