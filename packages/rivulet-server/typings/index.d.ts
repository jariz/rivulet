type Name = string | 'public' | 'private'
type Family = 'ipv4' | 'ipv6'

declare module 'ip' {
    export function address (name?: Name, family?: Family): string
}