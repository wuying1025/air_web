import request from '@/utils/request'

// 查询部门下拉树结构
export function getTreeUser(params) {
    return request({
        url: '/system/dept/treeselect',
        method: 'get',
        params
    })
}
// 查询我的数据
export function getData(data) {
    return request({
        url: '/resources/selectLoginResources',
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

// 落实法规
export function finishLaw(data) {
    return request({
        url: '/resources/doneResources/' + data.id,
        method: 'get',
    })
}

// 门户管理员查看全部法规列表
export function allLawList(data) {
    return request({
        url: '/resources/selectManageResources',
        method: 'post',
        data: data
    })
}
// 根据法规查询连队落实情况
export function getLawDoneById(data) {
    return request({
        url: '/resources/getResDoneById/' + data.id,
        method: 'get',
    })
}


