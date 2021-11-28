import React, { useState } from 'react'
import {
  Upload,
  Spin
} from 'antd'
import ImgCrop from 'antd-img-crop'

import Button from '../Button/Button'
import LabelInput from '../Inputs/LabelInput/LabelInput'

import './index.scss'

const UpdateProfile = ({ formik, closeModal }) => {
  // ! NOTICE: One is used to display the uploaded picture, with one state it will not be possible to view the uploaded photo
  const [unloader, setUnloader] = useState(false)
  const [fileList, setFileList] = useState([]) // * for save
  const [previewFile, setPreviewFile] = useState([]) // * preview

  // Сохранение картинки в сервисе cloudinary
  const handleSubmit = (e) => {
    try {
      e.preventDefault()
      // собираем с картинки
      const formData = new window.FormData()
      fileList.forEach((file) => {
        formData.append('files[]', file)
      })
      formData.append('upload_preset', 'operators_uploads')
      formData.append('file', fileList[0])
      formData.append('folder', 'avatars')

      window.fetch('https://api.cloudinary.com/v1_1/dyjcgnzq7/image/upload', {
        method: 'POST',
        body: formData
      })
        .then(response => response.json())
        .then(_ => closeModal())
        .catch((e) => { throw (e) })
    } catch (error) {
      console.error(error)
    }
  }

  // View full image by click
  const onPreview = async file => {
    let src = file.url
    if (!src) {
      src = await new Promise(resolve => {
        const reader = new window.FileReader()
        reader.readAsDataURL(file.originFileObj)
        reader.onload = () => resolve(reader.result)
      })
    }
    const image = new window.Image()
    image.src = src
    const imgWindow = window.open(src)
    imgWindow.document.write(image.outerHTML)
  }

  /*
    ! NOTICE
    * For a preview of the picture, only the address is needed,
    * so manually before loading, we read the address and set both the picture and the address to the state
  */
  const beforeUpload = (file) => {
    setUnloader(true)
    const reader = new window.FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      setPreviewFile((prev) => [...prev, { url: reader.result }])
      setFileList((prev) => [...prev, file])
      setUnloader(false)
    }
    // then upload `file` from the argument manually
    return false
  }

  return (
    <>
      <form>
        <div className='FormContent'>
          <LabelInput label='Имя' />

          <div className='formGroups'>
            <p>Обновить Аватар</p>
            <ImgCrop rotate>
              <Upload
                fileList={previewFile}
                beforeUpload={beforeUpload}
                onPreview={onPreview}
                listType='picture-card'
              >
                {previewFile.length < 1 && '+ Upload'}
              </Upload>
            </ImgCrop>
            {unloader &&
              <span className='loading'>
                <Spin tip='Loading...' size='small' />
              </span>}

          </div>

          <div className='formLinks'>
            <Button onClick={handleSubmit}>Обновить профиль</Button>
          </div>
        </div>
      </form>
    </>
  )
}

export default UpdateProfile
