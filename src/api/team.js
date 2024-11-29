import request from '@/utils/request'

export function getTeamList(data) {
    return request({
        url: '/api/team/list/page',
        method: 'post',
        data
    })
}

export function deleteTeamInfo(data) {
    return request({
        url: '/api/team/delete',
        method: 'post',
        data
    })
}

export function updateTeamInfo(data) {
    return request({
        url: '/api/team/update',
        method: 'post',
        data
    })
}
