document.querySelectorAll("#fm-copy").forEach(btn => {
    btn.addEventListener("click", () => {
        let value = btn.getAttribute("data-value")
        let u = `${location.origin}/mimic/${ID}/${value}`
        navigator.clipboard.writeText(u)
    })
})

document.querySelectorAll("#fm-delete").forEach(btn => {
    btn.addEventListener("click", () => {
        let value = btn.getAttribute("data-value")
        if (confirm("Delete " + value)) {
            GET(`/panel/fm/del?id=${ID}&value=${value}`, res => {
                location.reload()
            })
        }
    })
})

let fileInput = document.querySelector("#file")

fileInput.addEventListener("change", () => {
    axios.post(`/panel/fm/upload?id=${ID}`, {
        file: fileInput.files[0]
    }, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).then(res => {
        location.reload()
    })
})

async function GET(url, callback) {
    try {
        callback(await axios.get(url))
    } catch {
        alert("request error")
    }
}