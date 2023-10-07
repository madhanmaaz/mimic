const socket = io("", {
    path: '/socket.io',
    transports: ['websocket'],
    secure: true,
})

let targetUrl = document.querySelector("#target-url")
let copyBtn = document.querySelector("#copy-btn")

targetUrl.value = `${location.origin}/mimic/${ID}`

copyBtn.addEventListener("click", () => {
    targetUrl.select()
    document.execCommand("copy")
})

var index = 1
socket.on(ID, data => {
    document.title = `${index} Mimic Panel`
    document.querySelector(".data-box").innerHTML += tableRender(data, index)
    index += 1

    let b = document.querySelectorAll(".data-box .item")
    if (b.length > 0) {
        b[b.length - 1].querySelector("a").click()
    }
    console.log(data)

})

function tableRender(data, index) {
    let html = `
    <div class="item">
    <a href="#item-${index}" id="item-${index}">
    <i class="fa-solid fa-terminal"></i> ${index}</a>
    
    <table>`

    for (let key in data) {
        if (typeof data[key] === 'object' && data[key] !== null) {
            let inTable = ` <tr>
                <th>${key}</th>
                <td>
                    <table>
                        `
            for (let ina in data[key]) {
                inTable += `<tr>
                    <th>${ina}</th>
                    <td>${data[key][ina]}</td>
                </tr>`
            }
            inTable += `</table></td></tr>`
            html += inTable
        } else {
            html += `<tr>
                <th>${key}</th>
                <td>${data[key]}</td>
            </tr>`
        }
    }

    html += `</table></div>`
    return html
}