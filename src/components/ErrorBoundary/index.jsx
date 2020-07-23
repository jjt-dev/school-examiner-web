import React from 'react'
import { withRouter } from 'react-router'
import errorPage from 'src/images/error-page.svg'
import './index.less'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidMount() {
    this.unlisten = this.props.history.listen(() => {
      this.setState({ hasError: false })
    })
  }

  componentWillUnmount() {
    this.unlisten()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <img src={errorPage} alt="error" />
          <h2>抱歉, 系统出了点问题, 请稍后访问或联系管理员。</h2>
        </div>
      )
    }

    return this.props.children
  }
}

export default withRouter(ErrorBoundary)
