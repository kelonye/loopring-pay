import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';
import { makeStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { Switcher, ROUTE_ICONS, ROUTE_LABELS, ROUTES } from './routes';
import SetupAccount from 'components/SetupAccount';

const useStyles = makeStyles(theme => ({
  container: {
    paddingTop: 56, // header height
  },
}));

function Component({ locationPathName, account }) {
  const classes = useStyles();

  return (
    <div className={clsx('flex flex--column', classes.container)}>
      <SetupAccount>
        <>
          <div className="mobile-nav-content">
            <Switcher />
          </div>

          <div className="mobile-nav flex flex-grow">
            {ROUTE_ICONS.map((Icon, i) => {
              const link = ROUTES[i];
              const label = ROUTE_LABELS[i];
              return (
                <Link
                  to={link}
                  className={clsx(
                    'flex flex--column flex--grow flex--justify-center flex--align-center mobile-nav-icon',
                    { active: window.location.pathname === link }
                  )}
                  key={label}
                >
                  <div>{<Icon color="inherit" />}</div>
                  <div>{label}</div>
                </Link>
              );
            })}
          </div>
        </>
      </SetupAccount>
    </div>
  );
}

export default withRouter(
  connect(({ wallet: { account } }) => {
    return {
      locationPathName: window.location.pathname,
      account,
    };
  }, mapDispatchToProps)(Component)
);
