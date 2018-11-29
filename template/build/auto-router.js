var glob = require('glob');
var nuxtUtils= require('./nuxt-utils');
const fs = require('fs')
var path = require('path')
var chokidar = require('chokidar');
var autoConfs = require('./auto-confs');
var watched=false;
var changedQueue=[];
var sleep = require('sleep');
function smartRun(i){
    //console.log("--------"+i);
    //如果数据变化，先往变化队列推一条数据
    changedQueue.push(true);
    //记录当前变化队列的长度
    var length=changedQueue.length;
    //console.log(length+"-------")
    setTimeout(function(){
        //再次计算变化队列的长度，如果和之前的长度一致则表示等待时间到了，可以做相关操作了；
        //如果不一致说明数据还在变化，等到数据不再持续变化了再继续执行操作
        var _length=changedQueue.length;
        if(_length===length){
            changedQueue=[];
            run();
        }
    },500);
}
/**
 * 监听pages目录文件夹变化，重新生成路由
 */
function doWatch(pagesPath){
    var vueWatcher = chokidar.watch(pagesPath+'/**/*.@(vue|js)', {ignoreInitial: true ,persistent: true});
    vueWatcher
        .on('add', path => smartRun(1))
        .on('unlink', path => smartRun(4));
    var dirWatcher = chokidar.watch(pagesPath+'/**', {ignoreInitial: true ,persistent: true});
    dirWatcher
        .on('addDir', path => smartRun(2))
        .on('unlinkDir', path => smartRun(3));
}
/**
 * 自动扫描 src/pages/ 下的所有vue文件按文件名生成默认的路由
 */
function run(devMode){
    var pagesPath='src/pages';
    var pageTmplDir='';
    var ignoreFiles=`src/pages/@(auto-page-confs|auto-routes).js`;
    if(devMode&&!watched){
        watched=true;
        doWatch(pagesPath)
    }
    const files = {};
    glob.sync(`${pagesPath}/**/*.@(vue|js)`,{ignore:ignoreFiles}).forEach(f=>{
        const key = f.replace(/\.(js|vue)$/, '')
        if (/\.vue$/.test(f) || !files[key]) {
            files[key] = f.replace(/('|")/g, '\\$1')
        }
    });
    //console.log(files);
    var filesValues=[];
    for(let key in files) {
        if (files.hasOwnProperty(key)) {
            const element = files[key];
            filesValues.push(element);
        }
    }
    //console.log(filesValues);
    var routes=nuxtUtils.createRoutes(
        filesValues,
        pagesPath,
        pagesPath,
        pageTmplDir
    )
    //console.log(JSON.stringify(routes));
    writeJs(pagesPath,JSON.stringify(routes,(key,value)=>{
        if(key=="component"){
            if(value){
                value=value.replace(pagesPath,'.');
                return `##require_placeholder_begin##('${value}')##require_placeholder_end##`;
            }else{
                return undefined;
            }
        }else if(key=='meta'){
            return undefined;
        }else{
            return value;
        }
    },'\t'))
    //动态打包所有的组件配置到一个文件
    autoConfs.run(pagesPath,routes);
    //某些系统下，同步写文件之后webpack监听程序并不知道，所以稍等两秒
    sleep.sleep(2);
}
function writeJs(filePath,routes){
    routes=routes.replace(/\"##require_placeholder_begin##/g,'require').replace(/##require_placeholder_end##\"/g,'');
    var jsContent=`var autoRoutes=${routes}
export default autoRoutes`;
    var outputFile=path.join(__dirname,'../',filePath,'auto-routes.js')
    //console.log(outputFile)
    //console.dir(__dirname)
    fs.writeFileSync(outputFile,jsContent)
    console.log("##自动路由重写完成--_--##");
}
module.exports={
    run:run
}