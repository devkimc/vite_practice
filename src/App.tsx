import React, { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import './App.css';
import * as Constants from './constants/mapConstants';

type Map = {
    setCenter: (latlng: object) => void;
};

const App = () => {
    const [mapObj, setMapObj] = useState<Map>();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const displayMarker = (locPosition: any) => {
        // 마커를 생성합니다
        if (mapObj) {
            const marker = new window.kakao.maps.Marker({
                position: locPosition,
                clickable: true,
            });

            marker.setMap(mapObj);
            mapObj.setCenter(locPosition);
        }
    };

    const positionCallBack = async (position: {
        coords: { latitude: number; longitude: number };
    }) => {
        const lat = position.coords.latitude; // 위도
        const lon = position.coords.longitude; // 경도
        const locPosition = await new window.kakao.maps.LatLng(lat, lon); // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다

        // 마커와 인포윈도우를 표시합니다
        displayMarker(locPosition);
    };

    const setCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(positionCallBack);
        }
    };

    useEffect(() => {
        if (mapObj) {
            setCurrentLocation();
        }
    }, [mapObj]);

    const initMap = async () => {
        const mapOptions = {
            center: new window.kakao.maps.LatLng(
                Constants.POSITION_LAT_CDNT,
                Constants.POSITION_LNG_CDNT,
            ),
            level: 3,
        };
        const container = document.getElementById('map');
        const initMapObj = new window.kakao.maps.Map(container, mapOptions);
        setMapObj(initMapObj);
    };

    useEffect(() => {
        /* 카카오맵 */
        const script = document.createElement('script');
        script.onload = () => window.kakao.maps.load(initMap);
        script.src =
            Constants.KAKAO_MAP_API_URL +
            import.meta.env.VITE_API_KEY_KAKAO_MAP +
            Constants.KAKAO_MAP_API_SERVICES;
        document.head.appendChild(script);
    }, []);

    return (
        <div className="App">
            <div>
                <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
                    <img src="/vite.svg" className="logo" alt="Vite logo" />
                </a>
                <a href="https://reactjs.org" target="_blank" rel="noreferrer">
                    <img
                        src={reactLogo}
                        className="logo react"
                        alt="React logo"
                    />
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
                <p>
                    Edit <code>src/App.tsx</code> and save to test HMR
                </p>
            </div>
            <div id="map" style={{ width: '50vh', height: '50vh' }} />
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
        </div>
    );
};

export default App;
