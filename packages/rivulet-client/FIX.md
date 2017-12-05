# FIX
make sure these actions are done.

## react-router typings expect a "global" JSX.
[github issue](https://github.com/types/npm-react-router/issues/3)

*Workaround*
> add this snippet to typings/modules/react-router/index.d.ts 

```TS
// MLS: Fix to work with npm react typings.
// Issue: https://github.com/types/npm-react-router/issues/3

declare namespace JSX {
	export interface Element {
		type:any,
		props:any
	}
}

// ---------------------------------------------------------.
```