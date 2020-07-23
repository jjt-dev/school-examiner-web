import React from 'react'
import ReactDOM from 'react-dom'
import { createHashHistory } from 'history'
import zhCN from 'antd/es/locale/zh_CN'
import { ConfigProvider } from 'antd'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import configStore from './store'
import App from './views/App'
import '../node_modules/font-awesome/css/font-awesome.min.css'

const history = createHashHistory()
const store = configStore(history)

ReactDOM.render(
  <ConfigProvider locale={zhCN}>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </Provider>
  </ConfigProvider>,
  document.getElementById('root')
)
