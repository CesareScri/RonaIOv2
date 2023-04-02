const d = document;
const fileElement = document.querySelector('#fileInput')

function $(id) {
    return d.querySelector(id)
}

const principale = d.querySelector('.principale')
const uploading = d.querySelector('.uploading')
const result = d.querySelector('.result')

$('#btn-upload').addEventListener('click', async () => {
      // check if user had selected a file
      if (fileElement.files.length === 0) {
        d.querySelector('.alert').style.display = 'flex';

        setTimeout(() => {
            d.querySelector('.alert').style.animationName = 'shows'
            d.querySelector('.alert').style.display = 'none';
        }, 2500);
        return
      }

      principale.style.display = 'none'
      uploading.style.display = 'flex'


      const percento = d.querySelector('#percento')
      const fileNames = d.querySelector('#fileNames')
      const pBar = d.querySelector('.progress')
      const mbU = d.querySelector('#mbU')
      const mbT = d.querySelector('#mbT')
      const linkR = d.querySelector('#linkR')
      
      
      let file = fileElement.files[0]
      var formData = new FormData()
      formData.append('file', fileElement.files[0])

   
     console.log(file)

      axios.post(`/upload`, formData, {
        onUploadProgress: progressEvent => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          let kbTotal = progressEvent.total / 1000
        let kbup = progressEvent.loaded / 1000
        let mbTotal = kbTotal / 1000
        let mbUp = kbup / 1000

        percento.innerHTML = percentCompleted+'%'
        fileNames.innerHTML = file.name

        mbU.innerHTML = `${mbUp.toFixed(2)}MB`
        mbT.innerHTML = `${mbTotal.toFixed(2)}MB`

        pBar.style.width = percentCompleted+'%'

}})
        .then(res => {
            console.log(res.data)

            setTimeout(() => {
            principale.style.display = 'none'
            uploading.style.display = 'none'
            result.style.display = 'flex'

            linkR.setAttribute('target', `_blank`)
            linkR.setAttribute('href', `https://rona.li/d/${res.data.donwloadPage}`)
            linkR.innerHTML = `https://rona.li/d/${res.data.donwloadPage}`
            }, 3500);

   })

   
})


