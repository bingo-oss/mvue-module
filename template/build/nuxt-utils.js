var path= require('path');
var _=require('lodash');


function cleanChildrenRoutes(routes, isChild = false) {
  let start = -1
  const routesIndex = []
  routes.forEach((route) => {
    if (/-index$/.test(route.name) || route.name === 'index') {
      // Save indexOf 'index' key in name
      const res = route.name.split('-')
      const s = res.indexOf('index')
      start = start === -1 || s < start ? s : start
      routesIndex.push(res)
    }
  })
  routes.forEach((route) => {
    route.path = isChild ? route.path.replace('/', '') : route.path
    if (route.path.indexOf('?') > -1) {
      const names = route.name.split('-')
      const paths = route.path.split('/')
      if (!isChild) {
        paths.shift()
      } // clean first / for parents
      routesIndex.forEach((r) => {
        const i = r.indexOf('index') - start //  children names
        if (i < paths.length) {
          for (let a = 0; a <= i; a++) {
            if (a === i) {
              paths[a] = paths[a].replace('?', '')
            }
            if (a < i && names[a] !== r[a]) {
              break
            }
          }
        }
      })
      route.path = (isChild ? '' : '/') + paths.join('/')
    }
    route.name = route.name.replace(/-index$/, '')
    if (route.children) {
      if (route.children.find(child => child.path === '')) {
        delete route.name
      }
      route.children = cleanChildrenRoutes(route.children, true)
    }
  })
  return routes
}

exports.createRoutes = function createRoutes(files, srcDir, pagesDir,pageTmplDir) {
  const routes = []
  files.forEach((file) => {
    const keys = file
      .replace(RegExp(`^${pagesDir}`), '')
      .replace(/\.(vue|js)$/, '')
      .replace(/\/{2,}/g, '/')
      .split('/')
      .slice(1)
    const route = { 
      name: '', 
      path: '/pages', 
      component:file.replace(/\.(vue|js)$/, '')
    }
    //js文件对应的组件从模板页面组件产生
    if(file.endsWith('.js')){
      route.component=`${pageTmplDir}`;
      route.meta={type:"js",file:file};
    }
    let parent = routes
    keys.forEach((key, i) => {
      // remove underscore only, if its the prefix
      const sanitizedKey = key.indexOf('_') === 0
        ? key.replace('_', '')
        : key
      route.name = route.name
        ? route.name + '-' + sanitizedKey
        : sanitizedKey
      route.name += key === '_' ? 'all' : ''
      //route.chunkName = file.replace(/\.(vue|js)$/, '')
      const child = _.find(parent, { name: route.name })
      if (child) {
        child.children = child.children || []
        parent = child.children
        route.path = ''
      } else if (key === 'index' && i + 1 === keys.length) {
        route.path += i > 0 ? '' : '/'
      } else {
        route.path += '/' +
            (key === '_'
              ? '*'
              : key.indexOf('_') === 0
                ? key.replace('_', ':')
                : key)
        if (key !== '_' && key.indexOf('_') === 0) {
          route.path += '?'
        }
      }
    })
    // Order Routes path
    parent.push(route)
    parent.sort((a, b) => {
      if (!a.path.length) {
        return -1
      }
      if (!b.path.length) {
        return 1
      }
      // Order: /static, /index, /:dynamic
      // Match exact route before index: /login before /index/_slug
      if (a.path === '/') {
        return /^\/(:|\*)/.test(b.path) ? -1 : 1
      }
      if (b.path === '/') {
        return /^\/(:|\*)/.test(a.path) ? 1 : -1
      }
      let i = 0
      let res = 0
      let y = 0
      let z = 0
      const _a = a.path.split('/')
      const _b = b.path.split('/')
      for (i = 0; i < _a.length; i++) {
        if (res !== 0) {
          break
        }
        y = _a[i] === '*' ? 2 : _a[i].indexOf(':') > -1 ? 1 : 0
        z = _b[i] === '*' ? 2 : _b[i].indexOf(':') > -1 ? 1 : 0
        res = y - z
        // If a.length >= b.length
        if (i === _b.length - 1 && res === 0) {
          // change order if * found
          res = _a[i] === '*' ? -1 : 1
        }
      }
      return res === 0 ? (_a[i - 1] === '*' && _b[i] ? 1 : -1) : res
    })
  })
  return cleanChildrenRoutes(routes)
}
