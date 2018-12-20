import components from '../index';
import operations from './operations';
import formControls from './form-controls';
var context={
    appCtx:null,
    initAfterAppCtxCreated(appCtx){
        this.appCtx=appCtx;
        if(appCtx.getVue){
            let VueDef=appCtx.getVue();
            VueDef.use(components);
        }
        if(appCtx.getMvueCore){
            //注册操作
            appCtx.getMvueCore().operationManager.register(operations);
            //注册表单组件
            if(!_.isEmpty(formControls)){
                appCtx.getMvueCore().formControlManager.register(formControls);
            }
        }
    },
    initAfterAppStarted(appCtx){

    }
};
export default context;