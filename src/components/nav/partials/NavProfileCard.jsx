import "./NavProfileCard.scss"
import React, {useEffect, useState} from 'react'
import {Card} from "react-bootstrap"
import {useLanguage} from "/src/providers/LanguageProvider.jsx"
import {useNavigation} from "/src/providers/NavigationProvider.jsx"
import {useUtils} from "/src/hooks/utils.js"
import {useData} from "/src/providers/DataProvider.jsx"
import {useFeedbacks} from "/src/providers/FeedbacksProvider.jsx"
import ImageView from "/src/components/generic/ImageView.jsx"
import StatusCircle from "/src/components/generic/StatusCircle.jsx"
import TextTyper from "/src/components/generic/TextTyper.jsx"
import AudioButton from "/src/components/buttons/AudioButton.jsx"

function NavProfileCard({ profile, expanded }) {
    const language = useLanguage()
    const navigation = useNavigation()
    const utils = useUtils()
    const data = useData()
    const feedbacks = useFeedbacks()

    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [animationKey, setAnimationKey] = useState(0)
    const profileImages = [
        "images/pictures/profile-picture.jpg",
        "images/pictures/profile-picture-2.jpg.png"
    ]

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % profileImages.length)
            setAnimationKey(prev => prev + 1) // Force le redémarrage de l'animation
        }, 15000) // Toute l'animation se répète toutes les 15 secondes

        return () => clearInterval(interval)
    }, [])

    const expandedClass = expanded ?
        `` :
        `nav-profile-card-shrink`

    const name = profile.name
    const stylizedName = language.getTranslation(profile.locales, "localized_name_stylized", null) ||
        language.getTranslation(profile.locales, "localized_name", null) ||
        name

    let roles = language.getTranslation(profile.locales, "roles", [])
    if(utils.storage.getWindowVariable("suspendAnimations") && roles.length > 2)
        roles = [roles[0]]

    const profilePictureUrl = language.parseJsonText(profile.profilePictureUrl)

    const statusCircleVisible = Boolean(profile.statusCircleVisible)
    const statusCircleVariant = statusCircleVisible ?
        profile.statusCircleVariant :
        ""

    const statusCircleHoverMessage = statusCircleVisible ?
        language.getTranslation(profile.locales, profile.statusCircleHoverMessage) :
        null

    const statusCircleSize = expanded ?
        StatusCircle.Sizes.DEFAULT :
        StatusCircle.Sizes.SMALL

    const namePronunciationIpa = language.getTranslation(profile.locales, "name_pronunciation_ipa", null)
    const namePronunciationAudioUrl = language.getTranslation(profile.locales, "name_pronunciation_audio_url", null)
    const namePronunciationButtonVisible = namePronunciationIpa || namePronunciationAudioUrl

    const navProfileCardNameClass = namePronunciationButtonVisible ?
        `nav-profile-card-name-with-audio-button` :
        ``

    const _onStatusBadgeClicked = () => {
        navigation.navigateToSectionWithId("contact")
    }

    const _onDownloadResume = () => {
        const resumeUrl = profile.resumePdfUrl
        if(!resumeUrl) {
            feedbacks.displayNotification(
                language.getString("error"),
                language.getString("error_file_not_found"),
                "error"
            )
            return
        }
        utils.file.download(resumeUrl)
    }

    return (
        <Card className={`nav-profile-card ${expandedClass}`}>
            <div className={`nav-profile-card-avatar-container`} key={animationKey}>
                <ImageView src={profileImages[currentImageIndex]}
                           className={`nav-profile-card-avatar animated-avatar`}
                           hideSpinner={true}
                           alt={name}/>
            </div>

            {statusCircleVisible && (
                <StatusCircle className={`nav-profile-card-status-circle`}
                              variant={statusCircleVariant}
                              message={statusCircleHoverMessage}
                              size={statusCircleSize} onClick={_onStatusBadgeClicked}/>
            )}

            <div className={`nav-profile-card-info`}>
                <h1 className={`nav-profile-card-name ${navProfileCardNameClass}`}>
                    <span dangerouslySetInnerHTML={{__html: stylizedName}}/>
                    {namePronunciationButtonVisible && (
                        <AudioButton url={namePronunciationAudioUrl}
                                     tooltip={namePronunciationIpa}
                                     size={AudioButton.Sizes.DYNAMIC_FOR_NAV_TITLE}/>
                    )}
                </h1>

                {roles?.length > 1 && (
                    <TextTyper strings={roles}
                               id={`role-typer`}
                               className={`nav-profile-card-role`}/>
                )}

                {roles?.length === 1 && (
                    <div className={`nav-profile-card-role`}
                         dangerouslySetInnerHTML={{__html: roles[0]}}/>
                )}

                {/* Mobile-only resume download button */}
                <div className="nav-profile-card-mobile-resume">
                    <button 
                        className="nav-profile-card-resume-btn"
                        onClick={_onDownloadResume}
                        title={language.getString("download_resume")}
                    >
                        <i className="fa-solid fa-file-arrow-down"></i>
                        <span>{language.getString("download_resume")}</span>
                    </button>
                </div>
            </div>
        </Card>
    )
}

export default NavProfileCard