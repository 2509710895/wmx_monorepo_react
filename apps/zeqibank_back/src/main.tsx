import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import store from './store/index.ts'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import 'dayjs/locale/zh-cn';
import zhCN from 'antd/es/locale/zh_CN'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <React.StrictMode>
      <BrowserRouter>
        <ConfigProvider locale={zhCN}>
          <App />
        </ConfigProvider>
      </BrowserRouter>
    </React.StrictMode>
  </Provider>,
)
