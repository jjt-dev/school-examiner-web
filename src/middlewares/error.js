export default function errorMiddleware() {
  return (next) => (action) => {
    const { error } = action
    // 当有错误信息时.则错误的action不再往外发送.
    if (error) {
      if (action.payload instanceof Error) {
        throw new Error(action.payload)
      }
    } else {
      return next(action)
    }
  }
}
