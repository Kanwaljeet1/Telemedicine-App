// Polyfills for WebRTC libraries (simple-peer)
import { Buffer } from 'buffer';

// Set global Buffer before any other imports
if (typeof window !== 'undefined') {
    window.Buffer = Buffer;
    window.global = window;
    window.process = {
        env: { NODE_ENV: 'development' },
        nextTick: (fn) => setTimeout(fn, 0),
        browser: true
    };
}
