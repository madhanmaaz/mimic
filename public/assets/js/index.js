const targetName = document.querySelector("#target-name")
const create = document.querySelector("#create")
const deleteAll = document.querySelector("#delete-all")

create.addEventListener("click", async () => {
    if (targetName.value != "" && targetName.value.length > 0) {
        GET(`/create?target=${btoa(targetName.value)}`, data => {
            location.reload()
        })
    }
})

deleteAll.addEventListener("click", () => {
    if (confirm("delete all?")) {
        GET("/delete?value=all", res => {
            location.reload()
        })
    }
})

document.querySelectorAll(".box button").forEach(btn => {
    btn.addEventListener("click", () => {
        let id = btn.getAttribute("data-id")
        let name = btn.getAttribute("data-name")
        if (confirm("delete " + name + " ?")) {
            GET("/delete?value=" + id, res => {
                location.reload()
            })
        }
    })
})

document.querySelectorAll(".box p").forEach(btn => {
    btn.addEventListener("click", () => {
        let id = btn.getAttribute("data-id")
        location.href = `/panel?id=${id}`
    })
})

async function GET(url, callback) {
    try {
        callback(await axios.get(url))
    } catch {
        alert("request error")
    }
}