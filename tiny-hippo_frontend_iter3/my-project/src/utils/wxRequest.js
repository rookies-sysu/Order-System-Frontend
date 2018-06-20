import wepy from 'wepy'
const wxRequest = async (params = {}, url) => {
  let data = params.query || {}
  let res = await wepy.request({
    url: url,
    method: params.method || 'GET',
    data: data,
    header: {
      'Content-Type': 'application/json'
    }
  })
  return res
}
module.exports = {
  wxRequest
}
