import app from "./app.mjs"
const main = () =>{
    app.listen(app.get("port"));
    console.log(`Server on port ${app.get("port")}`);
}

main();