import request from '@/utils/request'

export function getPostCommentList(data) {
    return request({
        url: '/api/postComment/list/page',
        method: 'post',
        data
    })
}

export function deletepostCommentInfo(data) {
    return request({
        url: '/api/postComment/delete',
        method: 'post',
        data
    })
}

export function updatepostCommentInfo(data) {
    return request({
        url: '/api/postComment/update',
        method: 'post',
        data
    })
}
