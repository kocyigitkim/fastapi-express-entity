const fastapi = require('fastapi-express');
const EntityApiBuilder = require('./core/EntityApiBuilder');
const { KnexPlugin } = fastapi;
const config = require('./config.json');
async function main() {
    var app = new fastapi.FastApi();
    app.disableSession();
    app.registerPlugin(new KnexPlugin(config.db));
    var entityBuilder = new EntityApiBuilder(app);
    entityBuilder.onCreate((ctx) => {
        var query = ctx.executeQuery();
        query.then(() => {
            ctx.result = null;
            ctx.complete = true;
        }).catch((err) => {
            ctx.complete = true;
            ctx.result = err;
            ctx.success = false;
        });
    });
    entityBuilder.build();

    await app.run();
}

main();