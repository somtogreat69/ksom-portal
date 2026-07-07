import React, { useState, useEffect } from 'react';
import { MapPin, MapPinOff, CheckCircle2, XCircle, Loader2, Navigation } from 'lucide-react';

const DOAF_ANCHOR = { lat: 9.0820, lng: 7.4892 };
const MAX_RADIUS = 150;

const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; 
    const toRad = (d: number) => d * (Math.PI / 180);
    const c = 2 * Math.atan2(
        Math.sqrt(Math.sin(toRad(lat2 - lat1)/2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(toRad(lon2 - lon1)/2) ** 2), 
        Math.sqrt(1 - (Math.sin(toRad(lat2 - lat1)/2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(toRad(lon2 - lon1)/2) ** 2))
    );
    return R * c;
};

type ViewState = 'LOADING' | 'DENIED' | 'READY' | 'TRANSMITTING' | 'SUCCESS' | 'ALREADY_CHECKED_IN';

export const DailyAttendance: React.FC = () => {
    const [viewState, setViewState] = useState<ViewState>('LOADING');
    const [distance, setDistance] = useState<number | null>(null);
    const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
    const [resultData, setResultData] = useState<{date: string, sequence: number} | null>(null);
    const [errorMsg, setErrorMsg] = useState<string>("");

    useEffect(() => {
        if (!navigator.geolocation) {
            setViewState('DENIED');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setLocation({ lat: latitude, lng: longitude });
                setDistance(getDistance(latitude, longitude, DOAF_ANCHOR.lat, DOAF_ANCHOR.lng));
                setViewState('READY');
            },
            (err) => {
                console.warn(err);
                setViewState('DENIED');
            },
            { enableHighAccuracy: true, maximumAge: 0 }
        );
    }, []);

    const handleCheckIn = async () => {
        if (!location) return;
        setViewState('TRANSMITTING');

        try {
            const response = await fetch('/api/attendance/checkin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ latitude: location.lat, longitude: location.lng })
            });

            const data = await response.json();

            if (response.ok) {
                setResultData({ date: data.date, sequence: data.sequence_number });
                setViewState('SUCCESS');
            } else if (response.status === 409) {
                setResultData({ date: data.date, sequence: data.sequence_number });
                setViewState('ALREADY_CHECKED_IN');
                setErrorMsg(data.message);
            } else {
                setErrorMsg(data.message || "An error occurred.");
                setViewState('READY');
            }
        } catch (err) {
            setErrorMsg("Network error. Please check your connection and try again.");
            setViewState('READY');
        }
    };

    const isWithinGeofence = distance !== null && distance <= MAX_RADIUS;

    const CardWrapper = ({ children }: { children: React.ReactNode }) => (
        <div className="w-full max-w-md bg-[#171717] rounded-2xl shadow-2xl overflow-hidden border border-white/5">
            <div className="bg-[#0f0f0f] border-b border-white/5 p-6 text-center">
                <h2 className="text-2xl font-extrabold text-[#e3e3e3] tracking-tight">Daily Attendance</h2>
                <p className="text-white/40 text-sm mt-1 font-medium">Verify your physical location</p>
            </div>
            <div className="p-6">
                {children}
            </div>
        </div>
    );

    if (viewState === 'LOADING') {
        return (
            <CardWrapper>
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                    <div className="relative">
                        <div className="absolute inset-0 bg-white/10 rounded-full animate-ping opacity-75"></div>
                        <Navigation className="relative text-[#e3e3e3] w-12 h-12 animate-pulse" />
                    </div>
                    <p className="text-white/60 font-medium animate-pulse">Acquiring high-precision GPS...</p>
                </div>
            </CardWrapper>
        );
    }

    if (viewState === 'DENIED') {
        return (
            <CardWrapper>
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-red-950/30 rounded-full flex items-center justify-center mb-2">
                        <MapPinOff className="text-red-500 w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-[#e3e3e3]">Location Access Denied</h3>
                    <p className="text-white/60 text-sm leading-relaxed">
                        We need your device's location to verify you are at the DOAF Headquarters. Please enable GPS permissions in your browser and refresh the page.
                    </p>
                </div>
            </CardWrapper>
        );
    }

    if (viewState === 'SUCCESS' && resultData) {
        return (
            <CardWrapper>
                <div className="flex flex-col items-center text-center space-y-4 py-4">
                    <div className="w-20 h-20 bg-emerald-950/30 rounded-full flex items-center justify-center mb-2 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
                        <CheckCircle2 className="text-emerald-500 w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#e3e3e3]">Attendance Confirmed</h3>
                    <div className="bg-[#0f0f0f] border border-white/5 rounded-xl p-4 w-full mt-4">
                        <p className="text-white/40 text-sm mb-1 uppercase tracking-wider font-semibold">Sequence Number</p>
                        <p className="text-5xl font-black text-[#e3e3e3]">#{resultData.sequence}</p>
                        <p className="text-white/30 text-xs mt-2 font-medium">{resultData.date}</p>
                    </div>
                </div>
            </CardWrapper>
        );
    }

    if (viewState === 'ALREADY_CHECKED_IN' && resultData) {
        return (
            <CardWrapper>
                 <div className="flex flex-col items-center text-center space-y-4 py-4">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-2">
                        <CheckCircle2 className="text-white/60 w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-[#e3e3e3]">Already Signed In</h3>
                    <p className="text-white/60 text-sm leading-relaxed">{errorMsg}</p>
                </div>
            </CardWrapper>
        );
    }

    return (
        <CardWrapper>
            <div className="space-y-6">
                <div className="bg-[#0f0f0f] rounded-xl p-4 border border-white/5 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${isWithinGeofence ? 'bg-emerald-950/30' : 'bg-red-950/30'}`}>
                            <MapPin className={`w-5 h-5 ${isWithinGeofence ? 'text-emerald-500' : 'text-red-500'}`} />
                        </div>
                        <div>
                            <p className="text-xs text-white/40 font-semibold uppercase tracking-wider">Distance from Venue</p>
                            <p className="text-lg font-bold text-[#e3e3e3]">
                                {distance !== null ? `${Math.round(distance).toLocaleString()} meters` : '--'}
                            </p>
                        </div>
                    </div>
                </div>

                {!isWithinGeofence && (
                    <div className="flex items-start space-x-3 bg-red-950/20 border border-red-900/30 p-4 rounded-xl text-red-300">
                        <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <p className="text-sm font-medium leading-relaxed">
                            Attendance blocked. You must be within {MAX_RADIUS}m of the DOAF Headquarters in Kado Express to sign in.
                        </p>
                    </div>
                )}

                {errorMsg && viewState === 'READY' && (
                    <div className="flex items-start space-x-3 bg-amber-950/20 border border-amber-900/30 p-4 rounded-xl text-amber-300">
                        <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <p className="text-sm font-medium">{errorMsg}</p>
                    </div>
                )}

                <button
                    onClick={handleCheckIn}
                    disabled={!isWithinGeofence || viewState === 'TRANSMITTING'}
                    className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center space-x-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-white/20
                        ${isWithinGeofence 
                            ? 'bg-[#e3e3e3] text-[#0f0f0f] hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed' 
                            : 'bg-white/5 text-white/30 cursor-not-allowed border border-white/10'}`}
                >
                    {viewState === 'TRANSMITTING' ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Verifying...</span>
                        </>
                    ) : (
                        <span>Mark Attendance</span>
                    )}
                </button>
            </div>
        </CardWrapper>
    );
};