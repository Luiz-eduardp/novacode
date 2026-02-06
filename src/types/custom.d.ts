
declare module '@google/genai'
declare module 'ssh2-sftp-client'
declare module 'keytar'

declare global {
	interface Window {
		__electron__?: any;
		__electron_ssh__?: any;
	}
}

export {}
