export const fetchData = (url) => {
    return fetch(url).then((resp) => {
        return resp.json()
    })
}