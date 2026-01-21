import "./GalleryModal.scss"
import React, {useEffect, useState} from 'react'
import {ModalWrapper, ModalWrapperTitle, ModalWrapperBody} from "/src/components/modals/base/ModalWrapper"
import { Swiper, SwiperSlide } from 'swiper/react'
import {Pagination} from "swiper/modules"
import {useUtils} from "/src/hooks/utils.js"
import {useViewport} from "/src/providers/ViewportProvider.jsx"
import {Spinner} from "react-bootstrap"

function GalleryModal({ target, onDismiss }) {
    const utils = useUtils()
    const viewport = useViewport()

    const images = target?.images
    const type = target?.type
    const title = target?.title
    const isMobile = !viewport.isBreakpoint("lg")

    const [didLoadAllImages, setDidLoadAllImages] = useState(false)
    const [imageLoadStatusMap, setImageLoadStatusMap] = useState({})
    const [shouldDismiss, setShouldDismiss] = useState(false)

    const modalCustomClass = !didLoadAllImages ? `gallery-modal-loading` : ``

    useEffect(() => {
        setDidLoadAllImages(false)
        setImageLoadStatusMap({})
    }, [images])

    useEffect(() => {
        if(!images || images.length === 0)
            return

        const completed = Object.values(imageLoadStatusMap).filter(Boolean).length
        if(completed >= images.length)
            setDidLoadAllImages(true)
    }, [imageLoadStatusMap, images])

    useEffect(() => {
        setShouldDismiss(false)
    }, [target])

    if(!target)
        return <></>

    const parameters = utils.array.withId([
        { id: "9:16",   suffix: "portrait",     direction: "horizontal" },
        { id: "16:9",   suffix: "landscape",    direction: isMobile ? "vertical" : "horizontal" },
        { id: "1:1",    suffix: "default",      direction: isMobile ? "vertical" : "horizontal" },
    ], type, "default")

    const visibilityClassName = didLoadAllImages ?
        `visible` :
        `invisible`

    const _onClose = () => {
        setShouldDismiss(true)
    }

    const _onImageLoadStatus = (index) => {
        setImageLoadStatusMap(prev => {
            if(prev[index]) return prev
            return {
                ...prev,
                [index]: true
            }
        })
    }

    return (
        <ModalWrapper id={`gallery-modal`}
                      className={`${modalCustomClass} gallery-modal-${parameters.direction}`}
                      dialogClassName={`modal-fullscreen`}
                      shouldDismiss={shouldDismiss}
                      onDismiss={onDismiss}>
            <ModalWrapperTitle title={title}
                               faIcon={`fa-regular fa-image`}
                               onClose={_onClose} tooltip={"hidden"}/>

            <ModalWrapperBody className={`gallery-modal-body`}>
                {parameters.direction === "horizontal" && (
                    <GalleryModalSwiper className={visibilityClassName}
                                        images={images}
                                        type={parameters.suffix}
                                        onImageLoadStatus={_onImageLoadStatus}/>
                )}

                {parameters.direction === "vertical" && (
                    <GalleryModalImageStack className={visibilityClassName}
                                            images={images}
                                            onImageLoadStatus={_onImageLoadStatus}/>
                )}

                {!didLoadAllImages && (
                    <GalleryModalSpinner/>
                )}
            </ModalWrapperBody>
        </ModalWrapper>
    )
}

function GalleryModalSwiper({ className, images, type, onImageLoadStatus }) {
    const utils = useUtils()

    const _resolveSrc = (path) => {
        const resolved = utils.file.resolvePath(path)
        return encodeURI(resolved).replaceAll("'", "%27")
    }

    return (
        <Swiper slidesPerView={"auto"}
                direction={"horizontal"}
                spaceBetween={15}
                pagination={{ clickable: true }}
                modules={[Pagination]}
                className={`gallery-swiper gallery-swiper-${type} ${className}`}>
            {images.map((image, key) => (
                <SwiperSlide key={key}
                             className={`gallery-swiper-slide`}>
                    <img className={`swiper-image`}
                         alt={`img-` + key}
                         src={_resolveSrc(image)}
                         onLoad={() => onImageLoadStatus && onImageLoadStatus(key)}
                         onError={() => onImageLoadStatus && onImageLoadStatus(key)}/>
                </SwiperSlide>
            ))}
        </Swiper>
    )
}

function GalleryModalImageStack({ className, images, onImageLoadStatus }) {
    const utils = useUtils()

    const _resolveSrc = (path) => {
        const resolved = utils.file.resolvePath(path)
        return encodeURI(resolved).replaceAll("'", "%27")
    }

    return (
        <div className={`gallery-modal-image-stack ${className}`}>
            {images.map((image, key) => (
                <div key={key}
                     className={`gallery-modal-image-stack-item`}>
                    <img className={`swiper-image`}
                         alt={`img-` + key}
                         src={_resolveSrc(image)}
                         onLoad={() => onImageLoadStatus && onImageLoadStatus(key)}
                         onError={() => onImageLoadStatus && onImageLoadStatus(key)}/>
                </div>
            ))}
        </div>
    )
}

function GalleryModalSpinner() {
    return (
        <div className={`gallery-modal-spinner`}>
            <Spinner/>
        </div>
    )
}

export default GalleryModal