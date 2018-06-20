import {
  wxRequest
} from '@/utils/wxRequest'

const apiRoot = 'https://easy-mock.com/mock/5afbe65c3e9a2302b68981e5/'

// 获取首页推荐信息
const getRecommendationList = (params) => wxRequest(params, apiRoot + 'recommendation')

export default {
  getRecommendationList
}
