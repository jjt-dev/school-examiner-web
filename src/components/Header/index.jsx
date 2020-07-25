import React from 'react'
import { Link } from 'react-router-dom'
import { Divider } from 'antd'
import { goToLogin } from 'src/utils/api'
import logo from 'src/images/home_logo.png'
import * as FA from 'react-fontawesome'
import './index.less'
import { local, EXAMINER_TOKEN } from 'src/utils/storage'

const Header = ({ user, isLoginPage }) => {
  const signout = () => {
    local.removeItem(EXAMINER_TOKEN)
    goToLogin()
  }

  return (
    <div className="header">
      <div className="header-logo">
        <Link to="/">
          <img src={logo} alt={logo} />
        </Link>
      </div>
      <div className="header-right">
        <div className="header-right__welcome">考官-考试系统欢迎您！</div>
        {!isLoginPage && (
          <div className="header-right__user">
            <div className="header-right__user-password">
              <FA name="user" />
              {user ? `欢迎, ${user.username}` : '欢迎'}
            </div>
            <Divider type="vertical" />
            <div className="header-right__user-signout" onClick={signout}>
              <FA name="power-off" />
              安全退出
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Header
