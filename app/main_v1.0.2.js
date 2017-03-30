require.config({
  urlArgs: "bust=" + (new Date()).getTime(),
  waitSeconds: 0,
  paths: {
    'angular': '../lib/angular.min',
    'ui-router': '../lib//angular-ui-router.min',
    'jquery': '../lib//jquery.min',
    'bootstrapjs':'../lib///bootstrap.min',
    'app':'../app/app',
    'ncy-breadcrumb':'../lib//angular-breadcrumb.min',
    'updateMeta':'../lib//update-meta.min',
    'ocLazyLoad':'../../lib/ocLazyLoad.require.min',
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
