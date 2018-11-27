import idmComponents from '../index';
var context={
    appCtx:null,
    initAfterAppCtxCreated(appCtx){
        this.appCtx=appCtx;
        if(appCtx.getVue){
            let VueDef=appCtx.getVue();
            VueDef.use(idmComponents);
        }
    },
    initAfterAppStarted(appCtx){

    }
};
export default context;