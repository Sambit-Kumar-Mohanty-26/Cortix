"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Camera, Mic, Check, X, RefreshCw, Loader2 } from "lucide-react";

interface HardwareCheckProps {
    onPermissionsGranted: (granted: boolean) => void;
}

export default function HardwareCheck({ onPermissionsGranted }: HardwareCheckProps) {
    const [cameraStatus, setCameraStatus] = useState<"pending" | "granted" | "denied" | "loading">("pending");
    const [micStatus, setMicStatus] = useState<"pending" | "granted" | "denied" | "loading">("pending");
    const [audioLevel, setAudioLevel] = useState(0);

    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    // Update parent when both permissions are granted
    useEffect(() => {
        const bothGranted = cameraStatus === "granted" && micStatus === "granted";
        onPermissionsGranted(bothGranted);
    }, [cameraStatus, micStatus, onPermissionsGranted]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
            }
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    const requestCamera = async () => {
        setCameraStatus("loading");
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }

            setCameraStatus("granted");
        } catch (error) {
            console.error("Camera access denied:", error);
            setCameraStatus("denied");
        }
    };

    const monitorAudioLevel = useCallback((stream: MediaStream) => {
        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(stream);

        analyser.fftSize = 256;
        source.connect(analyser);

        audioContextRef.current = audioContext;
        analyserRef.current = analyser;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const updateLevel = () => {
            analyser.getByteFrequencyData(dataArray);
            const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
            setAudioLevel(Math.min(100, avg * 1.5));
            animationFrameRef.current = requestAnimationFrame(updateLevel);
        };

        updateLevel();
    }, []);

    const requestMicrophone = async () => {
        setMicStatus("loading");
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // If we already have a video stream, add audio track
            if (streamRef.current) {
                stream.getAudioTracks().forEach((track) => {
                    streamRef.current?.addTrack(track);
                });
            } else {
                streamRef.current = stream;
            }

            monitorAudioLevel(stream);
            setMicStatus("granted");
        } catch (error) {
            console.error("Microphone access denied:", error);
            setMicStatus("denied");
        }
    };

    const getStatusIcon = (status: "pending" | "granted" | "denied" | "loading") => {
        switch (status) {
            case "loading":
                return <Loader2 size={18} className="spin" />;
            case "granted":
                return <Check size={18} />;
            case "denied":
                return <X size={18} />;
            default:
                return null;
        }
    };

    const getStatusClass = (status: "pending" | "granted" | "denied" | "loading") => {
        switch (status) {
            case "granted":
                return "status-granted";
            case "denied":
                return "status-denied";
            case "loading":
                return "status-loading";
            default:
                return "status-pending";
        }
    };

    return (
        <div className="hardware-check">
            <h2 className="check-title">Hardware Check</h2>
            <p className="check-subtitle">Grant camera and microphone access to start your exam</p>

            <div className="permissions-grid">
                {/* Camera Check */}
                <div className={`permission-card ${getStatusClass(cameraStatus)}`}>
                    <div className="permission-header">
                        <div className="permission-icon">
                            <Camera size={24} />
                        </div>
                        <div className="permission-info">
                            <h3>Camera</h3>
                            <span className={`permission-status ${cameraStatus}`}>
                                {cameraStatus === "pending" && "Not checked"}
                                {cameraStatus === "loading" && "Requesting..."}
                                {cameraStatus === "granted" && "Access granted"}
                                {cameraStatus === "denied" && "Access denied"}
                            </span>
                        </div>
                        <div className={`status-icon ${cameraStatus}`}>
                            {getStatusIcon(cameraStatus)}
                        </div>
                    </div>

                    <div className="video-preview">
                        {cameraStatus === "granted" ? (
                            <video ref={videoRef} autoPlay muted playsInline />
                        ) : (
                            <div className="preview-placeholder">
                                <Camera size={48} />
                            </div>
                        )}
                    </div>

                    {cameraStatus !== "granted" && (
                        <button
                            className="permission-btn"
                            onClick={requestCamera}
                            disabled={cameraStatus === "loading"}
                        >
                            {cameraStatus === "denied" ? (
                                <>
                                    <RefreshCw size={16} /> Retry Camera
                                </>
                            ) : (
                                "Enable Camera"
                            )}
                        </button>
                    )}
                </div>

                {/* Microphone Check */}
                <div className={`permission-card ${getStatusClass(micStatus)}`}>
                    <div className="permission-header">
                        <div className="permission-icon">
                            <Mic size={24} />
                        </div>
                        <div className="permission-info">
                            <h3>Microphone</h3>
                            <span className={`permission-status ${micStatus}`}>
                                {micStatus === "pending" && "Not checked"}
                                {micStatus === "loading" && "Requesting..."}
                                {micStatus === "granted" && "Access granted"}
                                {micStatus === "denied" && "Access denied"}
                            </span>
                        </div>
                        <div className={`status-icon ${micStatus}`}>
                            {getStatusIcon(micStatus)}
                        </div>
                    </div>

                    <div className="audio-preview">
                        {micStatus === "granted" ? (
                            <div className="audio-meter">
                                <div className="meter-label">Audio Level</div>
                                <div className="meter-bar">
                                    <div
                                        className="meter-fill"
                                        style={{ width: `${audioLevel}%` }}
                                    />
                                </div>
                                <div className="meter-hint">Speak to test your microphone</div>
                            </div>
                        ) : (
                            <div className="preview-placeholder">
                                <Mic size={48} />
                            </div>
                        )}
                    </div>

                    {micStatus !== "granted" && (
                        <button
                            className="permission-btn"
                            onClick={requestMicrophone}
                            disabled={micStatus === "loading"}
                        >
                            {micStatus === "denied" ? (
                                <>
                                    <RefreshCw size={16} /> Retry Microphone
                                </>
                            ) : (
                                "Enable Microphone"
                            )}
                        </button>
                    )}
                </div>
            </div>

            {(cameraStatus === "denied" || micStatus === "denied") && (
                <div className="permission-help">
                    <p>
                        <strong>Permission denied?</strong> Check your browser settings or click the lock icon in the address bar to manage permissions.
                    </p>
                </div>
            )}
        </div>
    );
}
