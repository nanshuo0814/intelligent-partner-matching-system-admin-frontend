import request from '@/utils/request'

export function getReportList(data) {
    return request({
        url: '/api/report/list/page',
        method: 'post',
        data
    })
}

export function deleteReportInfo(data) {
    return request({
        url: '/api/report/delete',
        method: 'post',
        data
    })
}

export function updateReportInfo(data) {
    return request({
        url: '/api/report/update',
        method: 'post',
        data
    })
}

export function addReportInfo(data) {
    return request({
        url: '/api/report/add',
        method: 'post',
        data
    })
}