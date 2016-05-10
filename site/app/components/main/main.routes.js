import _ from 'lodash';

import 'components/header/header.html';
import HeaderController from 'components/header/header.controller';
import 'components/header/header.scss';
import 'components/navigation/navigation.html';
import NavigationController from 'components/navigation/navigation.controller';
import 'components/navigation/navigation.scss';
import 'components/main/main.html';
import 'components/main/main.scss';
import mainCtrl from 'components/main/main-controller';
import 'components/search/search.scss';
import SearchController from 'components/search/search.controller';
import 'components/search/search.html';
import 'components/content/content.html';
import 'components/content/content.scss';
import ContentCtrl from 'components/content/content-controller';

export default /*@ngInject*/ function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/bonitabpm/');

  $stateProvider.state('main', {
    url: '/:version?&page',
    abstract: true,
    views: {
      '@': {
        templateUrl: '/components/main/main.html',
        controller: mainCtrl,
        controllerAs: 'mainCtrl'
      },
    },
    resolve: {
      properties: /*@ngInject*/ $http => $http.get('/bonitabpm/properties.json').then(response => response.data),
      taxonomy: /*@ngInject*/ ($http, currentVersion) => $http.get('/bonitabpm/html/' + currentVersion.name + '/taxonomy.json').then(response => response.data),
      variables: /*@ngInject*/ ($http, currentVersion) => $http.get('/bonitabpm/html/' + currentVersion.name + '/variables.json').then(response => response.data),
      currentVersion: /*ngInject*/ (properties, $stateParams) => $stateParams.version &&
                                      _.find(properties.supportedVersionList, { name: $stateParams.version }) ||
                                        _.head(properties.supportedVersionList)
    }
  }).state('main.content', {
    url: '',
    views: {
      'header@main': {
        templateUrl: '/components/header/header.html',
        controller: HeaderController,
        controllerAs: 'headerCtrl',
      },
      'navigation@main': {
        templateUrl: '/components/navigation/navigation.html',
        controller: NavigationController,
        controllerAs: 'navCtrl'
      },
      'content@main': {
        templateUrl: '/components/content/content.html',
        controller: ContentCtrl,
        controllerAs: 'contentCtrl'
      }
    }
  }).state('main.content.search', {
    url: '/search?searchRequest&start&pageSize',
    views: {
      'content@main': {
        templateUrl: '/components/search/search.html',
        controller: SearchController,
        controllerAs: 'searchCtrl'
      }
    },
    resolve: {
      searchResults: /*@ngInject*/ (searchService, $stateParams, properties, currentVersion) => searchService.search(currentVersion.solrCore, properties, $stateParams.searchRequest, $stateParams.start, $stateParams.pageSize)
    }
  });
}
