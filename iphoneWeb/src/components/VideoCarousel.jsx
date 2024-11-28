import React, { useEffect, useRef, useState } from 'react';
import { hightlightsSlides } from '../constants';
import gsap from 'gsap';
import { pauseImg, playImg, replayImg } from '../utils';
import { useGSAP } from '@gsap/react';

function VideoCarousel() {
    const videoRef = useRef([]);
    const videoSpanRef = useRef([]);
    const videoDivRef = useRef([]);

    const [video, setVideo] = useState({
        isEnd: false,
        startPlay: false,
        videoId: 0,
        isLastVideo: false,
        isPlaying: false,
    });

    const [loadedData, setLoadedData] = useState([]);
    const { isEnd, startPlay, videoId, isLastVideo, isPlaying } = video;

    useGSAP(() => {
        gsap.to('#slider', {
            transform: `translateX(${-100 * videoId}%)`,
            duration: 2,
            ease: 'power2.inOut'
        })
        gsap.to('#video', {
            scrollTrigger: {
                trigger: '#video',
                toggleActions: 'restart none none',
            },
            onComplete: () => {
                setVideo((prevVideo) => ({
                    ...prevVideo,
                    startPlay: true,
                    isPlaying: true,
                }));
            },
        });
    }, [isEnd, videoId]);

    useEffect(() => {
        if (loadedData.length > 3) {
            const currentVideo = videoRef.current[videoId];
            if (currentVideo) {
                if (!isPlaying) {
                    currentVideo.pause();
                } else if (startPlay) {
                    currentVideo
                        .play()
                        .catch((error) =>
                            console.error(`Error playing video ${videoId}:`, error)
                        );
                }
            } else {
                console.warn(`Video reference at index ${videoId} is undefined.`);
            }
        }
    }, [startPlay, videoId, isPlaying, loadedData]);

    const handleLoadedMetaData = (e) =>
        setLoadedData((prevLoadedData) => [...prevLoadedData, e]);

    // GSAP animation logic
    useEffect(() => {
        let currentProgress = 0;
    
        if (videoSpanRef.current[videoId]) {
            const span = videoSpanRef.current[videoId];
            const div = videoDivRef.current[videoId];
            const targetWidth = window.innerWidth < 760 ? '10vw'
                : window.innerWidth < 1200 ? '10vw'
                    : '4vw';
    
            const animation = gsap.to(span, {
                opacity: 1,
                onUpdate: () => {
                    const progress = Math.ceil(animation.progress() * 100);
                    if (progress !== currentProgress) {
                        currentProgress = progress;
                        gsap.to(div, { width: targetWidth });
                        gsap.to(span, {
                            width: `${currentProgress}%`,
                            backgroundColor: 'white',
                        });
                    }
                },
                onComplete: () => {
                    if (isPlaying) {
                        gsap.to(videoDivRef.current[videoId], { width: '12px' });
                        gsap.to(span, { backgroundColor: '#afafaf' });
                    }
                },
            });
            const animUpdate = () => {
                const currentVideo = videoRef.current[videoId];
                if (currentVideo) {
                    const currentTime = currentVideo.currentTime;
                    const duration = hightlightsSlides[videoId]?.videoDuration || 1;
                    animation.progress(currentTime / duration);
                }
            };
            if (isPlaying) {
                gsap.ticker.add(animUpdate);
            } else {
                gsap.ticker.remove(animUpdate);
            }
        }
    }, [videoId, isPlaying, hightlightsSlides]);
    

    const handleProcess = (type, i) => {
        setVideo((prevVideo) => {
            switch (type) {
                case 'video-end':
                    return {
                        ...prevVideo,
                        isEnd: i + 1 >= hightlightsSlides.length,
                        videoId: i + 1 < hightlightsSlides.length ? i + 1 : i,
                    };
                case 'video-last':
                    return { ...prevVideo, isLastVideo: true, isEnd: true };
                case 'video-reset':
                    return { ...prevVideo, isLastVideo: false, isEnd: false, videoId: 0 };
                case 'play':
                    return { ...prevVideo, isPlaying: !prevVideo.isPlaying };
                case 'pause':
                    return { ...prevVideo, isPlaying: !prevVideo.isPlaying }; 
                case 'video-select':
                    if(videoRef.current[prevVideo.videoId]){
                        videoRef.current[prevVideo.videoId].pause();
                    }
                    if(videoRef.current[i]){
                        videoRef.current[i].play()
                    }
                    return { ...prevVideo, videoId: i, isPlaying: true };
                default:
                    return prevVideo;
            }
        });
    };

    return (
        <>
            <div className="flex items-center">
                {hightlightsSlides.map((list, i) => (
                    <div key={list.id} id='slider' className="sm:pr-20 pr-10">
                        <div className="video-carousel_container">
                            <div className="w-full h-full flex-center items-center rounded-3xl overflow-hidden bg-black">
                                <video
                                    ref={(el) => (videoRef.current[i] = el)}
                                    preload="auto"
                                    playsInline
                                    muted
                                    onPlay={() => setVideo((prevVideo) => ({ ...prevVideo, isPlaying: true }))}
                                    onLoadedMetadata={handleLoadedMetaData}
                                    onEnded={() =>
                                        handleProcess(i !== hightlightsSlides.length - 1 ? 'video-end' : 'video-last', i)
                                    }
                                    className= {`${list.id} == 2 ? 'translate-x-44 pointer-events-none : '' `}
                                >
                                    <source src={list.video} type="video/mp4" />
                                </video>
                            </div>
                            <div className="absolute top-12 left-[5%] z-10">
                                {list.textLists.map((text) => (
                                    <p key={text} className="md:text-2xl text-xl font-medium">
                                        {text}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="relative flex-center mt-10">
                <div className="flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full">
                    {hightlightsSlides.map((_, i) => (
                        <span
                            key={i}
                            ref={(el) => (videoDivRef.current[i] = el)}
                            className="mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer"
                            onClick={ () => handleProcess('video-select', i)}
                        >
                            <span
                                ref={(el) => (videoSpanRef.current[i] = el)}
                                className="absolute h-full w-full rounded-full"
                            />
                        </span>
                    ))}
                </div>
                <button className="control-btn" onClick={() => handleProcess(isEnd ? 'video-reset' : 'play')}>
                    <img
                        src={isEnd ? replayImg : isPlaying ? pauseImg : playImg}
                        alt={isEnd ? 'replay' : isPlaying ? 'pause' : 'play'}
                    />
                </button>
            </div>
        </>
    );
}

export default VideoCarousel;
