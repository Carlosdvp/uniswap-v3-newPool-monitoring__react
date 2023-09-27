import { createBrowserRouter } from 'react-router-dom';
import DisplayPools from '../components/DisplayPools';
import { TokenBalances } from '../components/TokenBalances';
import { WatchForPools } from '../components/WatchForPools';
import App from '../App';

export const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/pools', element: <DisplayPools /> },
  { path: '/token-balances', element: <TokenBalances /> },
  { path: '/pool-watcher', element: <WatchForPools /> },
])
