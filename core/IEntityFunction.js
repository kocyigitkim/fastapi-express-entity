const { FastApiContext } = require("fastapi-express/src/fastapirouter");

module.exports = class IEntityFunction{
    constructor(name){
        this.name = name;
    }
    /**
     * 
     * @param {FastApiContext} context 
     */
    async execute(context){}
}