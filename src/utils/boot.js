import store from 'utils/store';
import * as actions from 'actions';

export function completeBootLoader() {
  document.documentElement.classList.remove('anim-loading');
  document.getElementById('loader-container').remove();
  const root = document.createElement('div');
  root.setAttribute('id', 'root');
  document.body.appendChild(root);
}

export function watchIsMobileChanges() {
  store.dispatch({ type: 'noop' }); // required for some reason ??
  window.addEventListener('resize', () =>
    store.dispatch(actions.updateIsMobile())
  );
}

export function watchWeb3Changes() {
  if (window.ethereum?.on) {
    window.ethereum.on('chainChanged', () => {
      document.location.reload();
    });
    window.ethereum.on('accountsChanged', function(accounts) {
      const account = accounts[0];
      store.dispatch(actions.updateAccount(account));
    });
  }
}
