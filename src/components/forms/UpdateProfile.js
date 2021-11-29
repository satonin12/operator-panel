import React, { useState } from 'react'
import {
  Upload,
  Progress
} from 'antd'
import ImgCrop from 'antd-img-crop'

import Button from '../Button/Button'
import LabelInput from '../Inputs/LabelInput/LabelInput'

import './index.scss'

const UpdateProfile = ({ formik }) => {
  const [progress, setProgress] = useState(0)
  const [fileList, setFileList] = useState([{
    uid: '-1',
    name: 'image.png',
    status: 'done',
    url: formik.values.avatarUrl || ''
  }])

  // Сохранение картинки в сервисе cloudinary
  const handleSubmit = async options => {
    const { onSuccess, onError, file, onProgress } = options
    const config = {
      headers: { 'content-type': 'multipart/form-data' },
      onUploadProgress: event => {
        const percent = Math.floor((event.loaded / event.total) * 100)
        setProgress(percent)
        if (percent === 100) {
          setTimeout(() => setProgress(0), 1000)
        }
        onProgress({ percent: (event.loaded / event.total) * 100 })
      }
    }

    try {
      // собираем с картинки
      const formData = new window.FormData()
      fileList.forEach((file) => {
        formData.append('files[]', file)
      })
      formData.append('upload_preset', 'operators_uploads')
      formData.append('file', file)
      formData.append('folder', 'avatars')

      await window.fetch('https://api.cloudinary.com/v1_1/dyjcgnzq7/image/upload', {
        method: 'POST',
        body: formData,
        config
      })
        .then(response => response.json())
        .then((data) => {
          onSuccess('Ok')
          formik.setFieldValue('avatarUrl', data.url)
        })
        .catch((e) => {
          onError({ e })
          throw (e)
        })
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

  const onChange = ({ file, fileList, event }) => {
    setFileList(fileList)
  }

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <div className='FormContent'>
          <LabelInput
            label='Имя'
            name='name'
            value={formik.values.name}
            onChange={formik.handleChange}
          />
          {formik.touched.name && formik.errors.name
            ? (
              <span className='formPrompt formPrompt--error'>
                {formik.errors.name}
              </span>
              )
            : null}

          <div className='formGroups'>
            <div className='Avatar'>
              <p>Обновить Аватар</p>
              <ImgCrop rotate>
                <Upload
                  accept='image/*'
                  onChange={onChange}
                  onPreview={onPreview}
                  listType='picture-card'
                  defaultFileList={fileList}
                  customRequest={handleSubmit}
                >
                  {fileList.length >= 1 ? null : '+ Upload'}
                </Upload>
                {progress > 0 ? <Progress percent={progress} /> : null}
              </ImgCrop>
            </div>
          </div>

          {formik.touched.avatarUrl && formik.errors.avatarUrl
            ? (
              <span className='formPrompt formPrompt--error'>
                {formik.errors.avatarUrl}
              </span>
              )
            : null}

          <div className='formLinks'>
            <Button type='submit'>Обновить профиль</Button>
          </div>
        </div>
      </form>
    </>
  )
}

export default UpdateProfile
