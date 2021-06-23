const { FastApiContext } = require("fastapi-express/src/fastapirouter");
const IEntityFunction = require("../IEntityFunction");

module.exports = class CreateEntityFunction extends IEntityFunction {
    constructor(emitCreate) {
        super('create');
        this.emitCreate = emitCreate;
    }
    /**
     * 
     * @param {FastApiContext} context 
     */
    async execute(context) {
        var response = {
            success: false,
            message: null,
            data: null
        };
        var builder = await context.entityBuilder();
        var db = await context.db(context);
        var args = context.transform();
        if ((args.etn || "").trim().length > 0) {
            var evt = {};
            evt.args = args;
            evt.success = true;
            evt.executeQuery = async () => {
                const args = {...evt.args};
                var etn = args.etn;
                delete args.etn;
                return db(etn).insert(args);
            };
            evt.complete = false;
            this.emitCreate(evt);
            while(!evt.complete){
                await new Promise(resolve=>setTimeout(resolve, 1));
            }
            response.data = evt.result;
            response.success = evt.success;
            response.message = null;
        }else{
            response.message = "unknown entity!";
        }

        return response;
    }
}