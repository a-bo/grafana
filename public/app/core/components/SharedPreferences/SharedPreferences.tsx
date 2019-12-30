import React, { PureComponent } from 'react';

import { FormLabel, Select } from '@grafana/ui';

import { DashboardSearchHit, DashboardSearchHitType } from 'app/types';
import { getBackendSrv } from 'app/core/services/backend_srv';
import { Trans } from "react-i18next";

export interface Props {
  resourceUri: string;
}

export interface State {
  homeDashboardId: number;
  theme: string;
  timezone: string;
  language: string;
  dashboards: DashboardSearchHit[];
}

const themes = [
  { value: '', label: 'Default' },
  { value: 'dark', label: 'Dark' },
  { value: 'light', label: 'Light' },
];

const timezones = [
  { value: '', label: 'Default' },
  { value: 'browser', label: 'Local browser time' },
  { value: 'utc', label: 'UTC' },
];

const languages = [
  { value: '', label: 'Default' },
  { value: 'zh_CN', label: '简体中文' },
  { value: 'en-US', label: 'English' },
];
export class SharedPreferences extends PureComponent<Props, State> {
  backendSrv = getBackendSrv();

  constructor(props: Props) {
    super(props);

    this.state = {
      homeDashboardId: 0,
      theme: '',
      timezone: '',
      language: '',
      dashboards: [],
    };
  }

  async componentDidMount() {
    const prefs = await this.backendSrv.get(`/api/${this.props.resourceUri}/preferences`);
    const dashboards = await this.backendSrv.search({ starred: true });
    const defaultDashboardHit: DashboardSearchHit = {
      id: 0,
      title: 'Default',
      tags: [],
      type: '' as DashboardSearchHitType,
      uid: '',
      uri: '',
      url: '',
      folderId: 0,
      folderTitle: '',
      folderUid: '',
      folderUrl: '',
      isStarred: false,
      slug: '',
    };

    if (prefs.homeDashboardId > 0 && !dashboards.find(d => d.id === prefs.homeDashboardId)) {
      const missing = await this.backendSrv.search({ dashboardIds: [prefs.homeDashboardId] });
      if (missing && missing.length > 0) {
        dashboards.push(missing[0]);
      }
    }

    this.setState({
      homeDashboardId: prefs.homeDashboardId,
      theme: prefs.theme,
      timezone: prefs.timezone,
      dashboards: [defaultDashboardHit, ...dashboards],
      language: prefs.language,
    });
  }
  onSubmitForm = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    const { homeDashboardId, theme, timezone, language } = this.state;

    await this.backendSrv.put(`/api/${this.props.resourceUri}/preferences`, {
      homeDashboardId,
      theme,
      timezone,
      language,
    });
    window.location.reload();
  };

  onThemeChanged = (theme: string) => {
    this.setState({ theme });
  };

  onTimeZoneChanged = (timezone: string) => {
    this.setState({ timezone });
  };

  onLanguageChanged = (language: string) => {
    this.setState({ language });
  };

  onHomeDashboardChanged = (dashboardId: number) => {
    this.setState({ homeDashboardId: dashboardId });
  };

  getFullDashName = (dashboard: DashboardSearchHit) => {
    if (typeof dashboard.folderTitle === 'undefined' || dashboard.folderTitle === '') {
      return dashboard.title;
    }
    return dashboard.folderTitle + ' / ' + dashboard.title;
  };

  render() {
    const { theme, timezone, language, homeDashboardId, dashboards } = this.state;

    return (
      <form className="section gf-form-group" onSubmit={this.onSubmitForm}>
        <h3 className="page-heading"><Trans>Preferences </Trans></h3>
        <div className="gf-form">
          <span className="gf-form-label width-11">
            <Trans>UI Theme</Trans>
          </span>
          <Select
            isSearchable={false}
            value={themes.find(item => item.value === theme)}
            options={themes}
            onChange={theme => this.onThemeChanged(theme.value)}
            width={20}
          />
        </div>
        <div className="gf-form">
          <FormLabel
            width={11}
            tooltip="Not finding dashboard you want? Star it first, then it should appear in this select box."
          >
            <Trans>Home Dashboard</Trans>
          </FormLabel>
          <Select
            value={dashboards.find(dashboard => dashboard.id === homeDashboardId)}
            getOptionValue={i => i.id}
            getOptionLabel={this.getFullDashName}
            onChange={(dashboard: DashboardSearchHit) => this.onHomeDashboardChanged(dashboard.id)}
            options={dashboards}
            placeholder="Choose default dashboard"
            width={20}
          />
        </div>
        <div className="gf-form">
          <label className="gf-form-label width-11">
            <Trans>Timezone</Trans>
          </label>
          <Select
            isSearchable={false}
            value={timezones.find(item => item.value === timezone)}
            onChange={timezone => this.onTimeZoneChanged(timezone.value)}
            options={timezones}
            width={20}
          />
        </div>

        <div className="gf-form">
          <span className="gf-form-label width-11">
            <Trans>Language</Trans>
          </span>
          <Select
            isSearchable={false}
            value={languages.find(item => item.value === language)}
            onChange={language => this.onLanguageChanged(language.value)}
            options={languages}
            width={20}
          />
        </div>
        <div className="gf-form-button-row">
          <button type="submit" className="btn btn-primary">
            <Trans>Save</Trans>
          </button>
        </div>
      </form>
    );
  }
}

export default SharedPreferences;
