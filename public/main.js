const d = document;
const inputUrl = d.querySelector('.input')
const submit = d.querySelector('#btn')
const result = d.querySelector('.rslt')
const hidden = d.querySelector('#hidden')


submit.onclick = createLink


function createLink() {
if (inputUrl.value.length == 0) {
    inputUrl.style.border = '2px solid #dc3545'
} else {
    inputUrl.style.border = '2px solid #20c997';

    startServer(inputUrl.value)
}
}

const newLink = d.querySelector('#newLink')
const btnCopy = d.querySelector('#btnCopy')
const linkOrigin = d.querySelector('#linkOrigin')


async function startServer(linkText) {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({url: linkText})
    }

    const url = await fetch('/create-link', options)
    const res = await url.json()

    result.style.display = 'flex';

    newLink.setAttribute('href', res.link)
    newLink.innerHTML = res.link.replace('https://', '')
    linkOrigin.innerHTML = linkText
    hidden.setAttribute('value', res.link)

}


btnCopy.onclick = () => {   
    hidden.select();
    hidden.setSelectionRange(0, 99999)
    navigator.clipboard.writeText(hidden.value)
}


