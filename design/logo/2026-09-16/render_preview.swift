import Foundation
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers

let directory = URL(fileURLWithPath: CommandLine.arguments[1])
let source = try String(contentsOf: directory.appendingPathComponent("preview.svg"), encoding: .utf8)
let context = CGContext(data: nil, width: 1600, height: 1020, bitsPerComponent: 8, bytesPerRow: 6400, space: CGColorSpaceCreateDeviceRGB(), bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
context.translateBy(x: 0, y: 1020)
context.scaleBy(x: 1, y: -1)
func color(_ hex: String) -> CGColor {
    let value = UInt32(hex.dropFirst(), radix: 16)!
    return CGColor(red: CGFloat((value >> 16) & 255)/255, green: CGFloat((value >> 8) & 255)/255, blue: CGFloat(value & 255)/255, alpha: 1)
}
func matches(_ pattern: String, _ input: String) -> [[String]] {
    let ns = input as NSString
    return try! NSRegularExpression(pattern: pattern).matches(in: input, range: NSRange(location: 0, length: ns.length)).map { match in
        (0..<match.numberOfRanges).map { ns.substring(with: match.range(at: $0)) }
    }
}
func path(_ data: String) -> CGPath {
    let tokens = matches("[MCLHVZ]|-?[0-9.]+", data).map { $0[0] }
    let p = CGMutablePath()
    var i = 0
    func number() -> CGFloat { defer { i += 1 }; return CGFloat(Double(tokens[i])!) }
    while i < tokens.count {
        let cmd = tokens[i]; i += 1
        switch cmd {
        case "M": p.move(to: CGPoint(x: number(), y: number()))
        case "L": p.addLine(to: CGPoint(x: number(), y: number()))
        case "H": p.addLine(to: CGPoint(x: number(), y: p.currentPoint.y))
        case "V": p.addLine(to: CGPoint(x: p.currentPoint.x, y: number()))
        case "C":
            let a = CGPoint(x: number(), y: number()), b = CGPoint(x: number(), y: number()), end = CGPoint(x: number(), y: number())
            p.addCurve(to: end, control1: a, control2: b)
        case "Z": p.closeSubpath()
        default: fatalError("Unsupported path command")
        }
    }
    return p
}
context.setFillColor(color("#010308")); context.fill(CGRect(x: 0, y: 0, width: 1600, height: 1020))
context.setFillColor(color("#F2F1EB")); context.fill(CGRect(x: 0, y: 800, width: 1600, height: 220))
for group in matches("<g fill=\"(#[A-Fa-f0-9]+)\"[^>]*transform=\"translate\\(([0-9.]+) ([0-9.]+)\\) scale\\(([0-9.]+)\\)\">([\\s\\S]*?)</g>", source) {
    context.saveGState()
    context.setFillColor(color(group[1]))
    context.translateBy(x: CGFloat(Double(group[2])!), y: CGFloat(Double(group[3])!))
    let scale = CGFloat(Double(group[4])!); context.scaleBy(x: scale, y: scale)
    for letter in matches("<path transform=\"translate\\(([0-9.]+) 0\\)\" d=\"([^\"]+)\"/>", group[5]) {
        context.saveGState(); context.translateBy(x: CGFloat(Double(letter[1])!), y: 0)
        context.addPath(path(letter[2])); context.drawPath(using: .eoFill); context.restoreGState()
    }
    context.restoreGState()
}
context.setFillColor(color("#E2CA79")); context.fill(CGRect(x: 1400, y: 875, width: 60, height: 60))
let image = context.makeImage()!
let output = directory.appendingPathComponent("preview.png")
let destination = CGImageDestinationCreateWithURL(output as CFURL, UTType.png.identifier as CFString, 1, nil)!
CGImageDestinationAddImage(destination, image, nil)
assert(CGImageDestinationFinalize(destination))
print(output.path)
