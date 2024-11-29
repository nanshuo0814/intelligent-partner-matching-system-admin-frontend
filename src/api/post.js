import request from '@/utils/request'

export function getPostList(data) {
    return request({
        url: '/api/post/list/page',
        method: 'post',
        data
    })
}

export function deletePostInfo(data) {
    return request({
        url: '/api/post/delete',
        method: 'post',
        data
    })
}

export function updatePostInfo(data) {
    return request({
        url: '/api/post/update',
        method: 'post',
        data
    })
}

export function shenHeBatchPostStatus(data) {
    return request({
        url: '/api/post/status/batch',
        method: 'post',
        data
    })
}
