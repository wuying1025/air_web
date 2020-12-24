// 专项工作清单
import request from '@/utils/request'

// 保存检查类
export const saveInspect = (data = {}) => request({
    url: '/special/save',
    method: 'post',
    data
})

export const selectInspect = (data = {}) => request({
    url: '/special/list',
    method: 'post',
    data: {
        ...data,
        type: 0
    }
})

export const delWorklistById = id => {
    return request({
        url: `/special/delById/${id}`,
        method: 'get'
    })
}

export const filePreview = ({ ip, port, fid }) => {
    return request({
        url: `/special/preview/${ip}/${port}/${fid}`,
        method: 'get'
    })
}

export const getStep = (id) => {
    console.log(id)
    return request({
        url: `/special/getStep/${id}`,
        method: 'get'
    })
}
export const updateStep = (data = {}) => request({
    url: '/special/updateStep',
    method: 'post',
    data
})
// 通过id查询检查
// export const getInspectById = id => {
//     return request({
//         url: `/special/get/${id}`,
//         method: 'get'
//     })
// }
// 查询全部工作清单列表
export const selectAcitvity = (data = {}) => request({
    url: '/special/getActivityWork',
    method: 'post',
    data
})
// 保存活动类步骤明细
export const saveActivity = (data = {}) => request({
    url: '/special/saveActivityContent',
    method: 'post',
    data
})

export const getActivityById = id => {
    return request({
        url: `/special/getActivity/${id}`,
        method: 'get'
    })
}

// 查询连队 
export const getDeptById = () => {
    return request({
        url: `/system/dept/lastDept`,
        method: 'get'
    })
}
// 获取活动详情
export const getActivityInfo = (id) => {
    return request({
        url: `/special/getActivityWorkInfo/${id}`,
        method: 'get'
    })
}
// 点击连 切换详情
export const getDeptWork = (deptId,activityId) => {
    return request({
        url: `/special/getDeptWork/${deptId}/${activityId}`,
        method: 'get'
    })
}
// 获取活动详情
export const getActivityByDeptId = (id) => {
    return request({
        url: `/special/getWorkByDeptId/${id}`,
        method: 'get'
    })
}

export const getInspectById = id => {
    return request({
        url: `/special/get/${id}`,
        method: 'get'
    })
}

export const queryScore = (data = {}) => request({
    url: '/special/queryScore',
    method: 'post',
    data
})

export const queryMyScore = (data = {}) => request({
    url: '/special/mycheckscore',
    method: 'post',
    data
})

