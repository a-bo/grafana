import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { setUsersSearchQuery } from './state/actions';
import { getInviteesCount, getUsersSearchQuery } from './state/selectors';
import { FilterInput } from 'app/core/components/FilterInput/FilterInput';
import { Trans,Translation } from "react-i18next";

export interface Props {
  searchQuery: string;
  setUsersSearchQuery: typeof setUsersSearchQuery;
  onShowInvites: () => void;
  pendingInvitesCount: number;
  canInvite: boolean;
  showInvites: boolean;
  externalUserMngLinkUrl: string;
  externalUserMngLinkName: string;
}

export class UsersActionBar extends PureComponent<Props> {
  render() {
    const {
      canInvite,
      externalUserMngLinkName,
      externalUserMngLinkUrl,
      searchQuery,
      pendingInvitesCount,
      setUsersSearchQuery,
      onShowInvites,
      showInvites,
    } = this.props;

    const pendingInvitesButtonStyle = classNames({
      btn: true,
      'toggle-btn': true,
      active: showInvites,
    });

    const usersButtonStyle = classNames({
      btn: true,
      'toggle-btn': true,
      active: !showInvites,
    });

    return (
      <div className="page-action-bar">
        <div className="gf-form gf-form--grow">

          <Translation>
            {
              t => <FilterInput
                labelClassName="gf-form--has-input-icon"
                inputClassName="gf-form-input width-20"
                value={searchQuery}
                onChange={setUsersSearchQuery}
                placeholder={t("Filter by email, login or name")}
              />
            }
          </Translation>
          {pendingInvitesCount > 0 && (
            <div style={{ marginLeft: '1rem' }}>
              <button className={usersButtonStyle} key="users" onClick={onShowInvites}>
                <Trans>Users</Trans>
              </button>
              <button className={pendingInvitesButtonStyle} onClick={onShowInvites} key="pending-invites">
                <Trans>Pending Invites</Trans> ({pendingInvitesCount})
              </button>
            </div>
          )}
          <div className="page-action-bar__spacer" />
          {canInvite && (
            <a className="btn btn-primary" href="org/users/invite">
              <span>
                <Trans>Invite</Trans>
              </span>
            </a>
          )}
          {externalUserMngLinkUrl && (
            <a className="btn btn-primary" href={externalUserMngLinkUrl} target="_blank" rel="noopener">
              {externalUserMngLinkName}
            </a>
          )}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: any) {
  return {
    searchQuery: getUsersSearchQuery(state.users),
    pendingInvitesCount: getInviteesCount(state.users),
    externalUserMngLinkName: state.users.externalUserMngLinkName,
    externalUserMngLinkUrl: state.users.externalUserMngLinkUrl,
    canInvite: state.users.canInvite,
  };
}

const mapDispatchToProps = {
  setUsersSearchQuery,
};

export default connect(mapStateToProps, mapDispatchToProps)(UsersActionBar);
