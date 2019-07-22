import React from 'react';

class Loader extends React.Component{

    render(){
        return(
            <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="xMidYMid"
                className="prefix__lds-square"
                style={{
                background: '0 0',
                }}
                {...this.props}
            >
                <path fill="#3be8b0" d="M15.305 15.305h9.39v9.39h-9.39z">
                <animateTransform
                    attributeName="transform"
                    type="scale"
                    calcMode="spline"
                    values="1;1;0.2;1;1"
                    keyTimes="0;0.2;0.5;0.8;1"
                    dur="1.6s"
                    keySplines="0.5 0.5 0.5 0.5;0 0.1 0.9 1;0.1 0 1 0.9;0.5 0.5 0.5 0.5"
                    begin="-0.6400000000000001s"
                    repeatCount="indefinite"
                />
                </path>
                <path fill="#1aafd0" d="M41.535 11.535h16.93v16.93h-16.93z">
                <animateTransform
                    attributeName="transform"
                    type="scale"
                    calcMode="spline"
                    values="1;1;0.2;1;1"
                    keyTimes="0;0.2;0.5;0.8;1"
                    dur="1.6s"
                    keySplines="0.5 0.5 0.5 0.5;0 0.1 0.9 1;0.1 0 1 0.9;0.5 0.5 0.5 0.5"
                    begin="-0.48s"
                    repeatCount="indefinite"
                />
                </path>
                <path fill="#6a67ce" d="M67.314 7.314h25.372v25.372H67.314z">
                <animateTransform
                    attributeName="transform"
                    type="scale"
                    calcMode="spline"
                    values="1;1;0.2;1;1"
                    keyTimes="0;0.2;0.5;0.8;1"
                    dur="1.6s"
                    keySplines="0.5 0.5 0.5 0.5;0 0.1 0.9 1;0.1 0 1 0.9;0.5 0.5 0.5 0.5"
                    begin="-0.32000000000000006s"
                    repeatCount="indefinite"
                />
                </path>
                <path fill="#1aafd0" d="M11.535 41.535h16.93v16.93h-16.93z">
                <animateTransform
                    attributeName="transform"
                    type="scale"
                    calcMode="spline"
                    values="1;1;0.2;1;1"
                    keyTimes="0;0.2;0.5;0.8;1"
                    dur="1.6s"
                    keySplines="0.5 0.5 0.5 0.5;0 0.1 0.9 1;0.1 0 1 0.9;0.5 0.5 0.5 0.5"
                    begin="-0.48s"
                    repeatCount="indefinite"
                />
                </path>
                <path fill="#6a67ce" d="M37.314 37.314h25.372v25.372H37.314z">
                <animateTransform
                    attributeName="transform"
                    type="scale"
                    calcMode="spline"
                    values="1;1;0.2;1;1"
                    keyTimes="0;0.2;0.5;0.8;1"
                    dur="1.6s"
                    keySplines="0.5 0.5 0.5 0.5;0 0.1 0.9 1;0.1 0 1 0.9;0.5 0.5 0.5 0.5"
                    begin="-0.32000000000000006s"
                    repeatCount="indefinite"
                />
                </path>
                <path fill="#ffb900" d="M65 35h30v30H65z">
                <animateTransform
                    attributeName="transform"
                    type="scale"
                    calcMode="spline"
                    values="1;1;0.2;1;1"
                    keyTimes="0;0.2;0.5;0.8;1"
                    dur="1.6s"
                    keySplines="0.5 0.5 0.5 0.5;0 0.1 0.9 1;0.1 0 1 0.9;0.5 0.5 0.5 0.5"
                    begin="-0.16000000000000003s"
                    repeatCount="indefinite"
                />
                </path>
                <path fill="#6a67ce" d="M7.314 67.314h25.372v25.372H7.314z">
                <animateTransform
                    attributeName="transform"
                    type="scale"
                    calcMode="spline"
                    values="1;1;0.2;1;1"
                    keyTimes="0;0.2;0.5;0.8;1"
                    dur="1.6s"
                    keySplines="0.5 0.5 0.5 0.5;0 0.1 0.9 1;0.1 0 1 0.9;0.5 0.5 0.5 0.5"
                    begin="-0.32000000000000006s"
                    repeatCount="indefinite"
                />
                </path>
                <path fill="#ffb900" d="M35 65h30v30H35z">
                <animateTransform
                    attributeName="transform"
                    type="scale"
                    calcMode="spline"
                    values="1;1;0.2;1;1"
                    keyTimes="0;0.2;0.5;0.8;1"
                    dur="1.6s"
                    keySplines="0.5 0.5 0.5 0.5;0 0.1 0.9 1;0.1 0 1 0.9;0.5 0.5 0.5 0.5"
                    begin="-0.16000000000000003s"
                    repeatCount="indefinite"
                />
                </path>
                <path fill="#fc636b" d="M65 65h30v30H65z">
                <animateTransform
                    attributeName="transform"
                    type="scale"
                    calcMode="spline"
                    values="1;1;0.2;1;1"
                    keyTimes="0;0.2;0.5;0.8;1"
                    dur="1.6s"
                    keySplines="0.5 0.5 0.5 0.5;0 0.1 0.9 1;0.1 0 1 0.9;0.5 0.5 0.5 0.5"
                    begin="0s"
                    repeatCount="indefinite"
                />
                </path>
            </svg>
        );
    }
}

export default Loader;