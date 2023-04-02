const d = document;

function $(id) {
    return d.querySelector(id)
}

const c = $('.container')
const n = $('#noteTitle')
const t = $('#textarea')
const u = $('.result')
const l = $('#linkR')
const rT = $('#resultTitle')
const rB = $('#resultBody')

$('#btn').onclick = () => {
    if (n.value == 0) {

        $('.alert').style.display = 'flex'
        $('#alertFile').innerHTML = 'Title is required!'
        n.style.border = '2px solid #dc3545'
        setTimeout(() => {
            $('.alert').style.display = 'none'
        }, 3000);

    } else if (t.value == 0) {
            $('.alert').style.display = 'flex'
            $('#alertFile').innerHTML = 'Body cannot be empty!'
            t.style.border = '2px solid #dc3545'

        setTimeout(() => {
            $('.alert').style.display = 'none'
        }, 3000);
            
    } else {

        n.style.border = '2px solid #20c997'
        t.style.border = '2px solid #20c997'
        
        uploadNote(t.value, n.value)
    }
}

async function  uploadNote(a, b) {
    const data = {title: b, body: a}
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }
    const url = await fetch('/create-note',options)
    const json = await url.json()

    c.style.display = 'none'
    u.style.display = 'flex'

    rT.innerHTML = b
    rB.innerHTML = a
    l.innerHTML = json.link
}