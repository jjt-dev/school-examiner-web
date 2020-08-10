import React from 'react'
import { Upload, message, Button } from 'antd'
import { getApiRootImg } from 'src/utils/common'
import { UploadOutlined } from '@ant-design/icons'

const UplaodImg = ({ callback, showUploadList, btnSize }) => {
  const props = {
    name: 'file',
    action: getApiRootImg(),
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        callback(info.file.response.data)
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 文件上传失败`)
      }
    },
  }

  return (
    <Upload
      {...props}
      showUploadList={showUploadList ? true : false}
      className="upload-img"
    >
      <Button size={btnSize ?? 'default'}>
        <UploadOutlined /> 上传图片
      </Button>
    </Upload>
  )
}

export default UplaodImg
