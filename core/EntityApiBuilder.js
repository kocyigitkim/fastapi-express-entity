const fastapi = require('fastapi-express');
const CreateEntityFunction = require('./Functions/CreateEntityFunction');
const fastapiRouter = fastapi.FastApiRouter;
const fastapiApp = fastapi.FastApi;
const events = require('events');

class EntityApiBuilder {
    /**
     * 
     * @param {fastapiApp} app
     */
    constructor(app) {
        this.app = app;
        this.events = new events();
    }
    onCreate(handler) {
        this.events.on('create', handler);
    }
    onUpdate(handler) {
        this.events.on('update', handler);
    }
    onDelete(handler) {
        this.events.on('delete', handler);
    }
    onRetrieve(handler) {
        this.events.on('retrieve', handler);
    }
    onRetrieveMultiple(handler) {
        this.events.on('retrieveMultiple', handler);
    }
    build() {
        const self = this;
        this.app.registerPlugin({
            name: "entityBuilder",
            getterMethod: () => {
                return self;
            }
        });
        var router = new fastapiRouter.FastApiRouter("entity", false);

        const createFunc = new CreateEntityFunction(this.events.emit.bind(this.events, "create"));
        router.get("create", createFunc.execute.bind(createFunc));
        router.use(this.app.app);
    }
}

module.exports = EntityApiBuilder;