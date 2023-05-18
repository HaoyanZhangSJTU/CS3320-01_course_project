export function SendRequest({
    url = "/test",  // use "/init" for test only!
    header = { 'content-type': 'application/json' },
    method = "GET",
    data = { "None": 1 },
    success = (res) => { console.log("Request Success! But no success call back set") },
    fail = (info = "") => { console.log("Request Failed! " + info) },
}) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true); // async
    for (let prop in header) {
        xhr.setRequestHeader(prop, header[prop]);
    }
    if (method === 'GET') {
        xhr.send(null)
    } else if (method === 'POST') {
        xhr.send(JSON.stringify(data))
    }
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status === 200) {
            let text = xhr.responseText;
            let parsedText = JSON.parse(xhr.responseText);
            success(parsedText);
        }
    }
}