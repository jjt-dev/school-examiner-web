import React from 'react'
import { Upload } from 'antd'
import { getApiRootImg, getDomain } from 'src/utils/common'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'

function getBase64(img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

function beforeUpload(file, callback) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    callback({ valid: false, message: '请上传JPG或PNG格式的头像' })
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    callback({ valid: false, message: '头像大小不能超过2M' })
  }
  return isJpgOrPng && isLt2M
}

const buildUrl = (props) => {
  return props.imageUrl ? `${getDomain()}${props.imageUrl}` : ''
}

class JjtAvatar extends React.Component {
  state = {
    loading: false,
    imageUrl: buildUrl(this.props),
  }

  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true })
      return
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl) => {
        this.props.callback({ valid: true, faceUrl: info.file.response.data })
        this.setState({
          imageUrl,
          loading: false,
        })
      })
    }
  }

  render() {
    const uploadButton = (
      <div>
        {this.state.loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div className="ant-upload-text">{this.props.title ?? '头像'}</div>
      </div>
    )
    const { imageUrl } = this.state
    return (
      <Upload
        disabled={this.props.disabled}
        name="file"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action={getApiRootImg()}
        beforeUpload={(file) => beforeUpload(file, this.props.callback)}
        onChange={this.handleChange}
      >
        {imageUrl ? (
          <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
        ) : (
          uploadButton
        )}
      </Upload>
    )
  }
}

export default JjtAvatar
