const PDFDocument = require("pdfkit")
const path        = require("path")
const fs          = require("fs")
const LabCheckout = require("../models/LabtestCheckout")
const Invoice     = require("../models/LabtestInvoice")

// ── Palette (Indigo / Violet) ─────────────────────────────────────────────────
const C = {
  dark:     "#1E1B4B", mid:      "#3730A3", light:    "#EEF2FF",
  acc:      "#7C3AED", accBg:    "#EDE9FE", accDark:  "#4C1D95",
  grn:      "#065F46", grnBg:    "#D1FAE5",
  amber:    "#B45309", amberBg:  "#FEF3C7", amberDark:"#633806",
  ink:      "#1A2634", inkMid:   "#4A5E70", inkLight: "#8096A8",
  border:   "#D1DBE5", rule:     "#E8EEF4", rowAlt:   "#F5F8FB",
  white:    "#FFFFFF", off:      "#F7FAFD",
}
const F = { h1:22, h2:15, h3:11, body:9.5, sm:8.5, xs:7.5 }

// ── Helpers ───────────────────────────────────────────────────────────────────
const currency = n =>
  `Rs. ${Number(n||0).toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2})}`

const fmtDate = d =>
  new Date(d||Date.now()).toLocaleDateString("en-IN",{day:"2-digit",month:"long",year:"numeric"})

function fillRect(doc, x, y, w, h, fill, rx=0) {
  doc.save()
  rx > 0 ? doc.roundedRect(x,y,w,h,rx).fill(fill) : doc.rect(x,y,w,h).fill(fill)
  doc.restore()
}

function strokeBox(doc, x, y, w, h, clr, lw=0.5, rx=0) {
  doc.save().lineWidth(lw).strokeColor(clr)
  rx > 0 ? doc.roundedRect(x,y,w,h,rx).stroke() : doc.rect(x,y,w,h).stroke()
  doc.restore()
}

function hLine(doc, y, x1=40, x2=555, clr="#E8EEF4", lw=0.5) {
  doc.save().strokeColor(clr).lineWidth(lw).moveTo(x1,y).lineTo(x2,y).stroke().restore()
}

function pill(doc, x, y, label, bg, fg) {
  doc.fontSize(F.xs).font("Helvetica-Bold")
  const pw = doc.widthOfString(label) + 14
  fillRect(doc, x, y, pw, 13, bg, 6)
  doc.fillColor(fg).text(label, x+7, y+2, {lineBreak:false})
}

// ── PDF Builder ───────────────────────────────────────────────────────────────
function buildLabInvoicePDF(order, invoiceNumber) {
  return new Promise((resolve, reject) => {
    const dir = path.join(__dirname, "../public/invoices")
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, {recursive:true})
    const filePath = path.join(dir, `${invoiceNumber}.pdf`)
    const stream   = fs.createWriteStream(filePath)

    const customer       = order.user             || {}
    const labtests       = Array.isArray(order.labtests) ? order.labtests : []
    const subtotal       = Number(order.subtotal   || 0)
    const serviceCharge  = Number(order.deliveryStatus || 0)   // schema field name
    const total          = Number(order.total      || subtotal + serviceCharge)
    const orderDate      = fmtDate(order.createdAt)
    const payMode        = order.paymentMode       || "COD"
    const payStatus      = order.paymentStatus     || "Pending"
    const orderStatus    = order.orderStatus       || "Order is Placed"
    const reservationDate = order.reservationDate
      ? new Date(order.reservationDate).toLocaleDateString("en-IN",{day:"2-digit",month:"long",year:"numeric"})
      : "—"

    const siteName    = process.env.SITE_NAME    || "DiagnostiCare Labs"
    const siteAddress = process.env.SITE_ADDRESS || "Plot 9, Science Park, Hyderabad - 500081"
    const siteEmail   = process.env.SITE_EMAIL   || "labs@diagnosticare.in"
    const sitePhone   = process.env.SITE_PHONE   || "+91 90909 12345"

    const doc = new PDFDocument({margin:0, size:"A4"})
    doc.pipe(stream)
    const W=595, M=40

    // Background
    fillRect(doc, 0, 0, W, 841, C.off)

    // Header
    fillRect(doc, 0, 0, W, 118, C.dark)
    doc.save().opacity(0.04).circle(470,-15,95).fill(C.white).circle(505,-100,65).fill(C.white).restore()

    doc.fontSize(F.h1).font("Helvetica-Bold").fillColor(C.white).text(siteName, M, 26)
    doc.fontSize(F.xs).font("Helvetica").fillColor("#8B8FBE").text(siteAddress, M, 54).text(`${siteEmail}  ·  ${sitePhone}`, M, 66)

    doc.fontSize(F.xs).font("Helvetica-Bold").fillColor("#7B7FB5")
       .text("LAB TEST INVOICE", 0, 26, {align:"right", width:W-M, characterSpacing:2})
    doc.fontSize(F.h2).font("Helvetica-Bold").fillColor(C.white).text(invoiceNumber, 0, 40, {align:"right", width:W-M})
    doc.fontSize(F.xs).font("Helvetica").fillColor("#7B7FB5").text(orderDate, 0, 64, {align:"right", width:W-M})

    // Violet accent bar
    fillRect(doc, 0, 118, W, 3, C.acc)

    // Patient Details
    let y = 140
    doc.fontSize(F.xs).font("Helvetica-Bold").fillColor(C.acc)
       .text("PATIENT DETAILS", M, y, {characterSpacing:1.5})
    y += 13
    doc.fontSize(F.h3).font("Helvetica-Bold").fillColor(C.ink).text(customer.name||"—", M, y)
    y += 15
    doc.fontSize(F.body).font("Helvetica").fillColor(C.inkMid)
    const addr = [customer.address, customer.city, customer.state, customer.pin].filter(Boolean)
    if (addr.length) { doc.text(addr.join(", "), M, y, {width:215}); y += doc.heightOfString(addr.join(", "), {width:215}) + 4 }
    if (customer.phone) { doc.text(`Phone: ${customer.phone}`, M, y); y+=13 }
    if (customer.email) { doc.text(`Email: ${customer.email}`, M, y); y+=13 }

    // Info Card
    const cx=328, cy=138, cw=227
    const isPaid = /paid|success/i.test(payStatus)
    const rows = [
      ["Order ID",         String(order._id||invoiceNumber).slice(-14)],
      ["Payment Mode",     payMode],
      ["Order Status",     orderStatus],
      ["Reservation Date", reservationDate],
    ]
    const ch = 22 + rows.length*18 + 30
    fillRect(doc, cx, cy, cw, ch, C.white, 5)
    strokeBox(doc, cx, cy, cw, ch, C.border, 0.5, 5)
    fillRect(doc, cx, cy, cw, 20, C.light, 5)
    fillRect(doc, cx, cy+14, cw, 6, C.light)
    doc.fontSize(F.xs).font("Helvetica-Bold").fillColor(C.mid)
       .text("ORDER DETAILS", cx+12, cy+6, {lineBreak:false})
    let iy = cy+26
    rows.forEach(([label, val]) => {
      doc.fontSize(F.sm).font("Helvetica-Bold").fillColor(C.inkLight).text(label, cx+12, iy, {width:88, lineBreak:false})
      doc.fontSize(F.sm).font("Helvetica").fillColor(C.ink).text(val, cx+110, iy, {width:109, lineBreak:false})
      hLine(doc, iy+14, cx, cx+cw, C.rule, 0.4)
      iy += 18
    })
    doc.fontSize(F.sm).font("Helvetica-Bold").fillColor(C.inkLight).text("Payment Status", cx+12, iy, {lineBreak:false})
    pill(doc, cx+110, iy, payStatus, isPaid ? C.grnBg : "#FEF3C7", isPaid ? C.grn : C.amberDark)

    // Items Table
    y = Math.max(y+24, cy+ch+20)
    const tableW = W-2*M
    const cols = {
      no:    {x:M,      w:24 },
      name:  {x:M+28,   w:178},
      lab:   {x:M+210,  w:100},
      samp:  {x:M+314,  w:72 },
      price: {x:M+390,  w:68 },
      svc:   {x:M+462,  w:W-M-(M+462)},
    }

    const HH=24
    fillRect(doc, M, y, tableW, HH, C.dark)
    doc.fontSize(F.xs).font("Helvetica-Bold").fillColor("#AAABD8")
    ;[
      ["#",          cols.no,    "center"],
      ["TEST NAME",  cols.name,  "left"  ],
      ["LAB",        cols.lab,   "left"  ],
      ["SAMPLE",     cols.samp,  "left"  ],
      ["PRICE",      cols.price, "right" ],
      ["SVC CHARGE", cols.svc,   "right" ],
    ].forEach(([lbl,col,align]) =>
      doc.text(lbl, col.x, y+7, {width:col.w, align, characterSpacing:0.8, lineBreak:false})
    )
    y += HH

    labtests.forEach((item, i) => {
      const rh         = 22
      const name       = item.name       || item.labtest?.name       || "—"
      const labName    = item.lab        || item.labtest?.lab?.name  || "—"
      const sampleType = item.sampleType || item.labtest?.sampleType || "—"
      const price      = Number(item.price || item.labtest?.finalPrice || 0)
      const svcCharge  = Number(item.serviceCharge || 0)

      fillRect(doc, M, y, tableW, rh, i%2===0 ? C.white : C.rowAlt)
      hLine(doc, y, M, M+tableW, C.rule, 0.4)

      doc.fontSize(F.sm).font("Helvetica").fillColor(C.inkLight)
         .text(String(i+1), cols.no.x, y+6, {width:cols.no.w, align:"center", lineBreak:false})
      doc.font("Helvetica-Bold").fillColor(C.ink)
         .text(name, cols.name.x, y+6, {width:cols.name.w, ellipsis:true, lineBreak:false})
      doc.font("Helvetica").fillColor(C.inkMid)
         .text(labName,          cols.lab.x,   y+6, {width:cols.lab.w,   lineBreak:false})
         .text(sampleType,       cols.samp.x,  y+6, {width:cols.samp.w,  lineBreak:false})
         .text(currency(price),  cols.price.x, y+6, {width:cols.price.w, align:"right", lineBreak:false})
      const svcStr = svcCharge === 0 ? "FREE" : currency(svcCharge)
      doc.font("Helvetica-Bold").fillColor(svcCharge===0 ? C.grn : C.ink)
         .text(svcStr, cols.svc.x, y+6, {width:cols.svc.w, align:"right", lineBreak:false})
      y += rh
    })

    hLine(doc, y, M, M+tableW, C.border, 0.8)
    y += 14

    // Totals
    const tx=370, trw=W-M-tx
    doc.fontSize(F.body).font("Helvetica").fillColor(C.inkLight)
       .text("Subtotal",       tx, y, {width:80, lineBreak:false})
    doc.fillColor(C.inkMid)
       .text(currency(subtotal), tx+80, y, {width:trw-80, align:"right", lineBreak:false})
    y += 16
    doc.fillColor(C.inkLight)
       .text("Service Charge", tx, y, {width:80, lineBreak:false})
    doc.fillColor(C.inkMid)
       .text(currency(serviceCharge), tx+80, y, {width:trw-80, align:"right", lineBreak:false})
    y += 16
    hLine(doc, y, tx, W-M, C.border, 0.5)
    y += 8
    fillRect(doc, tx-10, y-4, trw+10, 24, C.dark, 4)
    doc.fontSize(F.body).font("Helvetica-Bold").fillColor(C.white)
       .text("Grand Total",   tx,    y+2, {width:80, lineBreak:false})
       .text(currency(total), tx+80, y+2, {width:trw-80, align:"right", lineBreak:false})
    y += 32

    // Reservation strip
    if (order.reservationDate) {
      fillRect(doc, M, y, tableW, 46, C.light, 5)
      strokeBox(doc, M, y, tableW, 46, "#C7D2FE", 0.5, 5)
      fillRect(doc, M, y, 4, 46, C.acc)
      doc.fontSize(F.sm).font("Helvetica-Bold").fillColor(C.mid)
         .text(`Test Reservation: ${reservationDate}  —  Please arrive 15 minutes early. Carry valid ID & this receipt.`, M+18, y+10, {width:tableW-30})
      doc.fontSize(F.xs).font("Helvetica").fillColor(C.inkMid)
         .text(`Questions? ${siteEmail}`, M+18, y+30, {lineBreak:false})
      y += 56
    }

    // Footer
    fillRect(doc, 0, 795, W, 46, C.dark)
    doc.fontSize(F.xs).font("Helvetica").fillColor("#5A5A8A")
       .text(`© ${new Date().getFullYear()} ${siteName}  ·  NABL Accredited  ·  Computer-generated invoice — no signature required.`,
         0, 813, {align:"center", width:W})

    doc.end()
    stream.on("finish", () => resolve(filePath))
    stream.on("error",  reject)
  })
}

// ── Route Handler ─────────────────────────────────────────────────────────────
async function createLabInvoice(req, res) {
  try {
    const { orderId } = req.body
    if (!orderId) return res.status(400).json({result:"Fail", reason:"orderId is required."})

    const order = await LabCheckout.findById(orderId).populate("user")
    if (!order) return res.status(404).json({result:"Fail", reason:"Order not found."})

    const existing = await Invoice.findOne({order: orderId})
    if (existing) return res.json({result:"Done", invoice:{invoiceNumber: existing.invoiceNumber}})

    const datePart      = new Date().toISOString().slice(0,10).replace(/-/g,"")
    const rand          = Math.floor(1000 + Math.random()*9000)
    const invoiceNumber = `LINV-${datePart}-${rand}`

    await buildLabInvoicePDF(order, invoiceNumber)

    await new Invoice({
      user:          order.user?._id || order.user,
      order:         order._id,
      invoiceNumber,
    }).save()

    res.json({result:"Done", invoice:{invoiceNumber}})

  } catch (error) {
    console.error("Lab invoice error:", error)
    res.status(500).json({result:"Fail", reason:"Failed to generate lab invoice."})
  }
}

module.exports = { createLabInvoice }
