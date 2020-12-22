import { Modal, Tooltip, message } from 'antd'
import moment from 'moment'
import * as queryString from 'query-string'
import React from 'react'

import { ResourcePoolSource, ResourcePoolStatus } from './const'
import api from './api'

const { confirm } = Modal

export const parseSearches = (location) => {
  return queryString.parse(location.search)
}

/**
 * @param {*} value long值型的时间值
 * @format {*} format 时间格式
 */
export const formatTime = (value, format = 'YYYY-MM-DD') => {
  if (['string', 'number'].includes(typeof value)) {
    return moment(value).format(format)
  }

  if (Array.isArray(value)) {
    return value.map((item) => moment(item).format(format))
  }

  return []
}

export const findById = (arrs, id) => {
  const result = arrs.find((item) => item.id === id)
  return result ?? {}
}

export const getApiRootImg = () => process.env.REACT_APP_API_IMAGE

export const getDomain = () => process.env.REACT_APP_DOMAIN

export const addNumPrefix = (value) => {
  if (String(value).length === 1) return '00' + value
  if (String(value).length === 2) return '0' + value
  return value
}

export const addRoundPrefix = (roundNum) => {
  if (roundNum < 0) {
    return `${addNumPrefix(roundNum)}-补考`
  }
  return addNumPrefix(roundNum)
}

export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * student.results记录了该名考生每个考项的成绩。results是object, key是考项examItem的id, 值是该考项的等级gradeId
 *
 * @param {*} student
 * @param {*} examItems
 */
export const getTotalScore = (student, examItems) => {
  const results = student.results || {}
  const itemIds = Object.keys(results)
  // 只有当每个考项有成绩的时候再计算总成绩
  if (itemIds.length < examItems.length) return null
  let score = 0
  student.examItems.forEach((item) => {
    score += results[item.id] * item.ratio
  })
  return score.toFixed(0)
}

/**
 * 当等级映射到分数，用该等级的最高分减去1到5的随机数
 *
 * @param {*} gradeId
 * @param {*} grades
 */
export const gradeToScore = (gradeId, grades) => {
  const gradeMaxScore = grades.find((grade) => grade.id === gradeId).endScore
  const random = Math.floor(Math.random() * 5)
  return gradeMaxScore - (random + 1)
}

export const chineseDate = () => {
  const da = new Date()
  const year = da.getFullYear() + '年'
  const month = da.getMonth() + 1 + '月'
  const date = da.getDate() + '日'
  return [year, month, date].join('')
}
export const getTooltipByLen = (text, length = 15, position) => {
  const len = getByteLen(text || '')
  return len > length ? (
    <Tooltip title={text} placement={position} autoAdjustOverflow>
      <span>{text.substr(0, length) + '...'}</span>
    </Tooltip>
  ) : (
    <span>{text}</span>
  )
}

// 检测字符串长度，中文算两个
export const getByteLen = (val = '') => {
  var len = 0
  for (var i = 0; i < val.length; i++) {
    var a = val.charAt(i)
    if (a.match(/[^\x0-\xff]/gi) != null) {
      len += 2
    } else {
      len += 1
    }
  }
  return len
}

export const isProdEnv = process.env.REACT_APP_IS_PRODUCTION === 'true'

export const findResPoolStatus = (statusId) => {
  return Object.values(ResourcePoolStatus).find(
    (status) => status.id === statusId
  )
}

export const findResPoolSource = (sourceId) => {
  return Object.values(ResourcePoolSource).find(
    (status) => status.id === sourceId
  )
}

export const buildParameters = (path, parameters) => {
  path += '?'
  Object.keys(parameters).forEach((key) => {
    if (isNotEmpty(parameters[key])) {
      path += `&${key}=${encodeURIComponent(parameters[key])}`
    }
  })
  return path
}

export const isNotEmpty = (value) => {
  if (value === null || value === undefined) return false
  if (Array.isArray(value)) {
    return value.length > 0
  }
  if (value === 0) return true
  if (typeof value === 'boolean' || typeof value === 'number') return true
  if (value instanceof Object) return value

  return value.trim() !== ''
}

export const confirmUpdate = ({
  status,
  title,
  titleValue,
  path,
  callback,
  contentTitle,
}) => {
  confirm({
    title: `请问您确认要${status}该${title}吗?`,
    content: `${contentTitle ?? title}名: ${titleValue}`,
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      await api.post(path)
      message.success(`${title}${status}成功`)
      callback && callback()
    },
    onCancel() {
      console.log('Cancel')
    },
  })
}

export const tableOrder = {
  title: '序号',
  key: 'index',
  render: (text, record, index) => `${index + 1}`,
}

export const getRow = (title, name, width) => ({
  title,
  dataIndex: name,
  key: name,
  width,
})

export const getDateRow = (title, name) => ({
  title,
  dataIndex: name,
  key: name,
  render: (text, record) => <span>{formatTime(record[name])}</span>,
})

export const getCustomRow = (title, getValue, width) => ({
  title,
  width,
  render: (text, record) => <span>{getValue(record)}</span>,
})
