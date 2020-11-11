import request from '@/utils/request'

// 查询部门下拉树结构
export function getTreeUser(params) {
    return request({
        url: '/system/dept/treeselect',
        method: 'get',
        params
    })
}
// 查询法规数据
export function getData(data) {
    return request({
        url: 'resources/selectMyResources',
        method: 'post',
        data: data
    })
}

// 查看一级分类列表
export function getCate(params) {
    return request({
        url: '/resourcesCate/getCate',
        method: 'get',
        params
    })
}

// 查看二级分类列表
export function getSubCate(params) {
    return request({
        url: '/resourcesCate/getSubCate/'+params.id,
        method: 'get',
    })
}