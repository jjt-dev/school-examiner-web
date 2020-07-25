import { RoundStatus } from 'src/utils/const'
import { getTotalScore, addNumPrefix } from 'src/utils/common'

/**
 * 参数指标，状态是前两行。再加上考项的个数是总的行数rows
 *
 * @param {*} examItems
 */
export const buildCellStates = ({ examItems, studentList }) => {
  const totalRows = 2 + examItems.length
  const totalColumns = studentList.length + 1
  const rows = Array(totalRows).fill(0)
  return rows.map(() => Array(totalColumns).fill(false))
}

export const scoreToGrade = (score, grades) => {
  const grade = grades.find(
    (grade) => grade.startScore <= score && score <= grade.endScore
  )
  return grade ?? {}
}

export const getResultColumns = (studentList) =>
  Array.from(Array(studentList.length).keys())

export const findRoundStatus = (id) => {
  return Object.values(RoundStatus).find((status) => status.id === id)
}

/**
 * 当考生总分小于60，取分数最低三项的评论作为考试评论
 *
 * @param {*} results
 * @param {*} examItems
 */
export const getComments = (results, examItems) => {
  const mappedResults = Object.keys(results).map((itemId) => ({
    itemId: Number(itemId),
    score: results[itemId],
  }))

  const compare = (a, b) => {
    if (a.score < b.score) {
      return -1
    }
    if (a.score > b.score) {
      return 1
    }
    return 0
  }

  let comments = []
  mappedResults
    .sort(compare)
    .filter((item, index) => index <= 2)
    .forEach((item) => {
      const examItem = examItems.find((i) => i.id === item.itemId)
      comments.push(examItem.badComment)
    })
  return comments.join(', ')
}

export const getFinishExamPayload = (examRound, PassScore) => {
  const GoodComment = '动作标准，继续努力'
  const { studentList, examItems } = examRound
  const payload = []
  studentList.forEach((student) => {
    const results = student.results || {}
    const isEnable = student.isEnable === 'false' ? false : true
    examItems.forEach((item) => {
      const score = results[item.id]
      payload.push({
        commnent: score < PassScore ? item.badComment : GoodComment,
        examItemId: item.id,
        isEnable,
        isStatisticalValue: false,
        ratio: item.ratio,
        score,
        studentId: student.studentId,
      })
    })

    const totalScore = getTotalScore(student, examItems)

    //添加统计项
    payload.push({
      commnent:
        totalScore < PassScore ? getComments(results, examItems) : GoodComment,
      examItemId: 0,
      isEnable,
      isPass: totalScore >= PassScore,
      isStatisticalValue: true,
      ratio: 1,
      score: totalScore,
      studentId: student.studentId,
    })
  })

  return payload
}

export const getRoundTitle = (roundNum) => {
  if (roundNum < 0) {
    return `${addNumPrefix(Math.abs(roundNum))}-补考`
  }
  return addNumPrefix(roundNum)
}

export const getPassScore = (grades) => {
  let minEndScore
  grades.forEach((grade) => {
    if (!minEndScore || grade.endScore < minEndScore) {
      minEndScore = grade.endScore
    }
  })
  return minEndScore + 1
}
