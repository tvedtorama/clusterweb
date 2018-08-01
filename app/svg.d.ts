// https://github.com/boopathi/react-svg-loader/issues/222

declare module '*.svg' {
    import * as React from 'react';
    const content: React.SVGFactory;
    export default content;
}
