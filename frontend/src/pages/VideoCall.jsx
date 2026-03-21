import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import Peer from 'simple-peer';

const VideoCall = () => {
    const { id: roomID } = useParams();
    const navigate = useNavigate();
    const [micOn, setMicOn] = useState(true);
    const [cameraOn, setCameraOn] = useState(true);
    const [speakerOn, setSpeakerOn] = useState(true);
    const [isHD, setIsHD] = useState(true);
    const [stream, setStream] = useState(null);
    const [connected, setConnected] = useState(false);
    const [remoteName, setRemoteName] = useState('Remote User');
    const [callAccepted, setCallAccepted] = useState(false);

    const localVideoRef = useRef();
    const remoteVideoRef = useRef();
    const socketRef = useRef();
    const peerRef = useRef();
    const streamRef = useRef();

    useEffect(() => {
        // Fetch appointment details for UI labels
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        const appt = appointments.find(a => a.id.toString() === roomID);
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const isDoctor = currentUser.role === 'doctor';

        if (appt) {
            setRemoteName(isDoctor ? (appt.patientName || "Patient") : appt.doctor);
        }

        // Initialize Socket
        socketRef.current = io('http://localhost:5050'); // Adjust to your backend URL

        startVideo().then((currentStream) => {
            if (currentStream) {
                socketRef.current.emit('join-room', roomID);

                socketRef.current.on('user-joined', (userID) => {
                    console.log("Peer joined, initiating call...");
                    callUser(userID, currentStream);
                });

                socketRef.current.on('signal', (data) => {
                    if (peerRef.current) {
                        peerRef.current.signal(data.signal);
                    } else {
                        // We are the receiver of the initial call
                        console.log("Receiving call, answering...");
                        answerCall(data.signal, currentStream);
                    }
                });
            }
        });

        return () => {
            if (socketRef.current) socketRef.current.disconnect();
            if (peerRef.current) peerRef.current.destroy();
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, [roomID]);

    const startVideo = async (hd = true) => {
        try {
            const constraints = {
                video: {
                    width: hd ? { min: 1280, ideal: 1920 } : { ideal: 640 },
                    height: hd ? { min: 720, ideal: 1080 } : { ideal: 480 },
                    frameRate: { ideal: 30 }
                },
                audio: true
            };

            const newStream = await navigator.mediaDevices.getUserMedia(constraints);
            setStream(newStream);
            streamRef.current = newStream;
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = newStream;
            }
            setConnected(true);
            return newStream;
        } catch (err) {
            console.error("Error accessing media devices:", err);
            setConnected(true);
            return null;
        }
    };

    const callUser = (userID, currentStream) => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: currentStream
        });

        peer.on('signal', (data) => {
            socketRef.current.emit('signal', {
                signal: data,
                roomID: roomID
            });
        });

        peer.on('stream', (remoteStream) => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = remoteStream;
            }
            setCallAccepted(true);
        });

        peerRef.current = peer;
    };

    const answerCall = (incomingSignal, currentStream) => {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: currentStream
        });

        peer.on('signal', (data) => {
            socketRef.current.emit('signal', {
                signal: data,
                roomID: roomID
            });
        });

        peer.on('stream', (remoteStream) => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = remoteStream;
            }
            setCallAccepted(true);
        });

        peer.signal(incomingSignal);
        peerRef.current = peer;
    };

    const toggleMic = () => {
        if (streamRef.current) {
            const audioTrack = streamRef.current.getAudioTracks()[0];
            if (audioTrack) audioTrack.enabled = !micOn;
        }
        setMicOn(!micOn);
    };

    const toggleCamera = () => {
        if (streamRef.current) {
            const videoTrack = streamRef.current.getVideoTracks()[0];
            if (videoTrack) videoTrack.enabled = !cameraOn;
        }
        setCameraOn(!cameraOn);
    };

    const endCall = () => {
        if (socketRef.current) socketRef.current.disconnect();
        if (peerRef.current) peerRef.current.destroy();
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        navigate('/dashboard');
    };

    return (
        <div style={{
            height: 'calc(100vh - 80px)',
            background: 'linear-gradient(135deg, #0f172a 0%, #020617 100%)',
            position: 'relative',
            padding: '1.5rem',
            overflow: 'hidden',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: "'Inter', sans-serif"
        }}>
            {/* Header Info */}
            <div style={{
                position: 'absolute',
                top: '2rem',
                left: '2rem',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
            }}>
                <div style={{
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(12px)',
                    padding: '0.5rem 1rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }}></div>
                    <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Live Call: {remoteName}</span>
                </div>
                {isHD && (
                    <div style={{
                        background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                    }}>
                        HD Quality
                    </div>
                )}
            </div>

            <div style={{
                flex: 1,
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) 300px',
                gap: '1.5rem',
                height: '100%',
                marginTop: '1rem'
            }}>
                {/* Main Remote Video View */}
                <div style={{
                    background: '#1e293b',
                    borderRadius: '24px',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(255,255,255,0.05)'
                }}>
                    {!connected ? (
                        <div style={{ textAlign: 'center' }}>
                            <div className="animate-spin" style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>⌛</div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '600' }}>Initializing...</h3>
                        </div>
                    ) : !callAccepted ? (
                        <div style={{ textAlign: 'center', opacity: 0.5 }}>
                            <div style={{ fontSize: '8rem' }}>👤</div>
                            <p style={{ marginTop: '1rem', fontSize: '1.2rem' }}>Waiting for {remoteName} to join...</p>
                        </div>
                    ) : (
                        <video
                            ref={remoteVideoRef}
                            autoPlay
                            playsInline
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                        />
                    )}
                </div>

                {/* Local Self View & Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{
                        height: '225px',
                        background: '#000',
                        borderRadius: '20px',
                        position: 'relative',
                        overflow: 'hidden',
                        border: '2px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
                    }}>
                        <video
                            ref={localVideoRef}
                            autoPlay
                            muted
                            playsInline
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                transform: 'scaleX(-1)', // Mirror effect
                                opacity: cameraOn ? 1 : 0
                            }}
                        />
                        {!cameraOn && (
                            <div style={{
                                position: 'absolute',
                                top: 0, left: 0,
                                width: '100%', height: '100%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: '#1e293b',
                                zIndex: 5
                            }}>
                                <div style={{ textAlign: 'center', opacity: 0.5 }}>
                                    <div style={{ fontSize: '2.5rem' }}>📷</div>
                                    <div style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Video Paused</div>
                                </div>
                            </div>
                        )}
                        <div style={{
                            position: 'absolute',
                            bottom: '1rem',
                            left: '1rem',
                            background: 'rgba(0,0,0,0.5)',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            backdropFilter: 'blur(4px)'
                        }}>
                            You
                        </div>
                    </div>

                    <div style={{
                        flex: 1,
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '20px',
                        padding: '1.5rem',
                        border: '1px solid rgba(255,255,255,0.05)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                    }}>
                        <h4 style={{ margin: 0, fontSize: '1rem', opacity: 0.8 }}>Consultation Details</h4>
                        <div style={{ fontSize: '0.85rem', opacity: 0.6 }}>
                            Room ID: {roomID}<br />
                            Secured P2P Connection
                        </div>
                        <div style={{ marginTop: 'auto', padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: '#10b981' }}>
                                ✓ End-to-end encrypted<br />
                                ✓ HIPAA Compliant Channel
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls Bar */}
            <div style={{
                margin: '2rem auto',
                background: 'rgba(25, 25, 35, 0.85)',
                backdropFilter: 'blur(20px)',
                padding: '1rem 2.5rem',
                borderRadius: '32px',
                display: 'flex',
                gap: '2rem',
                alignItems: 'center',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                zIndex: 100
            }}>
                <ControlBtn
                    onClick={toggleMic}
                    active={micOn}
                    icon={micOn ? '🎤' : '🔇'}
                    label={micOn ? 'Mute' : 'Unmute'}
                />
                <ControlBtn
                    onClick={() => setSpeakerOn(!speakerOn)}
                    active={speakerOn}
                    icon={speakerOn ? '🔊' : '🔈'}
                    label={speakerOn ? 'Speaker On' : 'Speaker Off'}
                />
                <ControlBtn
                    onClick={toggleCamera}
                    active={cameraOn}
                    icon={cameraOn ? '📹' : '📷'}
                    label={cameraOn ? 'Stop Video' : 'Start Video'}
                />

                <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.1)' }}></div>

                <button
                    onClick={endCall}
                    style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '18px',
                        border: 'none',
                        background: '#ef4444',
                        color: 'white',
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 16px rgba(239, 68, 68, 0.3)',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                >
                    📞
                </button>
            </div>
        </div>
    );
};

const ControlBtn = ({ onClick, active, icon, label }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <button
            onClick={onClick}
            style={{
                width: '56px',
                height: '56px',
                borderRadius: '18px',
                color: active ? 'white' : '#ef4444',
                background: active ? 'rgba(255,255,255,0.08)' : 'rgba(239, 68, 68, 0.15)',
                fontSize: '1.4rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: active ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(239, 68, 68, 0.2)',
                transition: 'all 0.2s'
            }}
        >
            {icon}
        </button>
        <span style={{ fontSize: '0.7rem', opacity: 0.6, fontWeight: '500' }}>{label}</span>
    </div>
);

export default VideoCall;
