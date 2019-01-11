//全局组件样式在这里引入，避免在内部重复引用
require('./components/components.less');
import context from './libs/context';

import autoRoutes from './ai/pages/auto-routes';
import autoPageConfs from './ai/pages/auto-page-confs';
import menus from './menus';

var moduleDef={
    installed:false,
    install:install,
    initAfterAppCtxCreated:(appCtx)=>{
        context.initAfterAppCtxCreated(appCtx);
    },
    initAfterAppStarted:(appCtx)=>{
        context.initAfterAppStarted(appCtx);
    },
    pages:{
        routes:autoRoutes,
        pageConfs:autoPageConfs
    },
    menus:menus
};
//安装你的全局组件: Vue.component('',require(''));
function installComponents(Vue){
    
}
//Vue插件安装入口函数
function install(Vue, opts = {}) {
    if (moduleDef.installed) return;
    installComponents(Vue);
    moduleDef.installed=true;
}

export default moduleDef;

