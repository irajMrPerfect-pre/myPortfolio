require.config({
  urlArgs: "bust=" + (new Date()).getTime(),
  waitSeconds: 0,
  paths: {
    'angular': '../lib/js/angular.min',
    'ui-router': '../lib/js//angular-ui-router.min',
    'jquery': '../lib/js//jquery.min',
    'bootstrapjs':'../lib/js///bootstrap.min',
    'app':'../app/app',
    'ncy-breadcrumb':'../lib/js//angular-breadcrumb.min',
    'updateMeta':'../lib/js//update-meta.min',
    'ocLazyLoad':'../../lib/js/ocLazyLoad.require.min',
    'triggerapp':'../../app/apptrigger'
  },
  shim: {
    'bootstrapjs': {
      deps: ['jquery'],
    },'angular': {
      deps: ['jquery','bootstrapjs'],
      exports: 'angular'
    },'ui-router': {
      deps: ['angular'],
    },'triggerapp': {
      deps: ['angular'],
    },'bootstrapui': {
      deps: ['angular'],
    },'ncy-breadcrumb': {
      deps: ['angular'],
    },'updateMeta': {
      deps: ['angular'],
    },'app': {
      deps: ['ocLazyLoad','ncy-breadcrumb','ui-router','updateMeta'],
    },
  },
  deps: ['triggerapp'],
});
