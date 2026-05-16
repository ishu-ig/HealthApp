const PDFDocument       = require("pdfkit")
const path              = require("path")
const fs                = require("fs")
const DoctorAppointment = require("../models/DoctorAppointment")
const Invoice           = require("../models/DoctorInvoice")

// ── Palette (Deep Rose / Purple) ──────────────────────────────────────────────
const C = {
  dark:     "#1F1235", mid:      "#6D28D9", light:    "#F5F3FF",
  acc:      "#DB2777", accBg:    "#FCE7F3", accDark:  "#831843",
  grn:      "#047857", grnBg:    "#D1FAE5",
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
function buildDoctorInvoicePDF(appointment, invoiceNumber) {
  return new Promise((resolve, reject) => {
    const dir = path.join(__dirname, "../public/invoices")
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, {recursive:true})
    const filePath = path.join(dir, `${invoiceNumber}.pdf`)
    const stream   = fs.createWriteStream(filePath)

    const patient       = appointment.user     || {}
    const doctor        = appointment.doctor   || {}
    const hospital      = appointment.hospital || {}
    const fees          = Number(appointment.fees || 0)
    const platformFee   = 25        // fixed platform convenience fee
    const slotFee       = 50        // fixed reporting slot fee
    const total         = fees + platformFee + slotFee
    const apptDate      = fmtDate(appointment.date)
    const apptTime      = appointment.appointmentTime || "—"
    const reportingTime = appointment.reportingTime   || "—"
    const payMode       = appointment.paymentMode     || "Cash"
    const payStatus     = appointment.paymentStatus   || "Pending"
    const apptStatus    = appointment.status          || "Pending"
    const apptMode      = appointment.appointmentMode || "Offline"
    const serviceType   = appointment.serviceType     || "Consultation"
    const invoiceDate   = fmtDate(appointment.createdAt)

    const siteName    = process.env.SITE_NAME    || "MediConsult"
    const siteAddress = process.env.SITE_ADDRESS || "Tower 7, Medical Hub, Bengaluru - 560001"
    const siteEmail   = process.env.SITE_EMAIL   || "appointments@mediconsult.in"
    const sitePhone   = process.env.SITE_PHONE   || "+91 80808 09090"

    const doc = new PDFDocument({margin:0, size:"A4"})
    doc.pipe(stream)
    const W=595, M=40

    // Background
    fillRect(doc, 0, 0, W, 841, C.off)

    // Header
    fillRect(doc, 0, 0, W, 118, C.dark)
    doc.save().opacity(0.04).circle(490,-10,100).fill(C.white).circle(525,-105,65).fill(C.white).restore()

    doc.fontSize(F.h1).font("Helvetica-Bold").fillColor(C.white).text(siteName, M, 26)
    doc.fontSize(F.xs).font("Helvetica").fillColor("#9B8FBE").text(siteAddress, M, 54).text(`${siteEmail}  ·  ${sitePhone}`, M, 66)

    doc.fontSize(F.xs).font("Helvetica-Bold").fillColor("#8B6FAE")
       .text("APPOINTMENT RECEIPT", 0, 26, {align:"right", width:W-M, characterSpacing:2})
    doc.fontSize(F.h2).font("Helvetica-Bold").fillColor(C.white).text(invoiceNumber, 0, 40, {align:"right", width:W-M})
    doc.fontSize(F.xs).font("Helvetica").fillColor("#8B6FAE").text(invoiceDate, 0, 64, {align:"right", width:W-M})

    // Rose accent bar
    fillRect(doc, 0, 118, W, 3, C.acc)

    // Patient Details
    let y = 140
    doc.fontSize(F.xs).font("Helvetica-Bold").fillColor(C.acc)
       .text("PATIENT DETAILS", M, y, {characterSpacing:1.5})
    y += 13
    doc.fontSize(F.h3).font("Helvetica-Bold").fillColor(C.ink).text(patient.name||"—", M, y)
    y += 15
    doc.fontSize(F.body).font("Helvetica").fillColor(C.inkMid)
    const addr = [patient.address, patient.city, patient.state, patient.pin].filter(Boolean)
    if (addr.length) { doc.text(addr.join(", "), M, y, {width:215}); y += doc.heightOfString(addr.join(", "), {width:215}) + 4 }
    if (patient.phone) { doc.text(`Phone: ${patient.phone}`, M, y); y+=13 }
    if (patient.email) { doc.text(`Email: ${patient.email}`, M, y); y+=13 }

    // Appointment Info Card
    const cx=328, cy=138, cw=227
    const isPaid = /paid|done|success/i.test(payStatus)
    const rows = [
      ["Receipt ID",    String(appointment._id||invoiceNumber).slice(-14)],
      ["Doctor",        doctor.name         || "—"],
      ["Hospital",      hospital.name       || "—"],
      ["Service Type",  serviceType],
      ["Mode",          apptMode],
      ["Date",          apptDate],
    ]
    const ch = 22 + rows.length*18 + 30
    fillRect(doc, cx, cy, cw, ch, C.white, 5)
    strokeBox(doc, cx, cy, cw, ch, C.border, 0.5, 5)
    fillRect(doc, cx, cy, cw, 20, C.light, 5)
    fillRect(doc, cx, cy+14, cw, 6, C.light)
    doc.fontSize(F.xs).font("Helvetica-Bold").fillColor(C.mid)
       .text("APPOINTMENT DETAILS", cx+12, cy+6, {lineBreak:false})

    let iy = cy+26
    rows.forEach(([label, val]) => {
      doc.fontSize(F.sm).font("Helvetica-Bold").fillColor(C.inkLight).text(label, cx+12, iy, {width:88, lineBreak:false})
      doc.fontSize(F.sm).font("Helvetica").fillColor(C.ink).text(String(val), cx+110, iy, {width:109, lineBreak:false})
      hLine(doc, iy+14, cx, cx+cw, C.rule, 0.4)
      iy += 18
    })
    doc.fontSize(F.sm).font("Helvetica-Bold").fillColor(C.inkLight).text("Payment Status", cx+12, iy, {lineBreak:false})
    pill(doc, cx+110, iy, payStatus,
      isPaid ? C.grnBg  : C.amberBg,
      isPaid ? C.grn    : C.amberDark
    )

    // Fee Breakdown Table
    y = Math.max(y+24, cy+ch+20)
    const tableW = W-2*M
    const cols = {
      no:   {x:M,      w:24 },
      desc: {x:M+28,   w:300},
      mode: {x:M+332,  w:100},
      amt:  {x:M+436,  w:W-M-(M+436)},
    }

    const HH=24
    fillRect(doc, M, y, tableW, HH, C.dark)
    doc.fontSize(F.xs).font("Helvetica-Bold").fillColor("#C8A8D8")
    ;[
      ["#",            cols.no,   "center"],
      ["DESCRIPTION",  cols.desc, "left"  ],
      ["PAYMENT MODE", cols.mode, "center"],
      ["AMOUNT",       cols.amt,  "right" ],
    ].forEach(([lbl,col,align]) =>
      doc.text(lbl, col.x, y+7, {width:col.w, align, characterSpacing:0.8, lineBreak:false})
    )
    y += HH

    const feeRows = [
      [`Consultation Fee (${serviceType}) — ${doctor.name||"Doctor"}`, payMode, fees],
      [`Reporting Slot Booking`,                                        payMode, slotFee],
      [`Platform Convenience Fee`,                                      payMode, platformFee],
    ]
    feeRows.forEach(([desc, mode, amt], i) => {
      const rh = 22
      fillRect(doc, M, y, tableW, rh, i%2===0 ? C.white : C.rowAlt)
      hLine(doc, y, M, M+tableW, C.rule, 0.4)
      doc.fontSize(F.sm).font("Helvetica").fillColor(C.inkLight)
         .text(String(i+1), cols.no.x, y+6, {width:cols.no.w, align:"center", lineBreak:false})
      doc.font("Helvetica-Bold").fillColor(C.ink)
         .text(desc, cols.desc.x, y+6, {width:cols.desc.w, ellipsis:true, lineBreak:false})
      doc.font("Helvetica").fillColor(C.inkMid)
         .text(mode, cols.mode.x, y+6, {width:cols.mode.w, align:"center", lineBreak:false})
      doc.font("Helvetica-Bold").fillColor(C.ink)
         .text(currency(amt), cols.amt.x, y+6, {width:cols.amt.w, align:"right", lineBreak:false})
      y += rh
    })

    hLine(doc, y, M, M+tableW, C.border, 0.8)
    y += 14

    // Totals
    const tx=370, trw=W-M-tx
    doc.fontSize(F.body).font("Helvetica").fillColor(C.inkLight)
       .text("Consultation Fee", tx, y, {width:100, lineBreak:false})
    doc.fillColor(C.inkMid)
       .text(currency(fees), tx+100, y, {width:trw-100, align:"right", lineBreak:false})
    y += 16
    doc.fillColor(C.inkLight)
       .text("Other Charges", tx, y, {width:100, lineBreak:false})
    doc.fillColor(C.inkMid)
       .text(currency(platformFee+slotFee), tx+100, y, {width:trw-100, align:"right", lineBreak:false})
    y += 16
    hLine(doc, y, tx, W-M, C.border, 0.5)
    y += 8
    fillRect(doc, tx-10, y-4, trw+10, 24, C.dark, 4)
    doc.fontSize(F.body).font("Helvetica-Bold").fillColor(C.white)
       .text("Total Payable",  tx,    y+2, {width:100, lineBreak:false})
       .text(currency(total),  tx+100,y+2, {width:trw-100, align:"right", lineBreak:false})
    y += 32

    // Scheduling strip
    fillRect(doc, M, y, tableW, 52, C.light, 5)
    strokeBox(doc, M, y, tableW, 52, "#DDD6FE", 0.5, 5)
    fillRect(doc, M, y, 4, 52, C.acc)
    doc.fontSize(F.sm).font("Helvetica-Bold").fillColor(C.mid)
       .text(
         `Appointment: ${apptDate}  ·  Time: ${apptTime}  ·  Reporting: ${reportingTime}  ·  ${hospital.name||siteName}`,
         M+18, y+10, {width:tableW-30}
       )
    doc.fontSize(F.xs).font("Helvetica").fillColor(C.inkMid)
       .text(`Please carry a valid photo ID and this receipt. Rescheduling: ${siteEmail}`, M+18, y+32, {lineBreak:false})
    y += 62

    // Appointment status badge
    fillRect(doc, M, y, tableW, 30, C.rowAlt, 4)
    strokeBox(doc, M, y, tableW, 30, C.border, 0.5, 4)
    doc.fontSize(F.sm).font("Helvetica-Bold").fillColor(C.inkMid)
       .text("Appointment Status:", M+14, y+9, {lineBreak:false})
    pill(doc, M+140, y+8, apptStatus, C.light, C.mid)
    doc.fontSize(F.sm).font("Helvetica-Bold").fillColor(C.inkMid)
       .text("Mode:", M+240, y+9, {lineBreak:false})
    pill(doc, M+276, y+8, apptMode, C.accBg, C.accDark)

    // Footer
    fillRect(doc, 0, 795, W, 46, C.dark)
    doc.fontSize(F.xs).font("Helvetica").fillColor("#7A5A9A")
       .text(`© ${new Date().getFullYear()} ${siteName}  ·  Appointment confirmation receipt  ·  Computer-generated — no signature required.`,
         0, 813, {align:"center", width:W})

    doc.end()
    stream.on("finish", () => resolve(filePath))
    stream.on("error",  reject)
  })
}

// ── Route Handler ─────────────────────────────────────────────────────────────
async function createDoctorInvoice(req, res) {
  try {
    const { appointmentId } = req.body
    if (!appointmentId) return res.status(400).json({result:"Fail", reason:"appointmentId is required."})

    const appointment = await DoctorAppointment.findById(appointmentId)
      .populate("user")
      .populate("doctor")
      .populate("hospital")

    if (!appointment) return res.status(404).json({result:"Fail", reason:"Appointment not found."})

    const existing = await Invoice.findOne({order: appointmentId})
    if (existing) return res.json({result:"Done", invoice:{invoiceNumber: existing.invoiceNumber}})

    const datePart      = new Date().toISOString().slice(0,10).replace(/-/g,"")
    const rand          = Math.floor(1000 + Math.random()*9000)
    const invoiceNumber = `DREC-${datePart}-${rand}`

    await buildDoctorInvoicePDF(appointment, invoiceNumber)

    await new Invoice({
      user:          appointment.user?._id || appointment.user,
      order:         appointment._id,
      invoiceNumber,
    }).save()

    res.json({result:"Done", invoice:{invoiceNumber}})

  } catch (error) {
    console.error("Doctor invoice error:", error)
    res.status(500).json({result:"Fail", reason:"Failed to generate doctor appointment receipt."})
  }
}

module.exports = { createDoctorInvoice }
