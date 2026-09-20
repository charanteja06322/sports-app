// Polyfill for React Native URL.prototype.protocol setter
// In React Native / Hermes, URL.prototype only has a getter for 'protocol'.
// This polyfill adds a setter so assigning url.protocol = 'http:' does not throw.
if (typeof URL !== 'undefined' && URL.prototype) {
  try {
    const desc = Object.getOwnPropertyDescriptor(URL.prototype, 'protocol');
    if (desc && !desc.set) {
      Object.defineProperty(URL.prototype, 'protocol', {
        get: desc.get,
        set: function (val) {
          if (this._url && typeof val === 'string') {
            const proto = val.endsWith(':') ? val : val + ':';
            this._url = this._url.replace(/^([a-zA-Z][a-zA-Z\d+\-.]*):/, proto);
          }
        },
        configurable: true,
        enumerable: true,
      });
    }
  } catch {
    // Ignore if already defined or restricted
  }
}
