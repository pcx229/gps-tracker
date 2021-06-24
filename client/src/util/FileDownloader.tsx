
export function download(name: string, link: string) {
    let a = document.createElement('a')
    document.body.appendChild(a)
    a.download = name
    a.href = link
    a.click()
    document.body.removeChild(a)
}