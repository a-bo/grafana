import angular from 'angular';
import _ from 'lodash';
import { DashboardModel } from 'app/features/dashboard/state';
import { GrafanaRootScope } from 'app/routes/GrafanaCtrl';
import { CoreEvents } from 'app/types';
import { T } from 'app/core/i18n';

export let iconMap = {
  'external link': 'fa-external-link',
  dashboard: 'fa-th-large',
  question: 'fa-question',
  info: 'fa-info',
  bolt: 'fa-bolt',
  doc: 'fa-file-text-o',
  cloud: 'fa-cloud',
};

export class DashLinksEditorCtrl {
  dashboard: DashboardModel;
  iconMap: any;
  mode: any;
  link: any;

  emptyListCta = {
    title: T('There are no dashboard links added yet'),
    buttonIcon: 'gicon gicon-link',
    buttonTitle: T('Add Dashboard Link'),
    infoBox: {
      __html: T("dashboard.link.describe"),
    },
    infoBoxTitle: T('What are Dashboard Links?'),
  };

  /** @ngInject */
  constructor($scope: any, $rootScope: GrafanaRootScope) {
    this.iconMap = iconMap;
    this.dashboard.links = this.dashboard.links || [];
    this.mode = 'list';

    $scope.$on('$destroy', () => {
      $rootScope.appEvent(CoreEvents.dashLinksUpdated);
    });
  }

  backToList() {
    this.mode = 'list';
  }

  setupNew = () => {
    this.mode = 'new';
    this.link = { type: 'dashboards', icon: 'external link' };
  };

  addLink() {
    this.dashboard.links.push(this.link);
    this.mode = 'list';
    this.dashboard.updateSubmenuVisibility();
  }

  editLink(link: any) {
    this.link = link;
    this.mode = 'edit';
    console.log(this.link);
  }

  saveLink() {
    this.backToList();
  }

  moveLink(index: string | number, dir: string | number) {
    // @ts-ignore
    _.move(this.dashboard.links, index, index + dir);
  }

  deleteLink(index: number) {
    this.dashboard.links.splice(index, 1);
    this.dashboard.updateSubmenuVisibility();
  }
}

function dashLinksEditor() {
  return {
    restrict: 'E',
    controller: DashLinksEditorCtrl,
    templateUrl: 'public/app/features/dashboard/components/DashLinks/editor.html',
    bindToController: true,
    controllerAs: 'ctrl',
    scope: {
      dashboard: '=',
    },
  };
}

angular.module('grafana.directives').directive('dashLinksEditor', dashLinksEditor);
