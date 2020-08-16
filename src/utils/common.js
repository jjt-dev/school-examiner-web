import * as queryString from 'query-string'
import moment from 'moment'
import { Tooltip } from 'antd'
import React from 'react'

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
  itemIds.forEach((id) => {
    const item = examItems.find((item) => item.id === Number(id))
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
