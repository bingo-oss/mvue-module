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
        if(appCtx.getMvueCore){
            //注册操作
            appCtx.getMvueCore().operationManager.register(operations);
            var formControls=require('./form-controls').default;
            //注册表单组件
            if(!_.isEmpty(formControls)){
                appCtx.getMvueCore().formControlManager.register(formControls);
            }
        }
    },
    initAfterAppStarted(appCtx){

    },
    getMvueCore(){
        if(!this.appCtx){
            return {};
        }
        return this.appCtx.getMvueCore();
    },
    getMvueToolkit(){
        if(!this.appCtx){
            return {};
        }
        return this.appCtx.getMvueToolkit();
    },
    getConfig(){
        if(!this.appCtx){
            return {};
        }
        return this.appCtx.getMvueToolkit().config;
    },
    getConfigVal(key){
        if(!this.appCtx){
            return null;
        }
        return this.appCtx.getMvueToolkit().config.getConfigVal(key);
    },
    buildResource: function (url, actions, _options) {
        if(!this.appCtx){
            return null;
        }
        return this.appCtx.getMvueToolkit().resource(url, actions, _options);
    }
};
export default context;