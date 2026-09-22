import AppKit
import CoreText
let root=URL(fileURLWithPath:CommandLine.arguments[1])
let rows=try JSONSerialization.jsonObject(with:Data(contentsOf:root.appendingPathComponent("finalists.json"))) as! [[String:Any]]
let bg=NSColor(red:0.020,green:0.039,blue:0.086,alpha:1),gold=NSColor(red:0.886,green:0.792,blue:0.475,alpha:1),ivory=NSColor(red:0.949,green:0.945,blue:0.922,alpha:1),muted=NSColor(red:0.66,green:0.71,blue:0.79,alpha:1)
let W=1440,H=940
for (i,r) in rows.enumerated(){
 let file=root.appendingPathComponent(r["file"] as! String)
 CTFontManagerRegisterFontsForURL(file as CFURL,.process,nil)
 let desc=(CTFontManagerCreateFontDescriptorsFromURL(file as CFURL) as! [CTFontDescriptor])[0]
 let ct=CTFontCreateWithFontDescriptor(desc,72,nil),name=CTFontCopyPostScriptName(ct) as String
 let rep=NSBitmapImageRep(bitmapDataPlanes:nil,pixelsWide:W,pixelsHigh:H,bitsPerSample:8,samplesPerPixel:4,hasAlpha:true,isPlanar:false,colorSpaceName:.deviceRGB,bytesPerRow:W*4,bitsPerPixel:32)!
 NSGraphicsContext.saveGraphicsState();NSGraphicsContext.current=NSGraphicsContext(bitmapImageRep:rep)
 bg.setFill();NSRect(x:0,y:0,width:W,height:H).fill()
 func text(_ s:String,_ x:CGFloat,_ top:CGFloat,_ size:CGFloat,_ color:NSColor,_ custom:Bool=false,_ width:CGFloat=1280){
  let font=custom ? NSFont(name:name,size:size)! : NSFont.systemFont(ofSize:size,weight:.regular)
  let at:[NSAttributedString.Key:Any]=[.font:font,.foregroundColor:color]
  let h=(s as NSString).boundingRect(with:NSSize(width:width,height:1000),options:[.usesLineFragmentOrigin,.usesFontLeading],attributes:at).height
  (s as NSString).draw(in:NSRect(x:x,y:CGFloat(H)-top-h,width:width,height:h+1),withAttributes:at)
 }
 NSImage(contentsOf:root.appendingPathComponent("logo.png"))!.draw(in:NSRect(x:72,y:H-114,width:110,height:66))
 text("0\(i+1)  /  \(r["name"]!)",1050,54,18,gold)
 text(r["role"] as! String,1050,86,13,muted)
 gold.withAlphaComponent(0.28).setFill();NSRect(x:72,y:H-148,width:1296,height:1).fill()
 text("Меньше рутины —",72,201,78,ivory,true)
 text("больше времени на клиентов",72,297,78,ivory,true)
 text(r["brief"] as! String,72,442,18,gold)
 text("Всё начинается с вас",72,528,44,ivory,true,760)
 text("Данные, история и заметки о клиентах —\nв одном пространстве вашей практики.",72,601,21,muted,false,760)
 text("ПРОБА МАЛОГО ЗАГОЛОВКА / 36 PX",925,519,11,gold,false,440)
 text("От записи клиента\nдо консультации —\nвсё под рукой",925,555,36,ivory,true,440)
 gold.withAlphaComponent(0.28).setFill();NSRect(x:72,y:H-760,width:1296,height:1).fill()
 text("Аа Бб Дд Ёё Жж Йй Лл Фф Цц Щщ Ъъ Ыы Ьь Ээ Юю Яя",72,794,28,ivory,true)
 text("66 / 66 русских букв  ·  "+(r["author"] as! String),72,874,13,muted)
 text("ELEVENHOUSE / TYPE STUDY 02",1070,874,10,gold,false,300)
 NSGraphicsContext.restoreGraphicsState()
 try rep.representation(using:.png,properties:[:])!.write(to:root.appendingPathComponent((r["id"] as! String)+".png"))
}
