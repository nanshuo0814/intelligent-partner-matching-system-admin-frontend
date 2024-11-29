import request from '@/utils/request'

export function getTagList(data) {
    return request({
        url: '/api/tag/list/page',
        method: 'post',
        data
    })
}

export function deleteTagInfo(data) {
    return request({
        url: '/api/tag/delete',
        method: 'post',
        data
    })
}

export function updateTagInfo(data) {
    return request({
        url: '/api/tag/update',
        method: 'post',
        data
    })
}

export function addTagInfo(data) {
    return request({
        url: '/api/tag/add',
        method: 'post',
        data
    })
}

export function getAllCategory() {
    return request({
        url: '/api/tag/get/all/category',
        method: 'get',
    })
}
