import Foundation
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers
struct Shape: Decodable { let d: String; let fill: String; let tx: Double; let ty: Double; let scale: Double }
struct Board: Decodable { let width: Int; let height: Int; let shapes: [Shape] }
func color(_ hex: String) -> CGColor {
    let value = UInt32(hex.dropFirst(), radix: 16)!
    return CGColor(colorSpace: CGColorSpace(name: CGColorSpace.sRGB)!, components: [CGFloat((value >> 16) & 255)/255, CGFloat((value >> 8) & 255)/255, CGFloat(value & 255)/255, 1])!
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

for argument in CommandLine.arguments.dropFirst() {
    let input = URL(fileURLWithPath: argument)
    let board = try JSONDecoder().decode(Board.self, from: Data(contentsOf: input))
    let context = CGContext(data: nil, width: board.width, height: board.height, bitsPerComponent: 8, bytesPerRow: board.width*4, space: CGColorSpace(name: CGColorSpace.sRGB)!, bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
    context.translateBy(x: 0, y: CGFloat(board.height)); context.scaleBy(x: 1, y: -1)
    for shape in board.shapes {
        context.saveGState()
        context.setFillColor(color(shape.fill))
        context.translateBy(x: CGFloat(shape.tx), y: CGFloat(shape.ty))
        context.scaleBy(x: CGFloat(shape.scale), y: CGFloat(shape.scale))
        context.addPath(path(shape.d)); context.drawPath(using: .eoFill)
        context.restoreGState()
    }
    let output = input.deletingPathExtension().appendingPathExtension("png")
    let destination = CGImageDestinationCreateWithURL(output as CFURL, UTType.png.identifier as CFString, 1, nil)!
    CGImageDestinationAddImage(destination, context.makeImage()!, nil)
    assert(CGImageDestinationFinalize(destination))
    print(output.path)
}
