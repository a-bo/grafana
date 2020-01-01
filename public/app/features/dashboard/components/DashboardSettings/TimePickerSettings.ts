import coreModule from 'app/core/core_module';
import { DashboardModel } from 'app/features/dashboard/state';
import { T } from 'app/core/i18n';

export class TimePickerCtrl {
  panel: any;
  dashboard: DashboardModel;
  t: (text: string) => string;
  constructor() {
    this.panel = this.dashboard.timepicker;
    this.panel.refresh_intervals = this.panel.refresh_intervals || [
      '5s',
      '10s',
      '30s',
      '1m',
      '5m',
      '15m',
      '30m',
      '1h',
      '2h',
      '1d',
    ];
    this.t = T;
  }
}

const template = `
<div class="editor-row">
	<h5 class="section-heading">{{ctrl.t("Time Options")}}</h5>

  <div class="gf-form-group">
		<div class="gf-form">
			<label class="gf-form-label width-10">{{ctrl.t("Timezone")}}</label>
			<div class="gf-form-select-wrapper">
				<select ng-model="ctrl.dashboard.timezone" class='gf-form-input' ng-options="f.value as ctrl.t(f.text) for f in
				  [{value: '', text: 'Default'}, {value: 'browser', text: 'Local browser time'},{value: 'utc', text: 'UTC'}]">
				</select>
			</div>
		</div>

		<div class="gf-form">
			<span class="gf-form-label width-10">{{ctrl.t("Auto-refresh")}}</span>
			<input type="text" class="gf-form-input max-width-25" ng-model="ctrl.panel.refresh_intervals" array-join>
		</div>
		<div class="gf-form">
			<span class="gf-form-label width-10">{{ctrl.t("Now delay now-")}}</span>
			<input type="text" class="gf-form-input max-width-25" ng-model="ctrl.panel.nowDelay"
			    placeholder="0m"
			    valid-time-span
			    bs-tooltip="ctrl.t('time.delay.tooltip')"
 				  data-placement="right">
		</div>

		<gf-form-switch class="gf-form" label="{{ctrl.t('Hide time picker')}}" checked="ctrl.panel.hidden" label-class="width-10">
		</gf-form-switch>
	</div>
</div>
`;

export function TimePickerSettings() {
  return {
    restrict: 'E',
    template: template,
    controller: TimePickerCtrl,
    bindToController: true,
    controllerAs: 'ctrl',
    scope: {
      dashboard: '=',
    },
  };
}

coreModule.directive('gfTimePickerSettings', TimePickerSettings);
