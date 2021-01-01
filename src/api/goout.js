// 专项工作清单
import request from '@/utils/request'

// 查询外来记录
export const selectIn = (data = {}) => request({
    url: '/in/selectIn',
    method: 'post',
    data
})

// 领导查询外来记录
export const selectInLeader = (data = {}) => request({
    url: '/in/selectInLeader',
    method: 'post',
    data
})

// 根据id查询进入记录
export const getDetailById = (id) => request({
    url: `/in/getInById/${id}`,
    method: 'get',
})
// 添加外来人员出入记录
export const saveRecord = (data = {}) => request({
    url: '/in/saveRecord',
    method: 'post',
    data
})
