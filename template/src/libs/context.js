import components from '../index';
import operations from './operations';
var context={
    appCtx:null,
    initAfterAppCtxCreated(appCtx){
        this.appCtx=appCtx;
        if(appCtx.getVue){
            let VueDef=appCtx.getVue();
            VueDef.use(components);
        }
        //注册操作
        if(appCtx.getMvueCore){
            appCtx.getMvueCore().operationManager.register(operations);
        }
    },
    initAfterAppStarted(appCtx){

    }
};
export default context;