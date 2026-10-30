// Ambient JSX & React type declarations fallback
// Fixes TS(7026): "JSX element implicitly has type 'any' because no interface 'JSX.IntrinsicElements' exists"
// when node_modules or @types/react is indexing or missing.

declare namespace JSX {
  type Element = any;
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
