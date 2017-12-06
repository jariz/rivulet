type Name = string | 'public' | 'private'
type Family = 'ipv4' | 'ipv6'

declare module 'ip' {
    export function address (name?: Name, family?: Family): string
}

type SsdpOpts = {
    // this is not the full list...
    // https://github.com/diversario/node-ssdp#configuration
    customLogger?: (...args: any[]) => void
}

declare module 'node-ssdp' {
    import EventEmitter = NodeJS.EventEmitter;

    export class Client extends EventEmitter {
        constructor (opts?: SsdpOpts);
        search (serviceType: string): string;
    }
}