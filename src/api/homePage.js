import request from '@/utils/request'

export function getHomePageContent(data) {
    return request({
        url: '/api/homePageContentDisplay/list/page',
        method: 'post',
        data
    })
}

export function deleteHomePageContent(data) {
    return request({
        url: '/api/homePageContentDisplay/delete',
        method: 'post',
        data
    })
}

export function deleteBatchHomePageContent(data) {
    return request({
        url: '/api/homePageContentDisplay/delete/batch',
        method: 'post',
        data
    })
}

export function updateHomePageContent(data) {
    return request({
        url: '/api/homePageContentDisplay/update',
        method: 'post',
        data
    })
}

export function addHomePageContentInfo(data) {
    return request({
        url: '/api/homePageContentDisplay/add',
        method: 'post',
        data
    })
}

export function displayContentInfo() {
    return request({
        url: '/api/homePageContentDisplay',
        method: 'get',
    })
}