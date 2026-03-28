import ScreenSaver
import WebKit

class WordSaverView: ScreenSaverView {
    private var webView: WKWebView?

    override init?(frame: NSRect, isPreview: Bool) {
        super.init(frame: frame, isPreview: isPreview)
    }

    @available(*, unavailable)
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    override var hasConfigureSheet: Bool { false }
    override var configureSheet: NSWindow? { nil }

    override func startAnimation() {
        super.startAnimation()
        guard webView == nil else { return }

        let config = WKWebViewConfiguration()
        config.preferences.setValue(true, forKey: "allowFileAccessFromFileURLs")

        let wv = WKWebView(frame: bounds, configuration: config)
        wv.autoresizingMask = [.width, .height]
        wv.layer?.backgroundColor = NSColor.black.cgColor
        wv.setValue(true, forKey: "drawsTransparentBackground")

        // Disable occlusion detection — without this, macOS Sonoma+ pauses
        // WKWebView rendering because the screensaver view hierarchy makes
        // it think the WebView is hidden (Apple FB13094564)
        let sel = NSSelectorFromString("_setWindowOcclusionDetectionEnabled:")
        if wv.responds(to: sel) {
            wv.perform(sel, with: false)
        }

        addSubview(wv)
        webView = wv

        loadHTML()
    }

    override func stopAnimation() {
        super.stopAnimation()
        webView?.removeFromSuperview()
        webView = nil
    }

    override func animateOneFrame() {
        super.animateOneFrame()
    }

    private func loadHTML() {
        let bundle = Bundle(for: type(of: self))
        guard let htmlURL = bundle.url(forResource: "index", withExtension: "html") else {
            return
        }
        let resourceDir = bundle.resourceURL ?? htmlURL.deletingLastPathComponent()
        webView?.loadFileURL(htmlURL, allowingReadAccessTo: resourceDir)
    }
}
